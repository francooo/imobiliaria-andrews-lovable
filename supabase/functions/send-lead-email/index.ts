import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadEmailRequest {
  name: string;
  email: string;
  phone: string;
  message?: string;
  source: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, message, source }: LeadEmailRequest = await req.json();

    console.log("Recebido novo lead:", { name, email, phone, source });

    // Email para o corretor (notificação de novo lead)
    const notificationResponse = await resend.emails.send({
      from: "Site Andrews Franco <onboarding@resend.dev>",
      to: ["andrewsfranco93@gmail.com"],
      subject: `🏠 Novo Lead: ${name} - ${source === 'popup_home' ? 'Pop-up Home' : 'Formulário de Contato'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #fff; padding: 40px 20px; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="background: linear-gradient(135deg, #FFC107, #FF8F00); width: 80px; height: 80px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
              <span style="color: #000; font-size: 24px; font-weight: bold;">🏠</span>
            </div>
            <h1 style="color: #FFC107; margin: 0; font-size: 28px;">Novo Lead Recebido!</h1>
            <p style="color: #888; margin-top: 10px;">Origem: ${source === 'popup_home' ? 'Pop-up da Home' : 'Formulário de Contato'}</p>
          </div>
          
          <div style="background: #252525; padding: 25px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #FFC107;">
            <h2 style="color: #FFC107; margin-top: 0; font-size: 18px;">📋 Dados do Lead</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #888; width: 100px;">Nome:</td>
                <td style="padding: 10px 0; color: #fff; font-weight: bold;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #888;">Email:</td>
                <td style="padding: 10px 0; color: #fff;"><a href="mailto:${email}" style="color: #FFC107;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #888;">Telefone:</td>
                <td style="padding: 10px 0; color: #fff;"><a href="tel:${phone}" style="color: #FFC107;">${phone}</a></td>
              </tr>
            </table>
          </div>
          
          ${message ? `
            <div style="background: #252525; padding: 25px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #4CAF50;">
              <h3 style="color: #4CAF50; margin-top: 0;">💬 Mensagem do Cliente:</h3>
              <p style="color: #fff; line-height: 1.6; margin-bottom: 0; white-space: pre-wrap;">${message}</p>
            </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://api.whatsapp.com/send/?phone=55${phone.replace(/\D/g, '')}&text=${encodeURIComponent(`Olá ${name}! Vi que você demonstrou interesse em nossos imóveis. Como posso ajudá-lo?`)}" 
               style="background: linear-gradient(135deg, #25D366, #128C7E); color: #fff; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin: 5px;">
              📱 Responder via WhatsApp
            </a>
            <a href="mailto:${email}?subject=Re: Interesse em Imóveis - Corretor Andrews Franco" 
               style="background: linear-gradient(135deg, #FFC107, #FF8F00); color: #000; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin: 5px;">
              ✉️ Responder via Email
            </a>
          </div>
          
          <hr style="border: none; height: 1px; background: #333; margin: 30px 0;">
          
          <p style="text-align: center; color: #666; font-size: 12px;">
            Este email foi enviado automaticamente pelo seu site.<br>
            Data: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
          </p>
        </div>
      `,
    });

    console.log("Email de notificação enviado para o corretor:", notificationResponse);

    // Email de confirmação para o lead
    const confirmationResponse = await resend.emails.send({
      from: "Andrews Franco <onboarding@resend.dev>",
      to: [email],
      subject: "Obrigado pelo seu interesse - Corretor Andrews Franco",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="background: linear-gradient(135deg, #FFC107, #FF8F00); width: 80px; height: 80px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
              <span style="color: #000; font-size: 24px; font-weight: bold;">AF</span>
            </div>
            <h1 style="color: #FFC107; margin: 0;">Corretor Andrews Franco</h1>
          </div>
          
          <h2 style="color: #FFC107;">Olá, ${name}!</h2>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Obrigado pelo seu interesse em nossos serviços imobiliários! 
            Recebemos suas informações e entraremos em contato em breve.
          </p>
          
          ${message ? `
            <div style="background: #111; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FFC107;">
              <h3 style="color: #FFC107; margin-top: 0;">Sua mensagem:</h3>
              <p style="margin-bottom: 0;">${message}</p>
            </div>
          ` : ''}
          
          <div style="background: #111; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="color: #FFC107; margin-top: 0;">Seus dados:</h3>
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Telefone:</strong> ${phone}</p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6;">
            Enquanto isso, você pode entrar em contato diretamente pelo WhatsApp 
            para um atendimento mais rápido:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://api.whatsapp.com/send/?phone=5551981220279&text&type=phone_number&app_absent=0" 
               style="background: linear-gradient(135deg, #FFC107, #FF8F00); color: #000; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              📱 Falar no WhatsApp
            </a>
          </div>
          
          <hr style="border: none; height: 1px; background: #333; margin: 30px 0;">
          
          <p style="text-align: center; color: #666; font-size: 14px;">
            <strong>Andrews Franco - Corretor de Imóveis</strong><br>
            2+ anos de experiência | 60+ imóveis vendidos e alugados<br>
            📞 51981220279 | 📧 andrews@corretorandrews.com.br
          </p>
        </div>
      `,
    });

    console.log("Email de confirmação enviado para o lead:", confirmationResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      notification: notificationResponse,
      confirmation: confirmationResponse 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Erro ao enviar email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
