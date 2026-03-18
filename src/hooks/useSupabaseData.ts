'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type {
  RastreamentoLife,
  RastreamentoLifeOF,
  LifePlansNovosLeads,
} from '@/lib/types'

async function fetchAllRows<T>(
  table: string,
  orderCol = 'id',
): Promise<T[]> {
  if (!supabase) return []

  const PAGE = 1000
  let all: T[] = []
  let from = 0

  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order(orderCol, { ascending: true })
      .range(from, from + PAGE - 1)

    if (error) {
      console.error(`Error fetching ${table}:`, error)
      break
    }
    if (!data || data.length === 0) break
    all = all.concat(data as T[])
    if (data.length < PAGE) break
    from += PAGE
  }

  return all
}

export function useSupabaseData() {
  const [rastreamento, setRastreamento] = useState<RastreamentoLife[]>([])
  const [rastreamentoOF, setRastreamentoOF] = useState<RastreamentoLifeOF[]>([])
  const [novosLeads, setNovosLeads] = useState<LifePlansNovosLeads[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [r, rof, nl] = await Promise.all([
      fetchAllRows<RastreamentoLife>('Rastreamento_life'),
      fetchAllRows<RastreamentoLifeOF>('Rastreamento_life_OF'),
      fetchAllRows<LifePlansNovosLeads>('life_plans_novos_leads'),
    ])
    setRastreamento(r)
    setRastreamentoOF(rof)
    setNovosLeads(nl)
    setLastUpdate(new Date())
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()

    // Real-time subscriptions
    if (!supabase) return

    const channel = supabase
      .channel('dashboard-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Rastreamento_life' },
        () => fetchData(),
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Rastreamento_life_OF' },
        () => fetchData(),
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'life_plans_novos_leads' },
        () => fetchData(),
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchData])

  return { rastreamento, rastreamentoOF, novosLeads, loading, lastUpdate, refetch: fetchData }
}
