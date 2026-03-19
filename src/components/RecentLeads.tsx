'use client'

import { Clock, ExternalLink } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { RastreamentoLifeOF } from '@/lib/types'

interface Props {
  rastreamentoOF: RastreamentoLifeOF[]
}

export default function RecentLeads({ rastreamentoOF }: Props) {
  const recent = [...rastreamentoOF]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 15)

  return (
    <div className="rounded-xl bg-card border border-border p-6 animate-fade-in" style={{ animationDelay: '900ms' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-indigo-500/10 p-2 rounded-lg">
          <Clock className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Leads Recentes</h2>
          <p className="text-xs text-muted">Ultimas entradas no rastreamento</p>
        </div>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {recent.map(lead => (
          <div
            key={lead.id}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface/30 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-white">
                {(lead.Nome || '?').charAt(0).toUpperCase()}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium truncate">{lead.Nome || 'Sem nome'}</p>
                {lead.Etiqueta && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium truncate max-w-[120px]">
                    {lead.Etiqueta}
                  </span>
                )}
                {lead.url && (
                  <a
                    href={lead.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink className="w-3 h-3 text-muted" />
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted">
                <span>{lead['Anúncio'] || '-'}</span>
                <span className="text-border">|</span>
                <span className="truncate max-w-[150px]">{lead.Campanha || '-'}</span>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <p className="text-[10px] text-muted">
                {format(parseISO(lead.created_at), "dd/MM HH:mm", { locale: ptBR })}
              </p>
              <p className="text-[9px] text-accent-light">{lead.cta || '-'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
