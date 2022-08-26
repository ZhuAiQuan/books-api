const { parentPort } = require('worker_threads');
const axios = require('axios');
const instance = axios.create();
instance.defaults.timeout = 20 * 1000;
instance.defaults.headers = {
  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
}

parentPort?.on('message', async (res) => {
  const { data } = await instance.get(res);
  parentPort?.postMessage(data);
})

async function getLink(url) {
  const { data } = await instance.get(url);
  return data
}