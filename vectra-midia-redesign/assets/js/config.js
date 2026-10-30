/**
 * CONFIGURAÇÃO GERAL - VECTRA MÍDIA
 * Edite aqui as informações principais da agência sem mexer na estrutura do código.
 */

const VECTRA_CONFIG = {
  // Informações da Empresa
  companyName: "Vectra Mídia",
  slogan: "Marketing que traz clientes de verdade para o seu negócio",
  instagram: "@vectramiidia",
  instagramUrl: "https://www.instagram.com/vectramiidia",
  email: "contato@vectramidia.com.br",
  cnpj: "59.454.874/0001-61",
  location: "Atendimento online para todo o Brasil",

  // WhatsApp Centralizado (com 55 + DDD + Número apenas dígitos)
  // Altere o número abaixo para o WhatsApp comercial da agência:
  whatsappNumber: "5511999999999",

  // Mensagens padrão para cada ponto de conversão
  whatsappMessages: {
    default: "Olá! Vim pelo site e quero saber mais sobre os serviços da Vectra Mídia.",
    hero: "Olá! Vim pelo site e quero acelerar o crescimento do meu negócio com a Vectra Mídia.",
    diagnostico: "Olá! Vim pelo site e quero agendar minha reunião de diagnóstico com a Vectra Mídia.",
    header: "Olá! Vim pelo site e gostaria de conversar com um especialista da Vectra Mídia.",
    floating: "Olá! Vim pelo site e gostaria de tirar uma dúvida sobre marketing digital com a Vectra Mídia.",
    footer: "Olá! Quero dar o próximo passo e transformar meu marketing em vendas reais com a Vectra Mídia.",
    services: {
      trafego: "Olá! Vim pelo site e quero saber mais sobre Tráfego Pago (Meta Ads e Google Ads).",
      video: "Olá! Vim pelo site e quero saber mais sobre Produção de Conteúdo e Vídeo.",
      consultoria: "Olá! Vim pelo site e quero saber mais sobre Consultoria de Crescimento Local.",
      crm: "Olá! Vim pelo site e quero saber mais sobre o CRM Personalizado.",
      ia: "Olá! Vim pelo site e quero saber mais sobre o atendimento com respostas automáticas por IA.",
      automacoes: "Olá! Vim pelo site e quero saber mais sobre as Automações para a minha empresa."
    },
    faq: "Olá! Vim pelo site e tenho uma dúvida sobre os serviços da Vectra Mídia."
  },

  // IDs de Rastreamento (Substitua quando tiver as contas criadas)
  analytics: {
    googleAnalyticsId: "", // Ex: "G-XXXXXXXXXX"
    metaPixelId: ""        // Ex: "123456789012345"
  }
};

/**
 * Função utilitária para gerar link direto do WhatsApp
 */
function getWhatsAppUrl(customMessage) {
  const number = VECTRA_CONFIG.whatsappNumber.replace(/\D/g, "");
  const message = customMessage || VECTRA_CONFIG.whatsappMessages.default;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

// Exportar globalmente
window.VECTRA_CONFIG = VECTRA_CONFIG;
window.getWhatsAppUrl = getWhatsAppUrl;
