const Router = require('koa-router');
const routes = new Router();
const babayu = require('./babayu');

routes.use('/babayu', babayu.routes(), babayu.allowedMethods());

// routes.redirect('/', '/babayu')
routes.get('/', async ctx => {
  ctx.body = `welcome...`
})

module.exports = routes