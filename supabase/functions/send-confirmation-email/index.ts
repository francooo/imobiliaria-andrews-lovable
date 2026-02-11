import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ConfirmationEmailRequest {
  email: string;
  name: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name }: ConfirmationEmailRequest = await req.json();

    console.log(`Sending confirmation email to: ${email} for user: ${name}`);

    const emailResponse = await resend.emails.send({
      from: "AF Negócios Imobiliários <onboarding@resend.dev>",
      to: [email],
      subject: "Bem-vindo ao AF Negócios Imobiliários!",
      html: `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bem-vindo ao Andrews Franco Imóveis</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 30px 20px; text-align: center;">
              <h1 style="color: #fbbf24; margin: 0; font-size: 28px; font-weight: bold;">
                AF Negócios Imobiliários
              </h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">
                Seu parceiro ideal em imóveis
              </p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 20px;">
              <h2 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 24px;">
                Bem-vindo, ${name}!
              </h2>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Sua conta foi criada com sucesso em nossa plataforma! Agora você tem acesso ao painel administrativo para gerenciar propriedades, leads e muito mais.
              </p>

              <div style="background-color: #f9fafb; border-left: 4px solid #fbbf24; padding: 20px; margin: 20px 0; border-radius: 4px;">
                <p style="color: #374151; margin: 0; font-size: 14px;">
                  <strong>Email da conta:</strong> ${email}
                </p>
              </div>

              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                Com sua conta, você pode:
              </p>

              <ul style="color: #4b5563; font-size: 16px; line-height: 1.8; margin: 0 0 30px 0; padding-left: 20px;">
                <li>Gerenciar propriedades em destaque</li>
                <li>Visualizar e responder leads</li>
                <li>Atualizar informações do site</li>
                <li>Acompanhar métricas de performance</li>
              </ul>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${Deno.env.get('SUPABASE_URL')?.replace('https://', 'https://').replace('.supabase.co', '') || 'https://seu-site.com'}/admin" 
                   style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #1a1a1a; text-decoration: none; padding: 15px 30px; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
                  Acessar Painel Admin
                </a>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                AF Negócios Imobiliários - Realizando sonhos, construindo futuros
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0 0;">
                Este email foi enviado automaticamente. Por favor, não responda.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-confirmation-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);