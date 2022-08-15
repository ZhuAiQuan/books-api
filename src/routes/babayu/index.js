const Router = require('koa-router');
const babayu = new Router();
const { getIndex } = require('../../modules/babayu')

babayu.get('/', async ctx => {
  const data = await getIndex();
  ctx.body = {
    code: 0,
    data,
    msg: `巴巴鱼阅读`
  }
})

module.exports = babayu