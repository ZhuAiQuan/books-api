const Koa = require('koa');
const cors = require('koa-cors');
const router = require('./routes');
const parser = require('koa-bodyparser');

const app = new Koa();
app.use(cors());
app.use(parser())
app.use(router.routes(), router.allowedMethods());

function run(port) {
  app.listen(port, () => console.log(`[server]: running at http://localhost:${port}`))
}

module.exports = run