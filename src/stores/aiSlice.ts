import type { StateCreator } from 'zustand'
import AIService from '../services/AIService'

export type AISlice = {
  recipe: string
  generationError: string
  isGenerating: boolean
  genererateRecipe: (prompt: string) => Promise<boolean>
  clearGeneratedRecipe: () => void
}

export const createAISlice: StateCreator<AISlice> = (set) => ({
  recipe: '',
  generationError: '',
  isGenerating: false,
  genererateRecipe: async (prompt) => {
    set({ recipe: '', generationError: '', isGenerating: true })

    try {
      const recipe = await AIService.generateRecipe(prompt)
      set({ recipe, isGenerating: false })
      return true
    } catch (error) {
      set({
        generationError:
          error instanceof Error
            ? error.message
            : 'No se pudo generar la receta. Inténtalo nuevamente.',
        isGenerating: false,
      })
      return false
    }
  },
  clearGeneratedRecipe: () => set({ recipe: '', generationError: '' }),
})
