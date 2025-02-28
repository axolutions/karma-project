
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY')
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'noreply@seudominio.com'

interface EmailRequestBody {
  to: string
  name: string
  birthDate: string
  matrixImage: string
  interpretations: string
}

serve(async (req) => {
  // Verificar método
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método não permitido' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    // Obter dados do corpo da requisição
    const { to, name, birthDate, matrixImage, interpretations }: EmailRequestBody = await req.json()

    if (!to || !matrixImage) {
      return new Response(JSON.stringify({ error: 'Dados incompletos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (!SENDGRID_API_KEY) {
      throw new Error('API key do SendGrid não configurada')
    }

    // Converter imagem base64 para anexo
    const base64Data = matrixImage.replace(/^data:image\/png;base64,/, '')
    
    // Preparar o email com SendGrid
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SENDGRID_API_KEY}`
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: to }],
            subject: `Sua Matriz Kármica Pessoal - ${birthDate}`
          }
        ],
        from: { email: FROM_EMAIL },
        content: [
          {
            type: 'text/html',
            value: `
              <html>
                <body>
                  <h1>Matriz Kármica Pessoal 2025</h1>
                  <p>Olá, ${name}!</p>
                  <p>Aqui está sua Matriz Kármica baseada na sua data de nascimento: ${birthDate}</p>
                  <p>A imagem da sua matriz está em anexo neste email.</p>
                  <h2>Interpretações da sua Matriz:</h2>
                  <pre>${interpretations.replace(/\n/g, '<br>')}</pre>
                  <p>Obrigado por utilizar nossos serviços!</p>
                </body>
              </html>
            `
          }
        ],
        attachments: [
          {
            content: base64Data,
            filename: 'matriz-karmica.png',
            type: 'image/png',
            disposition: 'attachment'
          }
        ]
      })
    })

    if (response.ok) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } else {
      const errorData = await response.text()
      console.error('Erro no SendGrid:', errorData)
      throw new Error(`Erro ao enviar email: ${response.status} ${errorData}`)
    }
  } catch (error) {
    console.error('Erro:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
