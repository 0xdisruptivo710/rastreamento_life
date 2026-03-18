'use client'

import { useState, useEffect, useCallback } from 'react'
import type {
  RastreamentoLife,
  RastreamentoLifeOF,
  LifePlansNovosLeads,
} from '@/lib/types'

export function useSupabaseData() {
  const [rastreamento, setRastreamento] = useState<RastreamentoLife[]>([])
  const [rastreamentoOF, setRastreamentoOF] = useState<RastreamentoLifeOF[]>([])
  const [novosLeads, setNovosLeads] = useState<LifePlansNovosLeads[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/data', { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setRastreamento(data.rastreamento ?? [])
      setRastreamentoOF(data.rastreamentoOF ?? [])
      setNovosLeads(data.novosLeads ?? [])
      setLastUpdate(new Date())
    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()

    // Poll every 60 seconds for near-real-time updates
    const interval = setInterval(fetchData, 60_000)
    return () => clearInterval(interval)
  }, [fetchData])

  return { rastreamento, rastreamentoOF, novosLeads, loading, lastUpdate, refetch: fetchData }
}
