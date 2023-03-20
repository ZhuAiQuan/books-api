const Router = require('koa-router');
const ms = new Router();
const context = require('./title')

ms.get('/', async ctx => {
  ctx.body = context
})

module.exports = ms