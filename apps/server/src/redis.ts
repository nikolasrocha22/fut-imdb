// apps/server/src/redis.ts
import { createClient } from 'redis';
import { EventEmitter } from 'events';

class RedisService {
  private client: ReturnType<typeof createClient> | null = null;
  private subscriber: ReturnType<typeof createClient> | null = null;
  private localBus = new EventEmitter();
  private useLocalFallback = false;

  constructor() {
    this.localBus.setMaxListeners(100);
  }

  async connect() {
    const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
    try {
      this.client = createClient({ url: redisUrl });
      this.subscriber = createClient({ url: redisUrl });

      this.client.on('error', (err) => {
        if (!this.useLocalFallback) {
          console.warn(`[Redis Client Error]: ${err.message}. Ativando fallback em memória.`);
          this.useLocalFallback = true;
        }
      });

      this.subscriber.on('error', (err) => {
        if (!this.useLocalFallback) {
          console.warn(`[Redis Subscriber Error]: ${err.message}. Ativando fallback em memória.`);
          this.useLocalFallback = true;
        }
      });

      // Timeout para conectar rápido e não travar o servidor
      await Promise.race([
        Promise.all([this.client.connect(), this.subscriber.connect()]),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout de conexão com Redis')), 1500))
      ]);
      
      console.log('Conectado com sucesso ao Redis Server.');
    } catch (err: any) {
      console.warn(`[Redis Connection Alert]: ${err.message || err}. Usando fallback local de eventos em memória.`);
      this.useLocalFallback = true;
      this.client = null;
      this.subscriber = null;
    }
  }

  async publish(channel: string, message: string) {
    if (this.useLocalFallback || !this.client) {
      this.localBus.emit(channel, message);
      return;
    }
    try {
      await this.client.publish(channel, message);
    } catch (err) {
      // Se falhar no ar, emite localmente
      this.localBus.emit(channel, message);
    }
  }

  async subscribe(channel: string, callback: (message: string) => void) {
    if (this.useLocalFallback || !this.subscriber) {
      this.localBus.on(channel, callback);
      return;
    }
    try {
      await this.subscriber.subscribe(channel, (message) => {
        callback(message);
      });
    } catch (err) {
      this.localBus.on(channel, callback);
    }
  }

  async unsubscribe(channel: string, callback?: (message: string) => void) {
    if (this.useLocalFallback || !this.subscriber) {
      if (callback) {
        this.localBus.off(channel, callback);
      } else {
        this.localBus.removeAllListeners(channel);
      }
      return;
    }
    try {
      await this.subscriber.unsubscribe(channel);
    } catch (err) {
      if (callback) this.localBus.off(channel, callback);
    }
  }
}

export const redis = new RedisService();
