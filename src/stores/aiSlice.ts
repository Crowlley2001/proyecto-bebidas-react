import type { StateCreator } from "zustand"
import AIService from "../services/AIService"

export type AISlice = {
    recipe : string
    isGenerating: boolean
    genererateRecipe : (prompt : string) => Promise<void>
}

export const createAISlice : StateCreator<AISlice> = (set) => ({
    recipe:'',
    isGenerating: false,
    genererateRecipe: async(prompt) => {
       set({recipe: '', isGenerating: true})
       const data = await AIService.generateRecipe(prompt)
       for await (const textPart of data){
         set ((state => ({
            recipe:state.recipe + textPart
         })))
       }
       set({isGenerating: false})
    }
})