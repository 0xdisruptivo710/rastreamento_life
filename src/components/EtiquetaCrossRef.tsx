'use client'

import { useMemo, useState } from 'react'
import { GitBranch, Filter } from 'lucide-react'
import type { RastreamentoLifeOF } from '@/lib/types'

interface Props {
  rastreamentoOF: RastreamentoLifeOF[]
}

interface CrossRefRow {
  campanha: string
  total: number
  cotou: number
  naoCotou: number
  trafegoPago: number
  recuperacao: number
  semEtiqueta: number
  taxaCotacao: string
}

export default function EtiquetaCrossRef({ rastreamentoOF }: Props) {
  const [filter, setFilter] = useState('')

  const data = useMemo(() => {
    const map = new Map<string, {
      total: number; cotou: number; naoCotou: number;
      trafegoPago: number; recuperacao: number; semEtiqueta: number
    }>()

    rastreamentoOF.forEach(r => {
      const campanha = r.Campanha?.trim() || 'Sem Campanha'
      const etiqueta = r.Etiqueta?.trim() || ''

      if (!map.has(campanha)) {
        map.set(campanha, { total: 0, cotou: 0, naoCotou: 0, trafegoPago: 0, recuperacao: 0, semEtiqueta: 0 })
      }
      const row = map.get(campanha)!
      row.total++

      if (!etiqueta) {
        row.semEtiqueta++
      } else {
        if (etiqueta.includes('COTOU') && !etiqueta.includes('NÃO COTOU')) row.cotou++
        if (etiqueta.includes('NÃO COTOU')) row.naoCotou++
        if (etiqueta.includes('TRAFEGO PAGO')) row.trafegoPago++
        if (etiqueta.includes('RECUPERAÇÃO')) row.recuperacao++
      }
    })

    return Array.from(map.entries())
      .map(([campanha, vals]): CrossRefRow => ({
        campanha,
        ...vals,
        taxaCotacao: vals.total > 0 ? ((vals.cotou / vals.total) * 100).toFixed(1) : '0',
      }))
      .sort((a, b) => b.total - a.total)
  }, [rastreamentoOF])

  const filtered = filter
    ? data.filter(d => d.campanha.toLowerCase().includes(filter.toLowerCase()))
    : data

  return (
    <div className="rounded-xl bg-card border border-border p-6 animate-fade-in" style={{ animationDelay: '700ms' }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-rose-500/10 p-2 rounded-lg">
            <GitBranch className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Cruzamento Campanha x Etiqueta</h2>
            <p className="text-xs text-muted">Analise de conversao por campanha com etiquetas do CRM</p>
          </div>
        </div>

        <div className="relative">
          <Filter className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Filtrar campanha..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs bg-surface border border-border rounded-lg focus:outline-none focus:border-accent/50 transition-colors w-48"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-muted text-[10px] uppercase tracking-wider border-b border-border">
              <th className="text-left py-2 px-2">Campanha</th>
              <th className="text-center py-2 px-2">Total</th>
              <th className="text-center py-2 px-2">
                <span className="text-emerald-400">Cotou</span>
              </th>
              <th className="text-center py-2 px-2">
                <span className="text-red-400">Nao Cotou</span>
              </th>
              <th className="text-center py-2 px-2">
                <span className="text-blue-400">Trafego Pago</span>
              </th>
              <th className="text-center py-2 px-2">
                <span className="text-amber-400">Recuperacao</span>
              </th>
              <th className="text-center py-2 px-2">Sem Etiqueta</th>
              <th className="text-center py-2 px-2">Taxa Cotacao</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => (
              <tr key={row.campanha} className="border-b border-border/30 hover:bg-surface/30 transition-colors">
                <td className="py-2.5 px-2 max-w-[250px] truncate" title={row.campanha}>
                  {row.campanha}
                </td>
                <td className="text-center py-2.5 px-2 font-bold">{row.total}</td>
                <td className="text-center py-2.5 px-2">
                  <span className={`px-1.5 py-0.5 rounded ${row.cotou > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'text-muted'}`}>
                    {row.cotou}
                  </span>
                </td>
                <td className="text-center py-2.5 px-2">
                  <span className={`px-1.5 py-0.5 rounded ${row.naoCotou > 0 ? 'bg-red-500/10 text-red-400' : 'text-muted'}`}>
                    {row.naoCotou}
                  </span>
                </td>
                <td className="text-center py-2.5 px-2">
                  <span className={`px-1.5 py-0.5 rounded ${row.trafegoPago > 0 ? 'bg-blue-500/10 text-blue-400' : 'text-muted'}`}>
                    {row.trafegoPago}
                  </span>
                </td>
                <td className="text-center py-2.5 px-2">
                  <span className={`px-1.5 py-0.5 rounded ${row.recuperacao > 0 ? 'bg-amber-500/10 text-amber-400' : 'text-muted'}`}>
                    {row.recuperacao}
                  </span>
                </td>
                <td className="text-center py-2.5 px-2 text-muted">{row.semEtiqueta}</td>
                <td className="text-center py-2.5 px-2">
                  <div className="flex items-center justify-center gap-1.5">
                    <div className="w-12 h-1.5 bg-surface rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                        style={{ width: `${parseFloat(row.taxaCotacao)}%` }}
                      />
                    </div>
                    <span className="font-bold tabular-nums">{row.taxaCotacao}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
