'use client'

import { Users, TrendingUp, Target, BarChart3, MessageSquare, Tag } from 'lucide-react'
import type { RastreamentoLife, RastreamentoLifeOF, LifePlansNovosLeads } from '@/lib/types'

interface KPICardsProps {
  rastreamento: RastreamentoLife[]
  rastreamentoOF: RastreamentoLifeOF[]
  novosLeads: LifePlansNovosLeads[]
}

export default function KPICards({ rastreamento, rastreamentoOF, novosLeads }: KPICardsProps) {
  const totalLeadsTrafego = rastreamento.length
  const totalLeadsOF = rastreamentoOF.length
  const totalNovosLeads = novosLeads.length

  const uniqueCampaigns = new Set(rastreamento.map(r => r.Campanha).filter(Boolean)).size
  const uniqueAds = new Set(rastreamento.map(r => r['Anúncio']).filter(Boolean)).size

  const etiquetasOF = rastreamentoOF.filter(r => r.Etiqueta && r.Etiqueta.trim() !== '')
  const cotouCount = etiquetasOF.filter(r =>
    r.Etiqueta?.includes('COTOU')
  ).length
  const taxaCotacao = totalLeadsOF > 0 ? ((cotouCount / totalLeadsOF) * 100).toFixed(1) : '0'

  const cards = [
    {
      title: 'Total Leads Trafego',
      value: totalLeadsTrafego.toLocaleString('pt-BR'),
      subtitle: 'Rastreamento Life',
      icon: Users,
      color: 'from-indigo-500 to-purple-600',
      iconBg: 'bg-indigo-500/10',
      iconColor: 'text-indigo-400',
    },
    {
      title: 'Leads com Etiqueta',
      value: totalLeadsOF.toLocaleString('pt-BR'),
      subtitle: `${etiquetasOF.length} etiquetados`,
      icon: Tag,
      color: 'from-emerald-500 to-teal-600',
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400',
    },
    {
      title: 'Novos Leads (Bot)',
      value: totalNovosLeads.toLocaleString('pt-BR'),
      subtitle: 'Life Plans Novos Leads',
      icon: MessageSquare,
      color: 'from-blue-500 to-cyan-600',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
    },
    {
      title: 'Campanhas Ativas',
      value: uniqueCampaigns.toString(),
      subtitle: `${uniqueAds} anuncios`,
      icon: Target,
      color: 'from-amber-500 to-orange-600',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-400',
    },
    {
      title: 'Taxa de Cotacao',
      value: `${taxaCotacao}%`,
      subtitle: `${cotouCount} cotaram de ${totalLeadsOF}`,
      icon: TrendingUp,
      color: 'from-rose-500 to-pink-600',
      iconBg: 'bg-rose-500/10',
      iconColor: 'text-rose-400',
    },
    {
      title: 'Conjuntos de Anuncios',
      value: new Set(rastreamento.map(r => r.Conjunto).filter(Boolean)).size.toString(),
      subtitle: 'Publicos segmentados',
      icon: BarChart3,
      color: 'from-violet-500 to-fuchsia-600',
      iconBg: 'bg-violet-500/10',
      iconColor: 'text-violet-400',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, i) => (
        <div
          key={card.title}
          className="relative overflow-hidden rounded-xl bg-card border border-border p-5 transition-all duration-300 hover:bg-card-hover hover:border-accent/30 hover:-translate-y-0.5 animate-fade-in group"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px]">
            <div className={`h-full w-full bg-gradient-to-r ${card.color}`} />
          </div>

          <div className="flex items-start justify-between mb-3">
            <div className={`${card.iconBg} p-2 rounded-lg`}>
              <card.icon className={`w-4 h-4 ${card.iconColor}`} />
            </div>
          </div>

          <p className="text-2xl font-bold tracking-tight">{card.value}</p>
          <p className="text-xs font-medium text-muted mt-1 uppercase tracking-wider">{card.title}</p>
          <p className="text-[10px] text-muted/70 mt-1">{card.subtitle}</p>
        </div>
      ))}
    </div>
  )
}
