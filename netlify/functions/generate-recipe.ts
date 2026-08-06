type OpenRouterResponse = {
  choices?: Array<{ message?: { content?: string } }>
  error?: { message?: string }
}

const SYSTEM_PROMPT = `Eres un mixólogo profesional especializado en crear recetas de bebidas claras, equilibradas y realistas.
Responde siempre en español y utiliza exactamente esta estructura en Markdown:
# Nombre de la bebida
## Perfil
Describe sabor, dificultad, tiempo aproximado y cantidad de porciones.
## Ingredientes
Lista cada ingrediente con una medida exacta en ml, oz, cucharadas o unidades.
## Preparación
Incluye pasos numerados, concretos y en orden.
## Presentación
Indica vaso o copa, hielo y decoración.
## Consejo del mixólogo
Añade un consejo útil y una sustitución posible.

Mantén coherencia entre ingredientes y preparación. No inventes sustancias no aptas para consumo. Si el usuario pide una bebida sin alcohol, no incluyas alcohol. Evita introducciones, despedidas y contenido ajeno a la receta.`

export default async (request: Request) => {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Método no permitido.' }, { status: 405 })
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return Response.json(
      { error: 'El generador todavía no está configurado en el servidor.' },
      { status: 503 },
    )
  }

  try {
    const body = (await request.json()) as { prompt?: unknown }
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : ''

    if (prompt.length < 5 || prompt.length > 500) {
      return Response.json(
        { error: 'Describe la bebida usando entre 5 y 500 caracteres.' },
        { status: 400 },
      )
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.URL || 'https://proyecto-bebidas-react.netlify.app',
        'X-Title': 'Buscador de Bebidas',
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'openrouter/free',
        temperature: 0.65,
        max_tokens: 900,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
      }),
    })

    const data = (await response.json()) as OpenRouterResponse
    const recipe = data.choices?.[0]?.message?.content?.trim()

    if (!response.ok || !recipe) {
      const status = response.status === 429 ? 429 : 502
      const error =
        response.status === 429
          ? 'El servicio está recibiendo muchas solicitudes. Inténtalo en un momento.'
          : data.error?.message || 'El proveedor de IA no pudo generar una respuesta.'
      return Response.json({ error }, { status })
    }

    return Response.json({ recipe })
  } catch {
    return Response.json(
      { error: 'Ocurrió un problema al procesar la solicitud.' },
      { status: 500 },
    )
  }
}
