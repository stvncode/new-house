import { useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BanknoteIcon,
  BlendIcon,
  BlindsIcon,
  BookOpenIcon,
  CableIcon,
  CheckIcon,
  CloudIcon,
  CoinsIcon,
  EqualIcon,
  FileTextIcon,
  FlaskConicalIcon,
  GemIcon,
  HammerIcon,
  HardHatIcon,
  HouseIcon,
  KeyRoundIcon,
  LightbulbIcon,
  Link2Icon,
  LockIcon,
  MenuIcon,
  MinusIcon,
  MoonIcon,
  PlugIcon,
  RadarIcon,
  RotateCcwIcon,
  ShieldIcon,
  SpeakerIcon,
  SproutIcon,
  SquareIcon,
  TerminalIcon,
  ThermometerIcon,
  WalletIcon,
  WifiIcon,
  WrenchIcon,
  ZapIcon,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useWizardStore } from '@/stores/wizard'
import { QUESTIONS, visibleQuestions } from '@/domain/wizard/questions'
import { evaluate, groupByCategory } from '@/domain/wizard/engine'
import type { Answers, Question } from '@/domain/wizard/types'
import { getDict, localizePath, type Dict, type Locale } from '@/i18n'

const ICONS: Record<string, LucideIcon> = {
  'hard-hat': HardHatIcon,
  hammer: HammerIcon,
  house: HouseIcon,
  square: SquareIcon,
  minus: MinusIcon,
  equal: EqualIcon,
  menu: MenuIcon,
  'key-round': KeyRoundIcon,
  'file-text': FileTextIcon,
  sprout: SproutIcon,
  wrench: WrenchIcon,
  terminal: TerminalIcon,
  coins: CoinsIcon,
  wallet: WalletIcon,
  banknote: BanknoteIcon,
  gem: GemIcon,
  lightbulb: LightbulbIcon,
  thermometer: ThermometerIcon,
  shield: ShieldIcon,
  blinds: BlindsIcon,
  zap: ZapIcon,
  speaker: SpeakerIcon,
  radar: RadarIcon,
  lock: LockIcon,
  blend: BlendIcon,
  cloud: CloudIcon,
  cable: CableIcon,
  plug: PlugIcon,
  wifi: WifiIcon,
  moon: MoonIcon,
  'flask-conical': FlaskConicalIcon,
}

