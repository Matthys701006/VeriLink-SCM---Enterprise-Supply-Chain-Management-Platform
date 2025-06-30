
import { useState, useEffect, useRef } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useAppStore } from "@/stores/appStore"

export function useSupabaseRealtime<T>(
  table: string,
  select: string = "*",
  orderBy?: { column: string; ascending?: boolean },
  enableRealtime: boolean = true
) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const { addNotification } = useAppStore()
  const channelRef = useRef<any>(null)

  useEffect(() => {
    async function fetchData() {
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
          addNotification({
            type: 'error',
            title: 'Data Fetch Error',
            message: `Failed to fetch ${table}: ${error.message}`
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
    }

    fetchData()

    // Set up realtime subscription if enabled
    if (enableRealtime) {
      const channel = supabase
        .channel(`${table}-changes`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: table
          },
          (payload) => {
            console.log(`${table} changed:`, payload)
            
            // Add notification for real-time changes
            addNotification({
              type: 'info',
              title: 'Data Updated',
              message: `${table} data has been updated in real-time`
            })
            
            // Refetch data on changes
            fetchData()
          }
        )
        .subscribe()

      channelRef.current = channel
    }

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [table, select, orderBy?.column, orderBy?.ascending, enableRealtime, toast, addNotification])

  const refetch = () => {
    setLoading(true)
    // Trigger useEffect to refetch
  }

  return { data, loading, error, refetch }
}

