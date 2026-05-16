import { streamText } from 'ai'
import { openrouter } from "../lib/ai"

export default {
    async generateRecipe(prompt: string){
        const result = streamText({
            model : openrouter('meta-llama/llama-3.1-8b-instruct'),
            system: `Eres un barman experto y mixólogo profesional. 
            Tu tarea es proporcionar recetas detalladas de coctelería en español. 
            Para cada receta, incluye obligatoriamente:
            1. Un nombre atractivo para el cóctel.
            2. Lista de ingredientes con medidas exactas (oz o ml).
            3. Instrucciones de preparación paso a paso.
            4. Un consejo de experto para el servicio o guarnición (garnish).
            No incluyas advertencias legales ni texto irrelevante.`,
            prompt
            
        })
        return result.textStream
    }
}