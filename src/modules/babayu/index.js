const axios = require('axios');
const cheerio = require('cheerio');
const url = 'https://www.babayu.tv'

async function getIndex() {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const recommended = []
  $('.clearfix.mt10>.fleft.boutiquerecom ul.clearfix>li').each((i, v) => {
    const author = $(v).find('p.author').text().split('/')[0].trim();
    const title = $(v).find('a').attr('title');
    const link = url + $(v).find('a').attr('href');
    const avatar =  $(v).find('a>img').attr('src');
    recommended.push({
      author,
      title,
      link,
      avatar
    })
  });
  const clickList = {
    day: [],
    month: [],
    all: []
  };
  $('.clearfix.mt10>.fright.clickranking>.clickranking-tabcon>ul').each((i, v) => {
    
    $(v).find('li').each((_, n) => {
      const obj = {};
      const author = $(n).find('p.attr').text().split('：').at(-1);
      const title = $(n).find('a').attr('title');
      const link = url + $(n).find('a').attr('href');
      const avatar =  $(n).find('a>img').attr('src');
      Object.assign(obj, { author, title, link, avatar });
      if (i === 1) clickList.month.push(obj)
      else if (i === 2) clickList.all.push(obj)
      else clickList.day.push(obj)
    });
  })
  const categoryRecommend = [];
  $('.clearfix .fleft>div.typerecom .recombooks-item').each((i, v) => {
    const title = $(v).find('h3').text();
    const data = [];
    const link = url + $(v).find('.cover>a').attr('href');
    const name = $(v).find('.cover>a').attr('title');
    const avatar = $(v).find('.cover>a>img').attr('src');
    const author = {
      name: $(v).find('.cover>p.attr>a').text(),
      link: url + $(v).find('.cover>p.attr>a').attr('href'),
    }
    const intro = $(v).find('.cover>p.intro').text();
    data.push({link, name, avatar, author, intro});
    $(v).find('ul.recomlist>li').each((_, n) => {
      data.push({
        name: $(n).find('a').eq(0).attr('title'),
        link: url + $(n).find('a').eq(0).attr('href'),
        author: {
          name: $(n).find('a').eq(1).text(),
          link: url + $(n).find('a').attr('href')
        }
      });
    });
    categoryRecommend.push({
      title,
      data
    })
  });
  const girlBooksZone = [];
  $('.clearfix .fright .ranking-tabcon>ul>li').each((i, v) => {
    const link = url + $(v).find('a').attr('href');
    const title = $(v).find('a').attr('title');
    const author = $(v).find('p.attr').eq(0).text().split('：')[1];
    const type = $(v).find('p.attr').eq(1).text().split('：')[1];
    const obj = {
      sort: i + 1,
      link, title, author, type
    };
    girlBooksZone.push(obj)
  });
  const update = [];
  $('.clearfix>.fleft.column-l ul.latestupdate>li').each((i, v) => {
    const type = $(v).find('span.col-1>a.type').text();
    const link = url + $(v).find('span>a.title').attr('href');
    const title = $(v).find('span>a.title').attr('title');
    const chapter = {
      link: url + $(v).find('span>a.chapter').attr('href'),
      title: $(v).find('span.col-1>a.chapter').text(),
    };
    const author = $(v).find('span.col-2').text();
    const updateTime = $(v).find('span.col-3').text();
    update.push({
      type, link, title, chapter, author, updateTime
    });
  });
  const newBooks = [];
  $('.clearfix>.fright.column-r .ranking-tabcon ul.clearfix>li').each((i, v) => {
    const link = url + $(v).find('p.title>a').attr('href');
    const title = $(v).find('p.title>a').attr('title');
    const author = $(v).find('p.attr').eq(0).text().split('：').at(-1);
    const type = $(v).find('p.attr').eq(1).text().split('：').at(-1);
    const avatar = $(v).find('a.pic>img').attr('src');
    newBooks.push({
      link, title, author, type, avatar, sort: i + 1
    })
  });
  // const weekRecommend = [];
  return {
    recommended, clickList, categoryRecommend, girlBooksZone, update, newBooks
  }
}

module.exports = {
  getIndex,
}