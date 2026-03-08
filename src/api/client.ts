import axios, { type AxiosInstance } from 'axios';
import type { ChatApiConfig } from '@/types/config';
import type { ChatMessagesRequest, ChatMessagesResponse } from '@/types/api';

export interface ChatApiClient {
  sendMessage(payload: ChatMessagesRequest): Promise<ChatMessagesResponse>;
}

export function createChatApiClient(config: ChatApiConfig): ChatApiClient {
  const http: AxiosInstance = axios.create({
    baseURL: config.apiBaseUrl,
    timeout: 30_000,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  http.interceptors.request.use((requestConfig) => {
    if (config.token) {
      requestConfig.headers.Authorization = `Bearer ${config.token}`;
    }
    return requestConfig;
  });

  return {
    async sendMessage(payload: ChatMessagesRequest): Promise<ChatMessagesResponse> {
      const response = await http.post<ChatMessagesResponse>('/v1/chat-messages', payload);
      return response.data;
    }
  };
}
