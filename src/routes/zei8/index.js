const Router = require('koa-router');
const zei8 = new Router();
const { getIndex, search, category, top, detail, getDownload } = require('../../modules/zei8')

zei8.get('/', async ctx => {
  const data = await getIndex();
  ctx.body = {
    data,
  }
});
zei8.post('/search', async ctx => {
  const params = {
    keyboard: ''
  };
  if (Object.keys(ctx.request.body).length) {
    for(const item in ctx.request.body) {
      params[item] = ctx.request.body[item]
    }
  } else {
    ctx.body = {
      code: 500,
      msg: '缺少必要的参数'
    }
    return
  }
  if (!params.keyboard.length) {
    ctx.body = {
      code: 500,
      msg: '搜索关键字不能为空'
    }
  } else {
    const data = await search(params);
    ctx.body = {
      result: data,
      code: 0,
      msg: data.length ? 'success' : '没有搜索到相关的内容'
    }
  }
  
});
zei8.post('/category', async ctx => {
  const params = {
    tag: 'xuanhuan'
  };
  if (Object.keys(ctx.request.body).length) {
    for(const key in ctx.request.body) {
      params[key] = ctx.request.body[key]
    }
  }
  const data = await category(params);
  ctx.body = {
    code: 0,
    data,
    msg: 'success'
  }
});
zei8.post('/top', async ctx => {
  const type = ctx.request.body.type || 'Nbtop';
  console.log(type)
  const data = await top(type);
  ctx.body = {
    code: 0,
    data,
    msg: 'success'
  }
});
zei8.post('/detail', async ctx => {
  const id = ctx.request.body.id;
  const data = await detail(id);
  ctx.body = {
    data,
    code: 0,
    msg: 'success'
  }
});
zei8.post('/download', async ctx => {
  const params = {};
  if (ctx.request.body && Object.keys(ctx.request.body).length) {
    for(const key in ctx.request.body) {
      params[key] = ctx.request.body[key]
    }
  }
  if (params.classid && params.id) {
    const data = await getDownload(params);
    ctx.body = {
      code: 0,
      data,
      msg: 'success'
    }
  } else {
    ctx.body = {
      code: 500,
      msg: '参数错误'
    }
  }
  
})

module.exports = zei8