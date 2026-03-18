'use client'

import { RefreshCw, Radio } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useSupabaseData } from '@/hooks/useSupabaseData'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import KPICards from '@/components/KPICards'
import TimelineChart from '@/components/TimelineChart'
import CampaignRanking from '@/components/CampaignRanking'
import AdRanking from '@/components/AdRanking'
import EtiquetaChart from '@/components/EtiquetaChart'
import ConjuntoAnalysis from '@/components/ConjuntoAnalysis'
import EtiquetaCrossRef from '@/components/EtiquetaCrossRef'
import InsightsPanel from '@/components/InsightsPanel'
import RecentLeads from '@/components/RecentLeads'

export default function Dashboard() {
  const { rastreamento, rastreamentoOF, novosLeads, loading, lastUpdate, refetch } = useSupabaseData()

  if (loading && rastreamento.length === 0) {
    return <LoadingSkeleton />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-sm font-bold text-white">LP</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                <span className="gradient-text">Life Plans</span>
                <span className="text-muted font-normal text-sm ml-2">Dashboard Trafego Pago</span>
              </h1>
              <div className="flex items-center gap-2 text-[10px] text-muted">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>Atualizado: {format(lastUpdate, "dd/MM/yyyy 'as' HH:mm:ss", { locale: ptBR })}</span>
              </div>
            </div>
          </div>

          <button
            onClick={refetch}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 border border-accent/20 text-accent-light text-xs font-medium hover:bg-accent/20 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-[1600px] mx-auto px-6 py-6 space-y-6">
        {/* KPI Cards */}
        <KPICards
          rastreamento={rastreamento}
          rastreamentoOF={rastreamentoOF}
          novosLeads={novosLeads}
        />

        {/* Timeline Chart */}
        <TimelineChart
          rastreamento={rastreamento}
          rastreamentoOF={rastreamentoOF}
        />

        {/* Campaign & Etiqueta */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CampaignRanking rastreamento={rastreamento} />
          <EtiquetaChart rastreamentoOF={rastreamentoOF} />
        </div>

        {/* Ad Ranking */}
        <AdRanking rastreamento={rastreamento} />

        {/* Conjunto Analysis + Recent Leads */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ConjuntoAnalysis rastreamento={rastreamento} />
          <RecentLeads rastreamento={rastreamento} />
        </div>

        {/* Etiqueta Cross Reference */}
        <EtiquetaCrossRef rastreamentoOF={rastreamentoOF} />

        {/* Insights */}
        <InsightsPanel
          rastreamento={rastreamento}
          rastreamentoOF={rastreamentoOF}
        />

        {/* Footer */}
        <footer className="text-center py-8 text-xs text-muted border-t border-border">
          <p>Life Plans Dashboard &mdash; Dados em tempo real via Supabase</p>
          <p className="mt-1">
            {rastreamento.length} leads trafego &middot; {rastreamentoOF.length} leads OF &middot; {novosLeads.length} novos leads
          </p>
        </footer>
      </main>
    </div>
  )
}
