export interface Chat {
    id: string;
    title: string;
    messages: ChatMessage[];
    createdAt: Date;
  }
  
  export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }
  
  export interface QueryRequest {
    question: string;
    similarity_threshold: number;
    top_k: number;
  }
  
  export interface QueryResponse {
    answer: string;
    sources: string[];
  }
  
  export interface HealthStatus {
    status: 'up' | 'down' | 'unknown';
    lastChecked: Date;
  }