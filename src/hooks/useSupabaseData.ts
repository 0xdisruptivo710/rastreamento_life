'use client'

import { useState, useEffect, useCallback } from 'react'
import type { RastreamentoLifeOF } from '@/lib/types'

export function useSupabaseData() {
  const [rastreamentoOF, setRastreamentoOF] = useState<RastreamentoLifeOF[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/data', { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setRastreamentoOF(data.rastreamentoOF ?? [])
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

  return { rastreamentoOF, loading, lastUpdate, refetch: fetchData }
}
