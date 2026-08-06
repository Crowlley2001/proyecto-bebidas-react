import {
  ArrowPathIcon,
  BeakerIcon,
  ClockIcon,
  LightBulbIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import { useState, type FormEvent } from 'react'
import { useAppStore } from '../stores/useAppStore'

const EXAMPLES = [
  'Un cóctel tropical con ron, piña y coco',
  'Una bebida sin alcohol con fresa y limón',
  'Un cóctel elegante con gin y frutos rojos',
]

function RecipeResult({ recipe }: { recipe: string }) {
  return (
    <div className="space-y-3 text-slate-700">
      {recipe.split('\n').map((line, index) => {
        const text = line.trim()
        if (!text) return <div className="h-1" key={`space-${index}`} />
        if (text.startsWith('# ')) {
          return (
            <h2 className="text-3xl font-black tracking-tight text-slate-950" key={index}>
              {text.slice(2)}
            </h2>
          )
        }
        if (text.startsWith('## ')) {
          return (
            <h3 className="pt-3 text-lg font-extrabold uppercase tracking-wide text-orange-700" key={index}>
              {text.slice(3)}
            </h3>
          )
        }
        if (/^[-•]/.test(text)) {
          return <p className="pl-4 before:mr-2 before:text-orange-500 before:content-['•']" key={index}>{text.replace(/^[-•]\s*/, '')}</p>
        }
        return <p className="leading-7" key={index}>{text}</p>
      })}
    </div>
  )
}

export default function GenerateAI() {
  const [prompt, setPrompt] = useState('')
  const generateRecipe = useAppStore((state) => state.genererateRecipe)
  const clearGeneratedRecipe = useAppStore((state) => state.clearGeneratedRecipe)
  const recipe = useAppStore((state) => state.recipe)
  const generationError = useAppStore((state) => state.generationError)
  const isGenerating = useAppStore((state) => state.isGenerating)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const cleanPrompt = prompt.trim()
    if (cleanPrompt.length < 5 || isGenerating) return
    await generateRecipe(cleanPrompt)
  }

  const selectExample = (example: string) => {
    setPrompt(example)
    clearGeneratedRecipe()
  }

  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-5 py-8 text-white shadow-2xl sm:px-10 sm:py-12 lg:px-14">
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-amber-300/10 blur-3xl" />

      <div className="relative mx-auto max-w-5xl">
        <div className="mb-8 max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-300/30 bg-orange-400/10 px-4 py-2 text-sm font-bold text-orange-200">
            <SparklesIcon className="h-5 w-5" />
            Mixólogo IA
          </span>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Convierte tus ingredientes en una bebida memorable
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            Describe sabores, ingredientes o una ocasión. Recibirás una receta clara, equilibrada y lista para preparar.
          </p>
        </div>

        <div className="grid gap-7 lg:grid-cols-[1.05fr_.95fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur sm:p-7">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="prompt" className="mb-2 block text-sm font-bold text-slate-200">
                  ¿Qué bebida quieres crear?
                </label>
                <textarea
                  id="prompt"
                  name="prompt"
                  rows={5}
                  maxLength={500}
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  placeholder="Ej. Una bebida refrescante sin alcohol con maracuyá, hierbabuena y un toque cítrico"
                  className="w-full resize-none rounded-2xl border border-white/15 bg-slate-900/80 p-4 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-orange-400 focus:ring-4 focus:ring-orange-400/10"
                />
                <div className="mt-2 flex justify-between text-xs text-slate-400">
                  <span>Incluye ingredientes, estilo u ocasión</span>
                  <span>{prompt.length}/500</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {EXAMPLES.map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => selectExample(example)}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-left text-xs font-semibold text-slate-300 transition hover:border-orange-400/60 hover:text-white"
                  >
                    {example}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={isGenerating || prompt.trim().length < 5}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-4 font-black text-slate-950 shadow-lg shadow-orange-950/30 transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {isGenerating ? (
                  <>
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                    Creando tu receta...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-5 w-5" />
                    Generar receta
                  </>
                )}
              </button>
            </form>

            {generationError && (
              <div className="mt-5 rounded-2xl border border-red-300/30 bg-red-400/10 p-4 text-sm leading-6 text-red-100" role="alert">
                <strong className="block">No pudimos generar la receta</strong>
                {generationError}
              </div>
            )}
          </div>

          <div className="min-h-[28rem] rounded-3xl bg-stone-50 p-6 text-slate-900 shadow-xl sm:p-8">
            {recipe ? (
              <>
                <div className="mb-6 flex items-center justify-between border-b border-stone-200 pb-4">
                  <span className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-orange-700">
                    <BeakerIcon className="h-5 w-5" /> Resultado
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      clearGeneratedRecipe()
                      setPrompt('')
                    }}
                    className="text-sm font-bold text-slate-500 hover:text-slate-900"
                  >
                    Crear otra
                  </button>
                </div>
                <RecipeResult recipe={recipe} />
              </>
            ) : (
              <div className="flex h-full min-h-[24rem] flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                  <LightBulbIcon className="h-9 w-9" />
                </div>
                <h2 className="mt-5 text-2xl font-black">Tu próxima receta aparecerá aquí</h2>
                <p className="mt-3 max-w-sm leading-7 text-slate-500">
                  La IA organizará ingredientes, cantidades, preparación, presentación y consejo de experto.
                </p>
                <div className="mt-7 flex items-center gap-2 rounded-full bg-stone-200/70 px-4 py-2 text-xs font-bold text-slate-600">
                  <ClockIcon className="h-4 w-4" /> Respuesta habitual en pocos segundos
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
