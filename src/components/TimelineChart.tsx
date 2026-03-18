'use client'

import { useMemo, useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import { TrendingUp } from 'lucide-react'
import { format, parseISO, subDays, startOfDay, startOfWeek, startOfMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { RastreamentoLife, RastreamentoLifeOF } from '@/lib/types'

interface Props {
  rastreamento: RastreamentoLife[]
  rastreamentoOF: RastreamentoLifeOF[]
}

type Period = '7d' | '30d' | '90d' | 'all'
type GroupBy = 'day' | 'week' | 'month'
type ChartType = 'area' | 'bar'

interface TooltipPayloadItem {
  name: string
  value: number
  color: string
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadItem[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-lg px-3 py-2 text-xs">
      <p className="font-medium mb-1">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-muted">{p.name}:</span>
          <span className="font-bold">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function TimelineChart({ rastreamento, rastreamentoOF }: Props) {
  const [period, setPeriod] = useState<Period>('30d')
  const [groupBy, setGroupBy] = useState<GroupBy>('day')
  const [chartType, setChartType] = useState<ChartType>('area')

  const data = useMemo(() => {
    const now = new Date()
    const cutoff = period === 'all' ? null :
      period === '7d' ? subDays(now, 7) :
      period === '30d' ? subDays(now, 30) :
      subDays(now, 90)

    const bucketKey = (dateStr: string) => {
      const d = parseISO(dateStr)
      if (groupBy === 'day') return format(startOfDay(d), 'yyyy-MM-dd')
      if (groupBy === 'week') return format(startOfWeek(d, { locale: ptBR }), 'yyyy-MM-dd')
      return format(startOfMonth(d), 'yyyy-MM')
    }

    const buckets = new Map<string, { leads: number; leadsOF: number }>()

    rastreamento.forEach(r => {
      const d = parseISO(r.created_at)
      if (cutoff && d < cutoff) return
      const key = bucketKey(r.created_at)
      const b = buckets.get(key) || { leads: 0, leadsOF: 0 }
      b.leads++
      buckets.set(key, b)
    })

    rastreamentoOF.forEach(r => {
      const d = parseISO(r.created_at)
      if (cutoff && d < cutoff) return
      const key = bucketKey(r.created_at)
      const b = buckets.get(key) || { leads: 0, leadsOF: 0 }
      b.leadsOF++
      buckets.set(key, b)
    })

    return Array.from(buckets.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, vals]) => ({
        date: groupBy === 'month'
          ? format(parseISO(date + '-01'), 'MMM yy', { locale: ptBR })
          : format(parseISO(date), 'dd/MM', { locale: ptBR }),
        'Leads Trafego': vals.leads,
        'Leads OF': vals.leadsOF,
      }))
  }, [rastreamento, rastreamentoOF, period, groupBy])

  const periods: { value: Period; label: string }[] = [
    { value: '7d', label: '7 dias' },
    { value: '30d', label: '30 dias' },
    { value: '90d', label: '90 dias' },
    { value: 'all', label: 'Tudo' },
  ]

  const groups: { value: GroupBy; label: string }[] = [
    { value: 'day', label: 'Dia' },
    { value: 'week', label: 'Semana' },
    { value: 'month', label: 'Mes' },
  ]

  return (
    <div className="rounded-xl bg-card border border-border p-6 animate-fade-in" style={{ animationDelay: '500ms' }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500/10 p-2 rounded-lg">
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Evolucao de Leads</h2>
            <p className="text-xs text-muted">Timeline de entrada por periodo</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex bg-surface rounded-lg p-0.5">
            {periods.map(p => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`text-[10px] px-2.5 py-1 rounded-md transition-all ${
                  period === p.value
                    ? 'bg-accent text-white'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex bg-surface rounded-lg p-0.5">
            {groups.map(g => (
              <button
                key={g.value}
                onClick={() => setGroupBy(g.value)}
                className={`text-[10px] px-2.5 py-1 rounded-md transition-all ${
                  groupBy === g.value
                    ? 'bg-accent text-white'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
          <div className="flex bg-surface rounded-lg p-0.5">
            <button
              onClick={() => setChartType('area')}
              className={`text-[10px] px-2.5 py-1 rounded-md transition-all ${
                chartType === 'area' ? 'bg-accent text-white' : 'text-muted hover:text-foreground'
              }`}
            >
              Area
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`text-[10px] px-2.5 py-1 rounded-md transition-all ${
                chartType === 'bar' ? 'bg-accent text-white' : 'text-muted hover:text-foreground'
              }`}
            >
              Barras
            </button>
          </div>
        </div>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={data}>
              <defs>
                <linearGradient id="gradientLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradientOF" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="Leads Trafego"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#gradientLeads)"
              />
              <Area
                type="monotone"
                dataKey="Leads OF"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#gradientOF)"
              />
            </AreaChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Leads Trafego" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Leads OF" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-1.5 rounded-full bg-indigo-500" />
          <span className="text-muted">Leads Trafego</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-muted">Leads OF (Etiquetados)</span>
        </div>
      </div>
    </div>
  )
}
