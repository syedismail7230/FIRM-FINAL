import { useState, useEffect } from 'react';
import { subscribeToChannel } from '../lib/supabase';

export function useRealtimeData<T>(
  channelName: string,
  table: string,
  initialData: T[],
  filter?: string
) {
  const [data, setData] = useState<T[]>(initialData);

  useEffect(() => {
    const unsubscribe = subscribeToChannel(
      channelName,
      table,
      (payload) => {
        const { eventType, new: newRecord, old: oldRecord } = payload;

        setData((currentData) => {
          switch (eventType) {
            case 'INSERT':
              return [...currentData, newRecord as T];
            
            case 'UPDATE':
              return currentData.map((item: any) =>
                item.id === (newRecord as any).id ? newRecord : item
              );
            
            case 'DELETE':
              return currentData.filter((item: any) =>
                item.id !== (oldRecord as any).id
              );
            
            default:
              return currentData;
          }
        });
      },
      filter
    );

    return () => unsubscribe();
  }, [channelName, table, filter]);

  return data;
}