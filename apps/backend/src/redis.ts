// Temporary test file
import { createClient } from 'redis';

async function test() {
  const client = createClient({
    username: 'default',
    password: 'YxSrVvoTm0HNW1Bx7jkt5CI3nFaZeMxJ',
    socket: {
      host: 'redis-10785.c295.ap-southeast-1-1.ec2.redns.redis-cloud.com',
      port: 10785
    }
  });

  client.on('error', (err) => console.log('Redis Client Error', err));
  await client.connect();
  await client.set('test', 'success');
  console.log(await client.get('test'));
  await client.quit();
}

test();
