'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Tag } from 'lucide-react'
import type { RastreamentoLifeOF } from '@/lib/types'

interface Props {
  rastreamentoOF: RastreamentoLifeOF[]
}

const COLORS = [
  '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4',
  '#84cc16', '#a855f7', '#e11d48',
]

function parseEtiquetas(data: RastreamentoLifeOF[]) {
  const tagMap = new Map<string, number>()

  data.forEach(r => {
    const raw = r.Etiqueta?.trim()
    if (!raw) {
      tagMap.set('Sem Etiqueta', (tagMap.get('Sem Etiqueta') || 0) + 1)
      return
    }
    const tags = raw.split(',').map(t => t.trim()).filter(Boolean)
    tags.forEach(tag => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
    })
  })

  return Array.from(tagMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, count], i) => ({
      name,
      value: count,
      color: COLORS[i % COLORS.length],
    }))
}

interface TooltipPayloadItem {
  name: string
  value: number
  payload: { name: string; value: number; color: string }
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="glass rounded-lg px-3 py-2 text-xs">
      <p className="font-medium">{d.name}</p>
      <p className="text-muted">{d.value} leads</p>
    </div>
  )
}

export default function EtiquetaChart({ rastreamentoOF }: Props) {
  const data = parseEtiquetas(rastreamentoOF)
  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="rounded-xl bg-card border border-border p-6 animate-fade-in" style={{ animationDelay: '400ms' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-emerald-500/10 p-2 rounded-lg">
          <Tag className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Distribuicao de Etiquetas</h2>
          <p className="text-xs text-muted">{total} ocorrencias em {rastreamentoOF.length} leads</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/2 h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-1.5 max-h-[280px] overflow-y-auto pr-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-surface/30 transition-colors">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs flex-1 truncate">{item.name}</span>
              <span className="text-xs font-bold tabular-nums">{item.value}</span>
              <span className="text-[10px] text-muted w-10 text-right">
                {((item.value / total) * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
