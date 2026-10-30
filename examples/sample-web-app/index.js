const { FeatureFlagClient } = require('../../packages/sdk-js/dist/client');

async function run() {
  const client = new FeatureFlagClient({
    apiUrl: 'http://localhost:8081',      // Porta atualizada da API
    redisUrl: 'redis://localhost:6380',   // Porta atualizada do Redis (6380 em vez de 6379)
  });

  await client.init();
  console.log('SDK inicializado e conectado ao Redis Pub/Sub.\n');

  setInterval(() => {
    const userContext = {
      userId: `user_${Math.floor(Math.random() * 1000)}`,
      attributes: {
        region: Math.random() > 0.5 ? 'SA' : 'US',
        plan: 'premium',
      },
    };

    const isV2Enabled = client.evaluate('nova_interface_v2', userContext);

    console.log(
      `[${new Date().toISOString()}] Usuário: ${userContext.userId} | Região: ${userContext.attributes.region} | Feature Active:`,
      isV2Enabled
    );
  }, 2000);
}

run().catch(console.error);