'use client'

import { useMemo } from 'react'
import { Lightbulb, ArrowRight, AlertTriangle, Zap, RefreshCw, Rocket } from 'lucide-react'
import type { RastreamentoLife, RastreamentoLifeOF } from '@/lib/types'
import type { InsightItem } from '@/lib/types'

interface Props {
  rastreamento: RastreamentoLife[]
  rastreamentoOF: RastreamentoLifeOF[]
}

export default function InsightsPanel({ rastreamento, rastreamentoOF }: Props) {
  const insights = useMemo(() => {
    const items: InsightItem[] = []

    // 1. Analyze sem etiqueta leads for follow-up
    const semEtiqueta = rastreamentoOF.filter(r => !r.Etiqueta || r.Etiqueta.trim() === '')
    if (semEtiqueta.length > 0) {
      items.push({
        type: 'follow_up',
        title: `${semEtiqueta.length} leads sem etiqueta precisam de follow-up`,
        description: `Existem ${semEtiqueta.length} leads no painel OF sem nenhuma etiqueta. Esses leads podem estar sem atendimento. Recomendacao: entrar em contato e qualificar esses leads para mover no funil.`,
        priority: 'high',
      })
    }

    // 2. Analyze "NAO COTOU" for reactivation
    const naoCotou = rastreamentoOF.filter(r => r.Etiqueta?.includes('NÃO COTOU'))
    if (naoCotou.length > 0) {
      items.push({
        type: 'reactivation',
        title: `${naoCotou.length} leads que nao cotaram podem ser reativados`,
        description: `Esses leads demonstraram interesse mas nao avancaram para cotacao. Sugestao: criar uma campanha de reativacao com oferta especial ou conteudo educativo para reconquistar esses leads.`,
        priority: 'high',
      })
    }

    // 3. Best performing campaign
    const campMap = new Map<string, number>()
    rastreamento.forEach(r => {
      const c = r.Campanha?.trim()
      if (c) campMap.set(c, (campMap.get(c) || 0) + 1)
    })
    const topCampaign = Array.from(campMap.entries()).sort((a, b) => b[1] - a[1])[0]
    if (topCampaign) {
      items.push({
        type: 'improvement',
        title: `Campanha top: "${topCampaign[0].slice(0, 50)}..."`,
        description: `Esta campanha gerou ${topCampaign[1]} leads (${((topCampaign[1] / rastreamento.length) * 100).toFixed(1)}% do total). Considere aumentar o orcamento ou criar variacoes similares para escalar os resultados.`,
        priority: 'medium',
      })
    }

    // 4. Analyze conjunto performance
    const conjMap = new Map<string, number>()
    rastreamento.forEach(r => {
      const c = r.Conjunto?.trim()
      if (c) conjMap.set(c, (conjMap.get(c) || 0) + 1)
    })
    const topConj = Array.from(conjMap.entries()).sort((a, b) => b[1] - a[1])[0]
    if (topConj) {
      items.push({
        type: 'new_campaign',
        title: `Publico "${topConj[0].slice(0, 40)}" e o que mais converte`,
        description: `Com ${topConj[1]} leads, este publico-alvo tem o maior volume. Recomendacao: testar novos criativos para esse publico e criar lookalike audiences baseados neles.`,
        priority: 'medium',
      })
    }

    // 5. Recuperacao leads
    const recuperacao = rastreamentoOF.filter(r => r.Etiqueta?.includes('RECUPERAÇÃO'))
    if (recuperacao.length > 0) {
      items.push({
        type: 'reactivation',
        title: `${recuperacao.length} leads em recuperacao ativos`,
        description: `Existem leads ja marcados para recuperacao. Acompanhe de perto esses contatos e garanta que estao recebendo seguimento adequado. Priorize os que cotaram anteriormente.`,
        priority: 'medium',
      })
    }

    // 6. PME vs PF analysis
    const pme = rastreamentoOF.filter(r => r.Etiqueta?.includes('PME')).length
    const pf = rastreamentoOF.filter(r => r.Etiqueta?.includes('PF')).length
    if (pme > 0 || pf > 0) {
      const maior = pme > pf ? 'PME' : 'PF/Adesao'
      const menor = pme > pf ? 'PF/Adesao' : 'PME'
      items.push({
        type: 'new_campaign',
        title: `Perfil ${maior} domina as cotacoes`,
        description: `${maior} tem ${Math.max(pme, pf)} cotacoes vs ${Math.min(pme, pf)} de ${menor}. Considere criar campanhas especificas para ${menor} para equilibrar o mix, ou dobrar a aposta em ${maior} se o ticket medio for maior.`,
        priority: 'low',
      })
    }

    // 7. Leads sem mensagem
    const semMensagem = rastreamento.filter(r => !r.mensagem || r.mensagem.trim() === '')
    if (semMensagem.length > 10) {
      items.push({
        type: 'improvement',
        title: `${semMensagem.length} leads entraram sem enviar mensagem`,
        description: `Esses leads clicaram no anuncio mas nao escreveram nada. Pode indicar curiosos ou problemas no CTA. Revise o copy dos anuncios e teste CTAs mais diretos.`,
        priority: 'low',
      })
    }

    return items
  }, [rastreamento, rastreamentoOF])

  const iconMap = {
    follow_up: Zap,
    reactivation: RefreshCw,
    new_campaign: Rocket,
    improvement: Lightbulb,
  }

  const colorMap = {
    high: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', badge: 'bg-red-500/20 text-red-300' },
    medium: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-300' },
    low: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', badge: 'bg-blue-500/20 text-blue-300' },
  }

  const typeLabels = {
    follow_up: 'Follow-up',
    reactivation: 'Reativacao',
    new_campaign: 'Nova Campanha',
    improvement: 'Melhoria',
  }

  return (
    <div className="rounded-xl bg-card border border-border p-6 animate-fade-in" style={{ animationDelay: '800ms' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-amber-500/10 p-2 rounded-lg">
          <Lightbulb className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Insights & Recomendacoes</h2>
          <p className="text-xs text-muted">Analise automatica baseada nos dados atuais</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {insights.map((insight, i) => {
          const Icon = iconMap[insight.type]
          const colors = colorMap[insight.priority]
          return (
            <div
              key={i}
              className={`p-4 rounded-lg border ${colors.border} ${colors.bg} transition-all hover:scale-[1.01]`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Icon className={`w-4 h-4 ${colors.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium uppercase tracking-wider ${colors.badge}`}>
                      {typeLabels[insight.type]}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium uppercase tracking-wider ${colors.badge}`}>
                      {insight.priority === 'high' ? 'Alta' : insight.priority === 'medium' ? 'Media' : 'Baixa'}
                    </span>
                  </div>
                  <p className="text-sm font-medium mb-1">{insight.title}</p>
                  <p className="text-xs text-muted leading-relaxed">{insight.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
