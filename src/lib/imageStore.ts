/**
 * Plan images are too large for localStorage (scans and photos easily
 * exceed its ~5MB quota), so they persist in IndexedDB instead,
 * keyed by floor id.
 */

const DB_NAME = 'foyer'
const STORE = 'backgrounds'

/**
 * One cached connection per page. It closes itself on `versionchange` so an
 * upgrade or delete initiated from another tab is never deadlocked by us.
 */
let dbPromise: Promise<IDBDatabase> | null = null

function openDb(): Promise<IDBDatabase> {
  dbPromise ??= new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) {
        request.result.createObjectStore(STORE)
      }
    }
    request.onsuccess = () => {
      const db = request.result
      db.onversionchange = () => {
        db.close()
        dbPromise = null
      }
      resolve(db)
    }
    request.onerror = () => {
      dbPromise = null
      reject(request.error)
    }
  })
  return dbPromise
}

async function run<T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openDb()
  return new Promise<T>((resolve, reject) => {
    const request = fn(db.transaction(STORE, mode).objectStore(STORE))
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

const available = () => typeof indexedDB !== 'undefined'

export async function saveBackground(floorId: string, dataUrl: string): Promise<void> {
  if (!available()) return
  try {
    await run('readwrite', (store) => store.put(dataUrl, floorId))
  } catch {
    // Persistence is best-effort; the in-memory copy keeps working
  }
}

export async function deleteBackground(floorId: string): Promise<void> {
  if (!available()) return
  try {
    await run('readwrite', (store) => store.delete(floorId))
  } catch {
    /* best-effort */
  }
}

export async function clearBackgrounds(): Promise<void> {
  if (!available()) return
  try {
    await run('readwrite', (store) => store.clear())
  } catch {
    /* best-effort */
  }
}

export async function loadBackgrounds(): Promise<Record<string, string>> {
  if (!available()) return {}
  try {
    const [keys, values] = await Promise.all([
      run('readonly', (store) => store.getAllKeys()),
      run('readonly', (store) => store.getAll()),
    ])
    const result: Record<string, string> = {}
    keys.forEach((key, i) => {
      if (typeof key === 'string' && typeof values[i] === 'string') {
        result[key] = values[i] as string
      }
    })
    return result
  } catch {
    return {}
  }
}
