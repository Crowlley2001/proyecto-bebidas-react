type RecipeResponse = {
  recipe?: string
  error?: string
}

const AIService = {
  async generateRecipe(prompt: string) {
    const response = await fetch('/.netlify/functions/generate-recipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    })

    const data = (await response.json().catch(() => ({}))) as RecipeResponse

    if (!response.ok || !data.recipe) {
      throw new Error(data.error || 'No se pudo generar la receta. Inténtalo nuevamente.')
    }

    return data.recipe
  },
}

export default AIService
