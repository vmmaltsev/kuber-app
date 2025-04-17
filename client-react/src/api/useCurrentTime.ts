import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface ApiResponse {
  api: string;
  currentTime: string;
  requestCount: number;
}

export function useCurrentTime(api: string, refreshInterval: number) {
  return useQuery<ApiResponse>({
    queryKey: [api],
    queryFn: () => axios.get(api).then((res) => res.data),
    refetchInterval: refreshInterval,
  });
} 