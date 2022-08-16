const Router = require('koa-router');
const babayu = new Router();
const { getIndex, getDetail, bookChapter, getBooksChapter, search } = require('../../modules/babayu')

babayu.get('/', async ctx => {
  const data = await getIndex();
  ctx.body = {
    code: 0,
    data,
    msg: `巴巴鱼阅读`
  }
});
babayu.post('/book', async ctx => {
  const { id } = ctx.request.body;

  if (id) {
    const data = await getDetail(id);
    ctx.body = {
      data,
      code: 0,
      msg: 'success'
    }
  } else {
    ctx.body = {
      code: 500,
      msg: 'request body参数获取不到，请更改传入参数格式为raw'
    }
  }
});
babayu.post('/book/chapter', async ctx => {
  const { id } = ctx.request.body;
  if (id) {
    const data = await bookChapter(id);
    ctx.body = {
      data,
      code: 0,
      msg: 'success'
    }
  } else {
    ctx.body = {
      code: 500,
      msg: 'request body参数获取不到，请更改传入参数格式为raw'
    }
  }
  
});
babayu.post('/book/read', async ctx => {
  const { id } = ctx.request.body;
  if (id) {
    const data = await getBooksChapter(id);
    ctx.body = {
      data,
      code: 0,
      msg: 'success'
    }
  } else {
    ctx.body = {
      code: 500,
      msg: 'request body参数获取不到，请更改传入参数格式为raw'
    }
  }
});
babayu.post('/search', async ctx => {
  if (!ctx.request.body.keyword) {
    ctx.body = {
      code: 500,
      msg: '缺少关键词!'
    }
    return
  } else if (ctx.request.body.keyword.length <= 1) {
    ctx.body = {
      code: 500,
      msg: '关键词最少两个!'
    }
    return
  }
  const data = await search(ctx.request.body.keyword);
  ctx.body = {
    code: 0,
    msg: data.length >= 30 ? '最多显示30条数据，关键词请尽量准确！' : 'success',
    data
  }
})

module.exports = babayu