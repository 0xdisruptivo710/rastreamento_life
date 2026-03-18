'use client'

import { useState } from 'react'
import { Megaphone, ChevronDown, ChevronUp } from 'lucide-react'
import type { RastreamentoLife } from '@/lib/types'

interface Props {
  rastreamento: RastreamentoLife[]
}

interface AdGroup {
  ad: string
  campaign: string
  conjunto: string
  leads: number
}

export default function AdRanking({ rastreamento }: Props) {
  const [expanded, setExpanded] = useState(false)

  const adMap = new Map<string, AdGroup>()
  rastreamento.forEach(r => {
    const ad = r['Anúncio']?.trim()
    const campaign = r.Campanha?.trim()
    const conjunto = r.Conjunto?.trim()
    if (!ad || !campaign) return
    const key = `${ad}|${campaign}|${conjunto}`
    const existing = adMap.get(key)
    if (existing) {
      existing.leads++
    } else {
      adMap.set(key, { ad, campaign, conjunto: conjunto || '-', leads: 1 })
    }
  })

  const sorted = Array.from(adMap.values())
    .sort((a, b) => b.leads - a.leads)

  const displayed = expanded ? sorted : sorted.slice(0, 10)
  const maxLeads = sorted[0]?.leads || 1

  const adColors = [
    'from-cyan-500 to-blue-500',
    'from-emerald-500 to-teal-500',
    'from-violet-500 to-purple-500',
    'from-rose-500 to-pink-500',
    'from-amber-500 to-orange-500',
  ]

  return (
    <div className="rounded-xl bg-card border border-border p-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-cyan-500/10 p-2 rounded-lg">
          <Megaphone className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Ranking de Criativos / Anuncios</h2>
          <p className="text-xs text-muted">Anuncio + Campanha + Conjunto</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted text-[10px] uppercase tracking-wider border-b border-border">
              <th className="text-left py-2 px-2 w-8">#</th>
              <th className="text-left py-2 px-2">Anuncio</th>
              <th className="text-left py-2 px-2 hidden md:table-cell">Campanha</th>
              <th className="text-left py-2 px-2 hidden lg:table-cell">Conjunto</th>
              <th className="text-right py-2 px-2">Leads</th>
              <th className="py-2 px-2 w-24 hidden sm:table-cell"></th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((item, i) => (
              <tr
                key={`${item.ad}-${item.campaign}-${item.conjunto}`}
                className="border-b border-border/50 hover:bg-surface/30 transition-colors"
              >
                <td className="py-3 px-2 text-muted font-mono text-xs">{i + 1}</td>
                <td className="py-3 px-2">
                  <span className="font-medium">{item.ad}</span>
                </td>
                <td className="py-3 px-2 hidden md:table-cell">
                  <span className="text-muted text-xs truncate block max-w-[200px]" title={item.campaign}>
                    {item.campaign}
                  </span>
                </td>
                <td className="py-3 px-2 hidden lg:table-cell">
                  <span className="text-muted text-xs truncate block max-w-[180px]" title={item.conjunto}>
                    {item.conjunto}
                  </span>
                </td>
                <td className="py-3 px-2 text-right">
                  <span className="font-bold tabular-nums">{item.leads}</span>
                </td>
                <td className="py-3 px-2 hidden sm:table-cell">
                  <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${adColors[i % adColors.length]} transition-all duration-700`}
                      style={{ width: `${(item.leads / maxLeads) * 100}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sorted.length > 10 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 mx-auto mt-4 text-xs text-accent-light hover:text-accent transition-colors"
        >
          {expanded ? (
            <>Mostrar menos <ChevronUp className="w-3 h-3" /></>
          ) : (
            <>Ver todos ({sorted.length}) <ChevronDown className="w-3 h-3" /></>
          )}
        </button>
      )}
    </div>
  )
}
