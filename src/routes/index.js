const Router = require('koa-router');
const routes = new Router();
const babayu = require('./babayu');
const zei8 = require('./zei8')

routes.use('/babayu', babayu.routes(), babayu.allowedMethods());
routes.use('/zei8', zei8.routes(), zei8.allowedMethods());

// routes.redirect('/', '/babayu')
routes.get('/', async ctx => {
  ctx.body = `welcome...`
})

module.exports = routes