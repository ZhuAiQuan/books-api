const Koa = require('koa');
const cors = require('koa-cors');
const router = require('./routes');
const parser = require('koa-bodyparser');
const { Worker } = require('worker_threads');
const path = require('path');

const worker = new Worker(path.join(__dirname, './worker/test.js'));

worker.setMaxListeners(Infinity);
worker.on('message', res => {
  console.log(`parent main port: ${res}`);
  worker.terminate();// 关闭此线程
});
worker.postMessage('俺是主线程哦')
const app = new Koa();
app.use(cors());
app.use(parser())
app.use(router.routes());

function run(port) {
  app.listen(port)
}

module.exports = run