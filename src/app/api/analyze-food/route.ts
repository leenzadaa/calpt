import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json({ error: "Imagem não fornecida" }, { status: 400 })
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analise esta imagem de comida e forneça as seguintes informações em formato JSON:
              - name: nome do prato/alimento em português de Portugal
              - calories: calorias estimadas (número inteiro)
              - protein: proteína em gramas (número inteiro)
              - carbs: hidratos de carbono em gramas (número inteiro)
              - fat: gordura em gramas (número inteiro)
              - description: breve descrição do que vê na imagem (1-2 frases)
              
              Seja preciso nas estimativas nutricionais. Se houver múltiplos alimentos, some os valores totais.
              Responda APENAS com o JSON, sem texto adicional.`,
            },
            {
              type: "image_url",
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    })

    const content = response.choices[0].message.content
    if (!content) {
      return NextResponse.json({ error: "Resposta vazia da IA" }, { status: 500 })
    }

    // Parse JSON da resposta
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: "Formato de resposta inválido" }, { status: 500 })
    }

    const data = JSON.parse(jsonMatch[0])

    return NextResponse.json({
      name: data.name || "Alimento não identificado",
      calories: parseInt(data.calories) || 0,
      protein: parseInt(data.protein) || 0,
      carbs: parseInt(data.carbs) || 0,
      fat: parseInt(data.fat) || 0,
      description: data.description || "Análise concluída",
    })
  } catch (error) {
    console.error("Erro ao analisar imagem:", error)
    return NextResponse.json(
      { error: "Erro ao processar imagem" },
      { status: 500 }
    )
  }
}
