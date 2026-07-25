export const en = {
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
  },

  site: {
    name: 'Foyer',
    tagline: 'Plan your smart home before the walls close up.',
    nav: { home: 'Home', wizard: 'Guide', planner: 'Planner', guides: 'Learn' },
    footer: 'Built for people wiring their first (or last) house. Open source.',
    language: 'Language',
  },

  home: {
    heroKicker: 'Smart home planning, done early',
    heroTitle: 'The smart home decisions that matter happen before you move in',
    heroSubtitle:
      'Protocols, cables, coverage, budget — Foyer walks you through the choices that are expensive to change later, then lets you plan your actual house, room by room, in 3D.',
    ctaWizard: 'Start the guide',
    ctaPlanner: 'Plan your house',
    heroHint: 'This is a real plan — drag to orbit',
    features: {
      wizard: {
        title: 'A guide that asks the right questions',
        body: 'Ten questions about your project — new build or rental, size, budget, privacy — turned into concrete recommendations by rules written the way an expert would reason, not a quiz that sells you gadgets.',
      },
      planner: {
        title: 'Your house, not a generic checklist',
        body: 'Trace the rooms from your floor plan and Foyer builds a living 3D model. Plan devices per room, watch the budget update, and export a shopping list and a wiring checklist for your electrician.',
      },
      guides: {
        title: 'Understand the why',
        body: 'Every recommendation links to a plain-language guide: Zigbee vs Thread vs KNX, what to pre-wire, how to cover a large house without dead zones. No affiliate noise.',
      },
    },
    statDevices: 'devices planned',
    statBudget: 'estimated budget',
    statRooms: 'rooms',
  },

  wizard: {
    title: 'The decision guide',
    subtitle: 'A few minutes now, years of “glad we did that”. Answer what you know — everything can be revisited.',
    stepOf: (current: number, total: number) => `Question ${current} of ${total}`,
    next: 'Next',
    back: 'Back',
    seeResults: 'See my recommendations',
    restart: 'Start over',
    multiHint: 'Select all that apply',
    questions: {
      stage: {
        title: 'Where is your project at?',
        help: 'This is the single biggest factor — open walls change everything.',
        options: {
          'new-build': { label: 'New build', hint: 'Walls not closed yet — jackpot' },
          renovation: { label: 'Major renovation', hint: 'Some walls will open' },
          existing: { label: 'Existing home', hint: 'Working with what’s there' },
        },
      },
      size: {
        title: 'How big is the house?',
        help: 'Above ~200 m², wireless coverage and mesh density become their own project.',
        options: {
          s: { label: 'Under 100 m²' },
          m: { label: '100 – 200 m²' },
          l: { label: '200 – 350 m²' },
          xl: { label: 'Over 350 m²' },
        },
      },
      floors: {
        title: 'How many levels?',
        help: 'Count the basement and a finished attic — floors are what kill radio signals.',
        options: {
          one: { label: 'Single level' },
          two: { label: 'Two levels' },
          'three-plus': { label: 'Three or more' },
        },
      },
      ownership: {
        title: 'Do you own the place?',
        help: 'Tenants can still do a lot — just nothing that lives inside a wall.',
        options: {
          owner: { label: 'Owner' },
          tenant: { label: 'Tenant' },
        },
      },
      skill: {
        title: 'How technical are you?',
        help: 'Honest answer — this changes which hub and how much DIY we suggest.',
        options: {
          beginner: { label: 'Beginner', hint: 'I want it to just work' },
          comfortable: { label: 'Comfortable', hint: 'I can follow a good tutorial' },
          tinkerer: { label: 'Tinkerer', hint: 'YAML doesn’t scare me' },
        },
      },
      budget: {
        title: 'What’s the device budget?',
        help: 'Excluding electrician labour. You can (and should) spread it over years.',
        options: {
          starter: { label: 'Under €1,000' },
          mid: { label: '€1,000 – €3,000' },
          high: { label: '€3,000 – €8,000' },
          pro: { label: 'Over €8,000' },
        },
      },
      priorities: {
        title: 'What do you actually care about?',
        help: 'Pick the things you’d use every week — not what demos well.',
        options: {
          lighting: { label: 'Lighting' },
          climate: { label: 'Heating & cooling' },
          security: { label: 'Security & safety' },
          blinds: { label: 'Blinds & shutters' },
          energy: { label: 'Energy monitoring' },
          media: { label: 'Voice & media' },
          presence: { label: 'Presence automation' },
        },
      },
      privacy: {
        title: 'How do you feel about the cloud?',
        help: 'Local-first means everything keeps working when the internet — or a vendor — goes away.',
        options: {
          'local-only': { label: 'Local only', hint: 'My data stays home' },
          mixed: { label: 'Pragmatic mix', hint: 'Local core, cloud extras' },
          'cloud-ok': { label: 'Cloud is fine', hint: 'Convenience first' },
        },
      },
      wiring: {
        title: 'How much wiring are you up for?',
        help: 'Wired is invisible, reliable and forever — but only cheap while walls are open.',
        options: {
          'max-wired': { label: 'Wire everything possible' },
          'some-wiring': { label: 'Key runs only' },
          'no-wiring': { label: 'Wireless everything' },
        },
      },
      maintenance: {
        title: 'Set-and-forget, or hobby?',
        help: 'Both are valid — they just lead to very different systems.',
        options: {
          'set-forget': { label: 'Set and forget', hint: 'Touch it once a year' },
          tinker: { label: 'It’s a hobby', hint: 'Evenings well spent' },
        },
      },
    },
  },

  results: {
    title: 'Your recommendations',
    subtitle:
      'Based on your answers. Each card links to a guide explaining the reasoning — read those before spending money.',
    editAnswers: 'Edit answers',
    share: 'Copy share link',
    shareCopied: 'Link copied — anyone opening it sees these recommendations',
    planCta: 'Apply this to your house plan',
    readGuide: 'Read the guide',
    categories: {
      ecosystem: 'Ecosystem & hub',
      protocol: 'Protocols',
      wiring: 'Wiring & pre-wiring',
      network: 'Network & coverage',
      devices: 'Devices',
      strategy: 'Strategy',
    },
  },

  recommendations: {
    'eco-ha-green': {
      title: 'Start with Home Assistant Green',
      body: 'A plug-and-play hub that runs Home Assistant — the largest open-source smart home platform. It works with practically everything, keeps your data at home, and grows with you. Add a Zigbee/Thread USB stick and you are set for years.',
    },
    'eco-ha-standard': {
      title: 'Run Home Assistant as your brain',
      body: 'One open-source platform to unify every brand and protocol, with local control and no subscriptions. Given your comfort level, run it on a small box (Home Assistant Yellow, a mini-PC, or a Pi) so you have headroom for add-ons like camera recording and voice.',
    },
    'eco-local-first': {
      title: 'Buy local-first, always',
      body: 'You said local only — enforce it at purchase time. Prefer devices that work with Zigbee, Z-Wave, Thread or local APIs, and avoid anything that stops working when the vendor’s cloud does. A good filter: “does it work with the internet unplugged?”',
    },
    'proto-zigbee-backbone': {
      title: 'Zigbee as your workhorse',
      body: 'For sensors, buttons, bulbs and plugs, Zigbee is the sweet spot: cheap, huge device choice, battery-friendly, and it forms a mesh that gets stronger with every mains-powered device you add. One coordinator stick covers the whole system.',
    },
    'proto-thread-matter': {
      title: 'Keep an eye on Thread & Matter',
      body: 'Thread is the newer mesh with the same low-power benefits and better IP integration; Matter is the compatibility layer on top. Buying Thread-capable devices where prices are comparable is a sensible way to future-proof without betting the house on it.',
    },
    'proto-knx-consider': {
      title: 'Seriously consider KNX for the core',
      body: 'New build, healthy budget, set-and-forget: that is exactly the KNX profile. It is a wired bus standard with 30+ years of multi-vendor support — lighting, blinds and heating keep working for decades, no batteries, no pairing. Pair it with Home Assistant for the smart layer, and get quotes from a KNX integrator before the electrical plan is final.',
    },
    'proto-zwave-security': {
      title: 'Z-Wave for locks and security devices',
      body: 'For locks, sirens and security sensors, Z-Wave’s certified interoperability, encryption and separate radio band (no Wi-Fi congestion) make it the conservative, reliable choice in Europe.',
    },
    'proto-wifi-caution': {
      title: 'Ration your Wi-Fi devices',
      body: 'Wi-Fi devices are fine in small numbers — but each one competes with your laptops and streams, and cheap ones often phone home. Save Wi-Fi for high-bandwidth gear (cameras, speakers) and put the long tail of sensors on a mesh protocol instead.',
    },
    'wire-ethernet-everywhere': {
      title: 'Pull Ethernet to every room — now',
      body: 'While walls are open, Cat6a costs cents per meter; after, each run costs hundreds. Two drops per room, one to every TV/desk spot, one to each ceiling corner for future access points and cameras, all home-run to one technical panel. You will never regret a cable you pulled.',
    },
    'wire-neutral-everywhere': {
      title: 'Neutral wire in every switch box',
      body: 'Most smart switch modules need a neutral to power themselves. Ask the electrician for a neutral in every box and deep (50 mm+) boxes while they’re at it — it costs almost nothing now and decides which devices you can use for the next 30 years.',
    },
    'wire-conduits': {
      title: 'Oversize the conduits, leave pull strings',
      body: 'The cheapest insurance in a new build: bigger conduit diameters than needed, a pull string left in each, and an empty conduit from the technical room to each floor, the attic, and outside. Whatever cable standard wins in 2040, you can pull it.',
    },
    'wire-shutters': {
      title: 'Wire the shutters and blinds',
      body: 'Motorized shutters are one of the highest-satisfaction automations — but retrofitting power to each window is painful. Spec wired motors (or at least power at every window) now, controlled by per-shutter modules, and skip the proprietary remotes.',
    },
    'wire-tenant-friendly': {
      title: 'A no-drill smart home is still a real one',
      body: 'Everything you deploy should leave with you: smart bulbs instead of switch modules, plug-in adapters, battery sensors with removable tape, a hub that travels. You can automate lighting, climate, presence and security convincingly without touching a wall.',
    },
    'net-wired-aps': {
      title: 'Multiple wired access points, not repeaters',
      body: 'At your size, one router will not cover the house, and wireless repeaters halve throughput while multiplying weirdness. The reliable pattern is two or more ceiling access points, each fed by Ethernet, sharing one network name.',
    },
    'net-poe': {
      title: 'Power over Ethernet for infrastructure',
      body: 'One PoE switch in the technical room powers your access points, cameras, doorbell and wall tablets over the same cable that feeds them data — no wall warts, everything on one UPS, and remote reboot when something sulks.',
    },
    'net-mesh-density': {
      title: 'Design your mesh density',
      body: 'Zigbee and Thread meshes route through mains-powered devices, and battery sensors do not relay. In a large or multi-floor house, plan a few always-powered devices (plugs, relays) per floor as backbone — and remember thick or heated floors can need a repeater per level.',
    },
    'net-technical-room': {
      title: 'Give the system a home',
      body: 'Reserve a ventilated spot — half a closet is enough — for a small rack: patch panel, switch, router, hub, NVR, UPS. Centralizing it makes every future change a ten-minute job instead of an archaeology dig.',
    },
    'dev-presence-mmwave': {
      title: 'mmWave presence sensors for living spaces',
      body: 'Classic motion sensors go blind when you sit still; mmWave radar sees a person breathing on the sofa. Use mmWave in rooms where people linger (living room, office) and cheap PIR motion sensors in transit zones like hallways.',
    },
    'dev-energy-monitoring': {
      title: 'Measure before you optimize',
      body: 'A CT-clamp energy meter on the main panel shows the whole house in real time; smart plugs on suspect appliances find the hogs. Measuring typically pays for itself — standby loads alone often hide 5–10% of a bill.',
    },
    'dev-climate': {
      title: 'Heating is the money automation',
      body: 'Per-room control is where automation genuinely pays: smart radiator valves (or your heat pump’s integration) plus a temperature sensor per room, with schedules that follow real occupancy. Comfort goes up, bills go down.',
    },
    'dev-safety-baseline': {
      title: 'The unglamorous safety baseline',
      body: 'Before anything fun: interconnected smoke detectors on every floor, and a leak sensor under every water source — washing machine, dishwasher, water heater, each bathroom. They cost less than one insurance deductible.',
    },
    'strategy-phased-rollout': {
      title: 'Phase it — the right first euro',
      body: 'Spend in this order: hub, then the safety baseline, then lighting and presence in the three rooms you use most every day. Live with it a few months before expanding — your second batch will be much better chosen than your first.',
    },
    'strategy-wire-now-devices-later': {
      title: 'Put the money in the walls first',
      body: 'On a tight budget in a new build, infrastructure beats gadgets every time: cables, neutrals, conduits and boxes now; devices can arrive one paycheck at a time later. The reverse is not possible.',
    },
    'strategy-start-small': {
      title: 'Start narrower than you want to',
      body: 'You picked a lot of priorities — great instincts, but each domain has a learning curve. Nail one end-to-end (usually lighting) so the family trusts the system, then expand. A smart home that works at 80% beats one that impresses at 20%.',
    },
  },

  planner: {
    title: 'House planner',
    subtitle: 'Trace your floor plan, then furnish it with the right devices.',
    tabs: { plan: '2D plan', house: '3D house', list: 'Shopping list' },
    floors: 'Floors',
    addFloor: 'Add floor',
    deleteFloor: 'Delete this floor',
    deleteFloorConfirm: 'Delete this floor and all its rooms?',
    groundFloor: 'Ground floor',
    floorN: (n: number) => (n === 0 ? 'Ground floor' : n < 0 ? `Basement ${-n}` : `Floor ${n}`),
    rooms: 'Rooms',
    noRooms: 'No rooms yet — draw one on the plan.',
    drawRoom: 'Draw room',
    drawingHint:
      'Click to place corners · Backspace (or click the last corner) removes it · click the first corner or press Enter to close · Esc cancels',
    select: 'Select',
    deleteRoom: 'Delete room',
    roomName: 'Room name',
    roomType: 'Room type',
    devices: 'Devices',
    suggested: 'Suggested for this room',
    loadExample: 'Load example house',
    clearAll: 'Start from scratch',
    clearConfirm: 'Delete the whole project? This cannot be undone.',
    area: (m2: string) => `${m2} m²`,
    totalBudget: 'Estimated budget',
    totalDevices: 'Devices',
    exportJson: 'Export project',
    importJson: 'Import project',
    importError: 'That file does not look like a Foyer project.',
    print: 'Print / PDF',
    emptyList: 'No devices planned yet. Select a room and add some.',
    listHeaders: {
      device: 'Device',
      category: 'Category',
      qty: 'Qty',
      unit: 'Unit price',
      total: 'Total',
      rooms: 'Rooms',
    },
    wiringNotes: 'Wiring notes for your electrician',
    wiringNeutral: (rooms: string) =>
      `Neutral wire + deep boxes needed in: ${rooms}`,
    wiringPoE: (count: number) =>
      `${count} device(s) are best served by Ethernet/PoE — plan the runs before closing walls`,
    is3dEmpty: 'Draw at least one room on the 2D plan to see the house.',
    background: 'Plan image',
    backgroundHint:
      'Optional: load a photo/scan of your floor plan to trace over. Stored locally in your browser — it never leaves your device.',
    removeBackground: 'Remove image',
    showImage: 'Show image',
    hideImage: 'Hide image',
    roomDeleted: 'Room deleted',
    floorDeleted: 'Floor deleted',
    projectCleared: 'Project cleared',
    exported: 'Project exported',
    calibrate: 'Calibrate scale',
    calibrateHint:
      'Click both ends of a known distance on the plan — a printed dimension line works great.',
    calibrateTitle: 'Real distance',
    calibrateBody: 'Enter the real-world distance between the two points you clicked.',
    calibrateMeters: 'Distance in meters',
    calibrateDone: 'Scale calibrated — areas and budget now use real dimensions',
    calibrateInvalid: 'Enter a valid distance in meters',
    editHint:
      'Drag corners to reshape · double-click a corner to delete it · click an edge dot to add one · drag device dots to place them',
    undo: 'Undo',
    redo: 'Redo',
    profileHint: 'Adapted to your guide answers',
    planDialogTitle: 'Which floor is this plan for?',
    planDialogBody:
      'The plan and its detected rooms will be assigned to the floor you pick.',
    planDialogReplaceWarning: 'Replaces the existing plan and rooms on this floor',
    planDialogNewFloor: 'Add as a new floor',
    detect: 'Detect rooms',
    detecting: 'Analyzing the plan…',
    detected: (n: number) =>
      `${n} room${n > 1 ? 's' : ''} detected — check the shapes, then set names and types. Delete and redraw any that came out wrong.`,
    detectNone:
      'No rooms found. Works best with a clean plan: dark walls on light paper, decent contrast. You can always trace rooms by hand.',
  },

  roomTypes: {
    living: 'Living room',
    kitchen: 'Kitchen',
    dining: 'Dining room',
    bedroom: 'Bedroom',
    bathroom: 'Bathroom',
    toilet: 'Toilet',
    office: 'Office',
    hallway: 'Hallway',
    entrance: 'Entrance',
    garage: 'Garage',
    laundry: 'Laundry',
    technical: 'Technical room',
    outdoor: 'Outdoor',
    other: 'Other',
  },

  tiers: { essential: 'Essential', comfort: 'Comfort', premium: 'Premium' },

  deviceCategories: {
    hub: 'Hub',
    lighting: 'Lighting',
    climate: 'Climate',
    sensors: 'Sensors',
    security: 'Security',
    blinds: 'Blinds',
    energy: 'Energy',
    network: 'Network',
    media: 'Media',
  },

  catalog: {
    'hub-home-assistant': 'Home Assistant hub (Green or similar)',
    'switch-module': 'In-wall switch module',
    'dimmer-module': 'In-wall dimmer module',
    'smart-bulb': 'Smart bulb',
    'wireless-button': 'Wireless button / remote',
    'motion-sensor': 'Motion sensor (PIR)',
    'presence-sensor-mmwave': 'Presence sensor (mmWave)',
    'door-window-sensor': 'Door / window sensor',
    'temp-humidity-sensor': 'Temperature & humidity sensor',
    'air-quality-sensor': 'Air quality sensor (CO₂)',
    'smart-thermostat': 'Smart thermostat',
    'radiator-valve': 'Smart radiator valve',
    'smoke-detector': 'Smart smoke detector',
    'leak-sensor': 'Water leak sensor',
    'smart-lock': 'Smart lock',
    'video-doorbell': 'Video doorbell',
    'camera-outdoor': 'Outdoor camera (PoE)',
    siren: 'Indoor siren',
    'shutter-module': 'Roller shutter module',
    'curtain-motor': 'Curtain motor',
    'smart-plug': 'Smart plug with metering',
    'energy-meter': 'Whole-house energy meter (CT clamp)',
    'wifi-ap': 'Wi-Fi access point (ceiling)',
    'poe-switch': 'PoE network switch',
    'voice-satellite': 'Voice assistant satellite',
    'wall-tablet': 'Wall dashboard tablet',
  },

  guides: {
    title: 'Learn',
    subtitle: 'The reasoning behind the recommendations — written for humans, not for affiliate clicks.',
    readMore: 'Read',
    backToGuides: 'All guides',
    minRead: (n: number) => `${n} min read`,
  },
}

export type Dict = typeof en
