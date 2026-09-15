export default async function handler(req, res) {
    // 1. Libera o CORS (frontend <-> backend)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Se o navegador estiver apenas checando a permissão (CORS), belezinha
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 2. Recebe os dados do script.js
    const { dadosCSV, participante } = req.body;

    try {
        // 3. Pede para o Resend enviar o e-mail
        const respostaResend = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                // A Vercel vai injetar a chave aqui
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Pesquisa Task-Switching <onboarding@resend.dev>', 
                to: ['EMAIL_DE_DESTINO_AQUI@gmail.com'], // <-- COLOCAR O EMAIL DE DESTINO
                subject: `Resultados do Experimento - ${participante}`,
                html: `<p>Olá! Seguem em anexo os resultados de <strong>${participante}</strong>.</p>`,
                attachments: [
                    {
                        filename: `resultados-${participante}.csv`,
                        content: dadosCSV // O Resend anexa o CSV automaticamente!
                    }
                ]
            })
        });

        if (respostaResend.ok) {
            res.status(200).json({ success: true });
        } else {
            const erro = await respostaResend.json();
            res.status(400).json({ error: erro });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}