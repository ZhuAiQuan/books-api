const axios = require('axios');
const cheerio = require('cheerio');
const url = 'https://www.babayu.tv';
const cate = {
  42: '玄幻奇幻',
  43: '武侠修真',
  44: '都市异能',
  45: '历史军事',
  46: '网游竞技',
  47: '科幻灭世',
  48: '女生频道',
  49: '惊悚悬疑',
  52: '轻小说',
}
const instance = axios.create();
instance.defaults.timeout = 20 * 1000;
instance.defaults.headers = {
  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  referer: 'https://www.babayu.tv/lists/book_42_1.html',
  'sec-ch-ua': 'Chromium;v=104, Not A;Brand;v=99, Google Chrome;v=104',
  // 'Content-Type': 'text/plain',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
}

// 首页
async function getIndex() {
  const { data } = await instance.get(url, { timeout: 20*1000 });
  if (!data.length) return data
  const $ = cheerio.load(data);
  const recommended = []
  $('.clearfix.mt10>.fleft.boutiquerecom ul.clearfix>li').each((i, v) => {
    const author = $(v).find('p.author').text().split('/')[0].trim();
    const title = $(v).find('a').attr('title');
    const id = regNumber($(v).find('a').attr('href'))
    const avatar =  $(v).find('a>img').attr('src');
    recommended.push({
      author,
      title,
      id,
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
      const id = regNumber($(n).find('a').attr('href'));
      const avatar =  $(n).find('a>img').attr('src');
      Object.assign(obj, { author, title, id, avatar });
      if (i === 1) clickList.month.push(obj)
      else if (i === 2) clickList.all.push(obj)
      else clickList.day.push(obj)
    });
  })
  const categoryRecommend = [];
  $('.clearfix .fleft>div.typerecom .recombooks-item').each((i, v) => {
    const title = $(v).find('h3').text();
    const data = [];
    const id = regNumber($(v).find('.cover>a').attr('href'));
    const name = $(v).find('.cover>a').attr('title');
    const avatar = $(v).find('.cover>a>img').attr('src');
    const author = {
      name: $(v).find('.cover>p.attr>a').text(),
      id: $(v).find('.cover>p.attr>a').attr('href') ? getAuthor($(v).find('.cover>p.attr>a').attr('href')) : null
    }
    const intro = $(v).find('.cover>p.intro').text();
    data.push({id, name, avatar, author, intro});
    $(v).find('ul.recomlist>li').each((_, n) => {
      data.push({
        name: $(n).find('a').eq(0).attr('title'),
        link: regNumber($(n).find('a').eq(0).attr('href')),
        author: {
          name: $(n).find('a').eq(1).text(),
          link: getAuthor($(n).find('a').eq(1).attr('href')),
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
    const id = regNumber($(v).find('a').attr('href'));
    const title = $(v).find('a').attr('title');
    const author = $(v).find('p.attr').eq(0).text().split('：')[1];
    const type = $(v).find('p.attr').eq(1).text().split('：')[1];
    const obj = {
      id, title, author, type
    };
    girlBooksZone.push(obj)
  });
  const update = [];
  $('.clearfix>.fleft.column-l ul.latestupdate>li').each((i, v) => {
    const type = $(v).find('span.col-1>a.type').text();
    const id = regNumber($(v).find('span>a.title').attr('href'));
    const title = $(v).find('span>a.title').attr('title');
    const chapter = {
      book_id: regBooksId($(v).find('span>a.chapter').attr('href')),
      title: $(v).find('span.col-1>a.chapter').text(),
    };
    const author = $(v).find('span.col-2').text();
    const updateTime = $(v).find('span.col-3').text();
    update.push({
      type, id, title, chapter, author, updateTime
    });
  });
  const newBooks = [];
  $('.clearfix>.fright.column-r .ranking-tabcon ul.clearfix>li').each((i, v) => {
    const id = regNumber($(v).find('p.title>a').attr('href'));
    const title = $(v).find('p.title>a').attr('title');
    const author = $(v).find('p.attr').eq(0).text().split('：').at(-1);
    const type = $(v).find('p.attr').eq(1).text().split('：').at(-1);
    const avatar = $(v).find('a.pic>img').attr('src');
    newBooks.push({
      id, title, author, type, avatar,
    })
  });
  // const weekRecommend = [];
  return {
    recommended, clickList, categoryRecommend, girlBooksZone, update, newBooks
  }
}
// 小说详情
async function getDetail(id) {
  const { data } = await instance.get(`${url}/kanshu/book_${id}.html`);
  const $ = cheerio.load(data);
  const title = $('#content .fleft.column-l .booktitle .name h1').text();
  const [type, fontTotal, author] = $('#content .fleft.column-l .booktitle p').text().split('|').map(item => item.split('：').at(-1));
  const avatar = $('#content .fleft.column-l .bookcover-bd .bookcover-l img').attr('src');
  const intro = $('#content .fleft.column-l .bookcover-bd .bookcover-r .book-intro').text().split('\n').at(0);
  const last_chapter = [];
  $('#content .fleft.column-l .bookcover-bd .bookcover-r .book-intro>ul.lastchapter>li').each((_, v) => {
    const book_id = regBooksId($(v).find('a').attr('href'));
    const title = $(v).find('a').text();
    last_chapter.push({
      book_id,
      title
    })
  });
  const authorId = getAuthor($('#content .fright.column-r .aboutauthor>a').attr('href'));
  const other = [];
  $('#content .fright.column-r .authorotherbook>ul>li').each((_, v) => {
    const id = regNumber($(v).find('a').attr('href'));
    const cover = $(v).find('a>img').attr('src');
    const title = $(v).find('a>img').attr('alt');
    other.push({
      id, cover, title
    });
  });
  const first_chapter = regBooksId($('#content .fleft.column-l .bookcover-bd .bookcover-r .bookbtn-box>.bookbtn-bd>a').eq(0).attr('href'));
  return {
    title, type, fontTotal, author, authorId, avatar, intro, last_chapter, other, first_chapter, id
  }
}
// 查询小说目录
async function bookChapter(id) {
  const { data } = await instance.get(`${url}/book_other_${id}.html`);
  const $ = cheerio.load(data);
  const list = [];
  $('ul.chapter-list>li').each((_, v) => {
    const chapter_id = regBooksId($(v).find('span>a').attr('href'));
    const chapter = $(v).find('span>a').text();
    list.push({
      chapter,
      chapter_id
    })
  });
  return list
}
// 作者详情
async function getAuthorDetail(id) {
  const { data } = await instance.get(`${url}/soshu/${id}.html`);
  const $ = cheerio.load(data);
  const result = $('ul.search-list>li');
  const list = [];
  if (result.length && result.find('a.col-l').length && result.find('div.col-r').length) {
    result.each((_, v) => {
      const id = regNumber($(v).find('a.col-l').attr('href'));
      const title = $(v).find('a.col-l').attr('title');
      const cover = $(v).find('a.col-l>img').attr('src');
      const status = $(v).find('div.col-r p.author').eq(0).text().split('：').at(-1);
      const author = $(v).find('div.col-r p.author').eq(1).text().split('：').at(-1);
      const temp = $(v).find('div.col-r p.intro').text().split('：');
      temp.shift();
      const intro = temp.join('：')
      const latest = $(v).find('div.col-r p.latest').text().split('：').at(-1);
      list.push({
        id, title, cover, status, author, intro, latest
      })
    })
  }
  return list
}
// 章节详情
async function getBooksChapter(id) {
  const { data } = await instance.get(`${url}/kanshu/${id}.html`);
  const $ = cheerio.load(data);
  let info = formatText($('#BookText').html());
  const last = $('.readbg .articlebtn>a').eq(3);
  if (last && last.text() !== '下一章') {
    const book_id = regBooksId(last.attr('href'));
    const text = await getBooksChapter(book_id);
    info += text
  }

  return info
}
// 小说分类
async function category(id, page = 1) {
  const { data } = await instance.get(`${url}/lists/book_${id}_${page}.html`);
  const $ = cheerio.load(data);
  const list = [];
  $('div.layout .books-list ul>li').each((_, v) => {
    const title = $(v).find('a.pic').attr('title');
    const cover = $(v).find('a.pic>img').attr('src');
    const id = regNumber($(v).find('a.pic').attr('href'));
    const author = $(v).find('.graybg>p.author').text().split('：').at(-1);
    const time = $(v).find('.graybg>p.time').text();
    const intro = $(v).find('a.introlink>span.intro').text();
    list.push({
      time, title, cover, id, author, intro
    });
  });
  return {
    list
  }
}
// 搜索
async function search(keyword) {
  const { data } = await instance.get(`${url}/soshu.html?ss=${keyword}`);
  const $ = cheerio.load(data);
  const result = $('ul.search-list>li');
  const list = [];
  if (result.length && result.find('a.col-l').length && result.find('div.col-r').length) {
    result.each((_, v) => {
      const id = regNumber($(v).find('a.col-l').attr('href'));
      const title = $(v).find('a.col-l').attr('title');
      const cover = $(v).find('a.col-l>img').attr('src');
      const status = $(v).find('div.col-r p.author').eq(0).text().split('：').at(-1);
      const author = $(v).find('div.col-r p.author').eq(1).text().split('：').at(-1);
      const temp = $(v).find('div.col-r p.intro').text().split('：');
      temp.shift();
      const intro = temp.join('：')
      const latest = $(v).find('div.col-r p.latest').text().split('：').at(-1);
      list.push({
        id, title, cover, status, author, intro, latest
      })
    })
  }
  return list
}
// 正则字符串里的匹配数字
function regNumber(str) {
  return +str.replace(/[^\d]/g, '')
}
function getAuthor(str) {
  return str.split('/').at(-1).split('.').at(0)
}
// 获取章节id
function regBooksId(str) {
  return str.replace(/[^\d_]/g, '') || str.split('/').at(-1).split('.').at(0)
}
function formatText(str) {
  return str.split('</p>').join(' <br> ').split('<p>').join('')
}

module.exports = {
  getIndex,
  getDetail,
  getAuthorDetail,
  getBooksChapter,
  bookChapter,
  search,
  category
}