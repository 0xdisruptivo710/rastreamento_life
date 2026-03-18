'use client'

import { useState } from 'react'
import { Trophy, ChevronDown, ChevronUp, ArrowUpRight } from 'lucide-react'
import type { RastreamentoLife } from '@/lib/types'

interface Props {
  rastreamento: RastreamentoLife[]
}

export default function CampaignRanking({ rastreamento }: Props) {
  const [expanded, setExpanded] = useState(false)

  const campaignMap = new Map<string, number>()
  rastreamento.forEach(r => {
    const name = r.Campanha?.trim()
    if (name) campaignMap.set(name, (campaignMap.get(name) || 0) + 1)
  })

  const sorted = Array.from(campaignMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, leads], i) => ({
      rank: i + 1,
      name,
      leads,
      percentage: ((leads / rastreamento.length) * 100).toFixed(1),
    }))

  const displayed = expanded ? sorted : sorted.slice(0, 8)
  const maxLeads = sorted[0]?.leads || 1

  const medalColors: Record<number, string> = {
    1: 'text-amber-400',
    2: 'text-gray-300',
    3: 'text-amber-600',
  }

  return (
    <div className="rounded-xl bg-card border border-border p-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500/10 p-2 rounded-lg">
            <Trophy className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Ranking de Campanhas</h2>
            <p className="text-xs text-muted">{sorted.length} campanhas encontradas</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {displayed.map(item => (
          <div
            key={item.name}
            className="group relative flex items-center gap-3 p-3 rounded-lg hover:bg-surface/50 transition-colors"
          >
            <div className="w-7 flex-shrink-0 text-center">
              {item.rank <= 3 ? (
                <Trophy className={`w-4 h-4 mx-auto ${medalColors[item.rank]}`} />
              ) : (
                <span className="text-xs text-muted font-mono">#{item.rank}</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium truncate pr-2" title={item.name}>
                  {item.name}
                </p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-sm font-bold tabular-nums">{item.leads}</span>
                  <span className="text-[10px] text-muted">({item.percentage}%)</span>
                </div>
              </div>
              <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
                  style={{ width: `${(item.leads / maxLeads) * 100}%` }}
                />
              </div>
            </div>

            <ArrowUpRight className="w-3.5 h-3.5 text-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </div>
        ))}
      </div>

      {sorted.length > 8 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 mx-auto mt-4 text-xs text-accent-light hover:text-accent transition-colors"
        >
          {expanded ? (
            <>Mostrar menos <ChevronUp className="w-3 h-3" /></>
          ) : (
            <>Ver todas ({sorted.length}) <ChevronDown className="w-3 h-3" /></>
          )}
        </button>
      )}
    </div>
  )
}
