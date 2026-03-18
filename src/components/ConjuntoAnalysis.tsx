'use client'

import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Layers } from 'lucide-react'
import type { RastreamentoLife } from '@/lib/types'

interface Props {
  rastreamento: RastreamentoLife[]
}

interface TooltipPayloadItem {
  value: number
  payload: { name: string; leads: number }
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="glass rounded-lg px-3 py-2 text-xs">
      <p className="font-medium mb-1 max-w-[200px] break-words">{d.name}</p>
      <p className="text-muted"><span className="font-bold text-foreground">{d.leads}</span> leads</p>
    </div>
  )
}

export default function ConjuntoAnalysis({ rastreamento }: Props) {
  const data = useMemo(() => {
    const map = new Map<string, number>()
    rastreamento.forEach(r => {
      const name = r.Conjunto?.trim()
      if (name) map.set(name, (map.get(name) || 0) + 1)
    })
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([name, leads]) => ({
        name: name.length > 30 ? name.slice(0, 27) + '...' : name,
        fullName: name,
        leads,
      }))
  }, [rastreamento])

  return (
    <div className="rounded-xl bg-card border border-border p-6 animate-fade-in" style={{ animationDelay: '600ms' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-violet-500/10 p-2 rounded-lg">
          <Layers className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Conjuntos de Anuncios</h2>
          <p className="text-xs text-muted">Top 12 publicos por volume de leads</p>
        </div>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
            <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              width={160}
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="leads"
              fill="#8b5cf6"
              radius={[0, 6, 6, 0]}
              background={{ fill: '#0f172a', radius: 6 }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
