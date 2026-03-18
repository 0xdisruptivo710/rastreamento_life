import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

async function fetchAllRows(table: string, orderCol = 'id') {
  if (!supabaseServer) return []

  const PAGE = 1000
  let all: Record<string, unknown>[] = []
  let from = 0

  while (true) {
    const { data, error } = await supabaseServer
      .from(table)
      .select('*')
      .order(orderCol, { ascending: true })
      .range(from, from + PAGE - 1)

    if (error) {
      console.error(`Error fetching ${table}:`, error)
      break
    }
    if (!data || data.length === 0) break
    all = all.concat(data)
    if (data.length < PAGE) break
    from += PAGE
  }

  return all
}

export async function GET() {
  try {
    const [rastreamento, rastreamentoOF, novosLeads] = await Promise.all([
      fetchAllRows('Rastreamento_life'),
      fetchAllRows('Rastreamento_life_OF'),
      fetchAllRows('life_plans_novos_leads'),
    ])

    return NextResponse.json(
      { rastreamento, rastreamentoOF, novosLeads },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    )
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}
