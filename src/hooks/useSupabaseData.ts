import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useAppStore } from "@/stores/appStore"

export function useSupabaseData<T>(
  table: string,
  select: string = "*",
  orderBy?: { column: string; ascending?: boolean },
  enableRealtime = false
) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const { addNotification } = useAppStore()

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log(`Fetching data from table: ${table}, select: ${select}`);
      
      // First check if we can connect to Supabase at all
      const { data: testData, error: testError } = await supabase
        .from('organizations')
        .select('id')
        .limit(1);
        
      if (testError) {
        console.error('Failed to connect to Supabase:', testError);
        setError(`Connection failed: ${testError.message}`);
        setData([]);
        setLoading(false);
        
        // Only show toast for real connection errors, not just missing tables
        if (!testError.message.includes('does not exist')) {
          toast({
            title: "Connection Error",
            description: `Could not connect to Supabase: ${testError.message}`,
            variant: "destructive",
          });
        }
        return;
      }
      
      // If connected, try to fetch the actual requested data
      let query = supabase.from(table).select(select);
      
      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
      }
      
      const { data: result, error } = await query;
      
      if (error) {
        console.error(`Error fetching ${table}:`, error);
        setError(error.message);
        
        // Don't show an error toast if the table just doesn't exist yet
        if (!error.message.includes('does not exist')) {
          toast({
            title: "Data Fetch Error",
            description: `Failed to fetch ${table}: ${error.message}`,
            variant: "destructive",
          });
        }
        
        // Return empty array on error so the UI can still render
        setData([]);
      } else {
        console.log(`Successfully fetched ${result?.length || 0} records from ${table}`);
        setData(result || []);
      }
    } catch (err) {
      console.error(`Unexpected error fetching ${table}:`, err);
      setError(err.message || "An unexpected error occurred");
      
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching data",
        variant: "destructive",
      });
      
      // Return empty array on error so the UI can still render
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [table, select, orderBy?.column, orderBy?.ascending, toast, addNotification]);

  useEffect(() => {
    fetchData();

    // Set up realtime subscription if enabled
    let channel;
    
    if (enableRealtime) {
      console.log(`Setting up realtime subscription for table: ${table}`);
      
      channel = supabase
        .channel(`${table}-changes`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: table
          },
          (payload) => {
            console.log(`Realtime update for ${table}:`, payload);
            fetchData();
            
            addNotification({
              type: 'info',
              title: 'Data Updated',
              message: `${table} data has been updated in real-time`
            });
          }
        )
        .subscribe((status) => {
          console.log(`Supabase realtime subscription status for ${table}:`, status);
        });
    }

    return () => {
      if (channel) {
        console.log(`Removing realtime subscription for table: ${table}`);
        supabase.removeChannel(channel);
      }
    };
  }, [fetchData, enableRealtime, table, addNotification]);

  // Return a safe version of the data to prevent null reference errors
  return { 
    data: data || [], 
    loading, 
    error, 
    refetch: fetchData 
  };
}