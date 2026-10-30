import Redis from 'ioredis';

export class FlagSubscriber {
  private redis: Redis;

  constructor(redisUrl: string, onUpdate: (data: any) => void) {
    this.redis = new Redis(redisUrl);

    this.redis.subscribe('flag_updates', (err) => {
      if (err) {
        console.error('Erro ao se inscrever no canal Redis Pub/Sub:', err);
      }
    });

    this.redis.on('message', (channel, message) => {
      if (channel === 'flag_updates') {
        try {
          const parsed = JSON.parse(message);
          onUpdate(parsed);
        } catch (e) {
          console.error('Mensagem Pub/Sub malformada recebida:', message);
        }
      }
    });
  }

  disconnect() {
    this.redis.disconnect();
  }
}