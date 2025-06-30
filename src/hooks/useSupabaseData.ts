
import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export function useSupabaseData<T>(
  table: string,
  select: string = "*",
  orderBy?: { column: string; ascending?: boolean }
) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      let query = supabase.from(table as any).select(select)
      
      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true })
      }
      
      const { data: result, error } = await query
      
      if (error) {
        console.error(`Error fetching ${table}:`, error)
        setError(error.message)
        toast({
          title: "Error",
          description: `Failed to fetch ${table}: ${error.message}`,
          variant: "destructive",
        })
      } else {
        setData((result as T[]) || [])
        setError(null)
      }
    } catch (err) {
      console.error(`Unexpected error fetching ${table}:`, err)
      setError("An unexpected error occurred")
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [table, select, orderBy?.column, orderBy?.ascending, toast])

  useEffect(() => {
    fetchData()

    // Set up realtime subscription
    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table
        },
        () => {
          console.log(`${table} changed, refetching data...`)
          fetchData()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}
