export interface RastreamentoLife {
  id: number
  created_at: string
  Nome: string | null
  "Número": string | null
  "E-mail": string | null
  Cidade: string | null
  Campanha: string | null
  Conjunto: string | null
  "Anúncio": string | null
  source_id: string | null
  cta_clid: string | null
  thumbnail: string | null
  cta: string | null
  url: string | null
  mensagem: string | null
}

export interface RastreamentoLifeOF {
  id: number
  created_at: string
  Nome: string | null
  "Número": string | null
  Campanha: string | null
  Conjunto: string | null
  "Anúncio": string | null
  thumbnail: string | null
  cta: string | null
  url: string | null
  mensagem: string | null
  Etiqueta: string | null
}

export interface LifePlansNovosLeads {
  id: number
  created_at: string
  name: string | null
  number: string | null
  qualificacao: string | null
  resumo_conversa: string | null
  etapa: number | null
  timeout: string | null
  chatid: string | null
}

export interface CampaignStats {
  name: string
  leads: number
  percentage: number
}

export interface AdStats {
  name: string
  campaign: string
  conjunto: string
  leads: number
  percentage: number
}

export interface EtiquetaStats {
  name: string
  count: number
  percentage: number
  color: string
}

export interface TimelineData {
  date: string
  leads: number
  leadsOF: number
}

export interface InsightItem {
  type: 'follow_up' | 'reactivation' | 'new_campaign' | 'improvement'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
}