function QuestionView({ question, dict }: { question: Question; dict: Dict }) {
  const { answers, setSingle, toggleMulti } = useWizardStore()
  const text = dict.wizard.questions[question.id]
  const answer = answers[question.id]

  return (
    <div className="flex animate-rise flex-col gap-6" key={question.id}>
      <div>
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">{text.title}</h2>
        {'help' in text && text.help && (
          <p className="mt-2 text-muted-foreground">{text.help}</p>
        )}
        {question.multi && (
          <p className="mt-1 text-sm text-primary">{dict.wizard.multiHint}</p>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {question.options.map((option) => {
          const optionText = (text.options as Record<string, { label: string; hint?: string }>)[
            option.id
          ]
          const selected = question.multi
            ? Array.isArray(answer) && answer.includes(option.id)
            : answer === option.id
          const Icon = option.icon ? ICONS[option.icon] : undefined
          return (
            <button
              key={option.id}
              onClick={() =>
                question.multi
                  ? toggleMulti(question.id, option.id)
                  : setSingle(question.id, option.id)
              }
              className={`group flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                selected
                  ? 'border-primary bg-primary/10 shadow-glow'
                  : 'border-border bg-card hover:border-primary/40 hover:bg-accent'
              }`}
            >
              {Icon && (
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                    selected
                      ? 'border-primary/50 bg-primary/15 text-primary'
                      : 'border-border bg-secondary text-muted-foreground group-hover:text-foreground'
                  }`}
                >
                  <Icon className="size-5" />
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{optionText?.label ?? option.id}</span>
                {optionText?.hint && (
                  <span className="block text-sm text-muted-foreground">{optionText.hint}</span>
                )}
              </span>
              {selected && <CheckIcon className="size-4 shrink-0 text-primary" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ResultsView({ dict, locale }: { dict: Dict; locale: Locale }) {
  const { answers, setStep, reset } = useWizardStore()
  const grouped = useMemo(() => groupByCategory(evaluate(answers)), [answers])

  return (
    <div className="flex animate-rise flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-semibold">{dict.results.title}</h2>
          <p className="mt-2 max-w-xl text-muted-foreground">{dict.results.subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              const encoded = btoa(encodeURIComponent(JSON.stringify(answers)))
              const url = `${window.location.origin}${localizePath('/wizard', locale)}?a=${encoded}`
              await navigator.clipboard.writeText(url)
              toast.success(dict.results.shareCopied)
            }}
          >
            <Link2Icon /> {dict.results.share}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setStep(0)}>
            <ArrowLeftIcon /> {dict.results.editAnswers}
          </Button>
          <Button variant="ghost" size="sm" onClick={reset}>
            <RotateCcwIcon /> {dict.wizard.restart}
          </Button>
        </div>
      </div>

      {[...grouped.entries()].map(([category, recs]) => (
        <section key={category} className="flex flex-col gap-3">
          <h3 className="text-sm font-medium uppercase tracking-widest text-primary">
            {dict.results.categories[category]}
          </h3>
          <div className="grid gap-3 lg:grid-cols-2">
            {recs.map((rec) => {
              const text =
                dict.recommendations[rec.ruleId as keyof Dict['recommendations']]
              if (!text) return null
              return (
                <Card key={rec.ruleId} className="gap-3">
                  <CardHeader>
                    <CardTitle className="text-base">{text.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col justify-between gap-4">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {text.body}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {rec.guides.map((slug) => (
                        <a
                          key={slug}
                          href={localizePath(`/guides/${slug}`, locale)}
                          className="inline-flex items-center gap-1 text-xs text-primary underline-offset-4 hover:underline"
                        >
                          <BookOpenIcon className="size-3" />
                          {dict.results.readGuide}
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      ))}

      <Card className="border-primary/40 bg-primary/5">
        <CardHeader>
          <CardTitle>{dict.results.planCta}</CardTitle>
          <CardDescription>{dict.home.features.planner.body}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild size="lg">
            <a href={localizePath('/planner', locale)}>
              {dict.home.ctaPlanner} <ArrowRightIcon />
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function WizardApp({ locale }: { locale: Locale }) {
  const dict = getDict(locale)
  const { answers, step, setStep } = useWizardStore()

  // Shared results link: ?a=<encoded answers> hydrates the store and jumps to results
  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get('a')
    if (!raw) return
    try {
      const parsed: unknown = JSON.parse(decodeURIComponent(atob(raw)))
      if (typeof parsed !== 'object' || parsed === null) return
      const incoming = parsed as Record<string, unknown>
      const valid: Answers = {}
      for (const question of QUESTIONS) {
        const value = incoming[question.id]
        if (
          typeof value === 'string' ||
          (Array.isArray(value) && value.every((v) => typeof v === 'string'))
        ) {
          valid[question.id] = value as string | string[]
        }
      }
      if (Object.keys(valid).length > 0) {
        useWizardStore.setState({ answers: valid, step: 999 })
      }
    } catch {
      // Malformed share link — ignore it
    }
  }, [])

  const questions = visibleQuestions(answers)
  const total = questions.length
  const clamped = Math.min(step, total)
  const question = clamped < total ? questions[clamped] : undefined
  const isAnswered =
    question &&
    (question.multi
      ? Array.isArray(answers[question.id]) && (answers[question.id] as string[]).length > 0
      : typeof answers[question.id] === 'string')

  if (!question) {
    return (
      <>
        <ResultsView dict={dict} locale={locale} />
        <Toaster />
      </>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{dict.wizard.stepOf(clamped + 1, total)}</span>
          <Badge variant="outline">{Math.round((clamped / total) * 100)}%</Badge>
        </div>
        <Progress value={(clamped / total) * 100} />
      </div>

      <QuestionView question={question} dict={dict} />

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setStep(Math.max(0, clamped - 1))}
          disabled={clamped === 0}
        >
          <ArrowLeftIcon /> {dict.wizard.back}
        </Button>
        <Button onClick={() => setStep(clamped + 1)} disabled={!isAnswered}>
          {clamped + 1 === total ? dict.wizard.seeResults : dict.wizard.next}
          <ArrowRightIcon />
        </Button>
      </div>
    </div>
  )
}
