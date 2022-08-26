const axios = require("axios");
const cheerio = require("cheerio");
const url = "https://www.zei8.vip";
// const path = require("path");
// const { Worker } = require("worker_threads");
// const worker = new Worker(path.join(__dirname, "../../worker/request.js"));
// worker.setMaxListeners(Infinity);
// const tag = {
//   // 男频
//   xuanhuan: '东方玄幻',
//   chuantongwuxia: '传统武侠',
//   kongbujing: '恐怖惊悚',
//   xiandaidushi: '现代都市',
//   renwuchuanji: '人物传记',
//   wangyoudongman: '网游动漫',
//   junshilishi: '军事历史',
//   redianziyuan: '热点资源',
//   xifangqihuan: '西方奇幻',
//   xianxiaxiuzhen: '仙侠修真',
//   zhentantuili: '侦探推理',
//   jingdiankehuan: '经典科幻',
//   mingzhuzazhi: '名著杂志',
//   // 女频
//   lishichuanyue: '历史穿越'
// }

const instance = axios.create();
instance.defaults.timeout = 20 * 1000;
instance.defaults.headers = {
  accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
};

async function getIndex() {
  console.log(new Date().getTime());
  const { data } = await instance.get(url);
  const $ = cheerio.load(data);
  
  const recommend = {};
  const lastUpdateMenTxt = [];
  const lastUpdateFemenTxt = [];
  const top = {
    week: [],
    month: [],
    all: [],
  };
  const tag = [];
  $(".center>.pleft>.xsnew").each((i, v) => {
    $(v)
      .find("ul.d2>li")
      .each((_, n) => {
        const date = $(n).find("span.date").text();
        const type = $(n)
          .find("a")
          .eq(0)
          .attr("href")
          ?.substring(1, $(n).find("a").eq(0).attr("href")?.length - 1);
        const title = $(n).find("a").eq(1).text();
        const id = getTxtId($(n).find("a").eq(1).attr("href"));
        if (i) {
          lastUpdateFemenTxt.push({
            date,
            type,
            title,
            id,
          });
        } else {
          lastUpdateMenTxt.push({
            date,
            type,
            title,
            id,
          });
        }
      });
  });
  $(".center>.pright ul.f1").each((i, v) => {
    $(v)
      .find("li")
      .each((_, n) => {
        const title = $(n).find("a").text();
        const id = getTxtId($(n).find("a").attr("href"));
        if (i === 1) {
          top.month.push({ title, id });
        } else if (i === 2) top.all.push({ title, id });
        else top.week.push({ title, id });
      });
  });
  $(".listboxind>dl.tboxind").each((i, v) => {
    const key = $(v).find("dt a").attr("href")?.substring(1);
    recommend[key] = [];
    $(v)
      .find("dd>ul.d1>li")
      .each((_, n) => {
        const date = $(n)
          .find("span")
          .text()
          .substring(1, $(n).find("span").text().length - 1);
        const id = getTxtId($(n).find("a").attr("href"));
        const title = $(n).find("a").text();
        recommend[key].push({
          date,
          id,
          title,
        });
      });
    const id = getTxtId($(v).find("dd>ul.d6>li a").attr("href"));
    const cover = $(v).find("dd>ul.d6>li a>img").attr("src");
    const title = $(v).find("dd>ul.d6>li a>img").attr("alt");
    recommend[key].unshift({
      id,
      title,
      cover,
    });
  });
  $('.toplantxt ul.c6').each((i, v) => {
    tag[i] = {};
    $(v).find('li').each((_, n) => {
      let key = '';
      if (i <= 1) {
        key = $(n).find('a').attr('href')?.substring(1)
      } else {
        key = $(n).find('a').attr('href')?.substring(5, $(n).find('a').attr('href')?.length - 4)
      }
      const val = $(n).find('a').text();
      tag[i][key] = val;
    })
    
  })

  console.log(new Date().getTime());
  return {
    lastUpdateMenTxt,
    lastUpdateFemenTxt,
    top,
    recommend,
    tag
  };
}
// totalnum即总数量 后台没有返回总数 需要自己传入总数
async function search({ keyboard, page = 1, totalnum = 85 }) {
  const { data } = await instance.get(
    `${url}/e/sch/index.php?page=${page - 1}&keyboard=${encodeURI(
      keyboard
    )}&totalnum=${totalnum}`
  );
  const $ = cheerio.load(data);
  const result = [];
  $(".resultlist>div.item").each((i, v) => {
    if ($(v).find("h4>a").attr("href")?.includes("/txt/")) {
      const id = getTxtId($(v).find("h4>a").attr("href"));
      const title = $(v).find("h4>a").text();
      const intro = $(v).find("p.intro").text();
      const date = $(v).find(".info>span").text();
      result.push({ id, title, intro, date });
    }
  });
  return result;
}
async function category({ tag, page = 1 }) {
  const { data } = await instance.get(
    `${url}/${tag}${page === 1 ? "/" : "index_" + page + ".html"}`
  );
  const $ = cheerio.load(data);
  const result = [];
  $(".listbox>ul.e2>li").each((_, v) => {
    const cover = $(v).find("div.img>a>img").attr("src");
    const title = $(v).find("div.img>a>img").attr("alt");
    const id = getTxtId($(v).find("div.img>a").attr("href"));
    const temp = [];
    $(v)
      .find("span.add>small")
      .each((_, n) => {
        temp.push($(n).text().split("：")[1]);
      });
    const [date, author, size, browse] = temp;
    const intro = $(v).find("p.intro").text();
    result.push({
      cover,
      title,
      id,
      date,
      author,
      size,
      browse,
      intro,
    });
  });
  const total = $("ul.pagelist>li span.pageinfo")
    .text()
    .substring(1, $("ul.pagelist>li span.pageinfo").text().length - 1);
  return {
    result,
    total,
  };
}
async function top(type) {
  const { data } = await instance.get(`${url}/txt/${type}100/`);
  const $ = cheerio.load(data);
  const result = [];
  $(".listbox>ul.etop>li").each((_, v) => {
    const cover = $(v).find("div.img>a>img").attr("src");
    const title = $(v).find("div.img>a>img").attr("alt");
    const id = getTxtId($(v).find("div.img>a").attr("href"));
    const temp = [];
    $(v)
      .find("span.add>small")
      .each((_, n) => {
        temp.push($(n).text().split("：")[1]);
      });
    const [date, author, size, browse] = temp;
    const intro = $(v).find("p.intro").text();
    result.push({
      cover,
      title,
      id,
      date,
      author,
      size,
      browse,
      intro,
    });
  });
  return result;
}
async function detail(id) {
  const { data } = await instance.get(`${url}/txt/${id}.html`);
  const $ = cheerio.load(data);
  // const link = [];
  // const downloadLink =
  //   url + $(".viewbox .content>ul.downurllistad>ul.downurllist a").attr("href");
  // worker.postMessage(downloadLink);
  // worker.on("message", (res) => {
  //   const _ = cheerio.load(res);
  //   _(".panel-body .downfile a").each((i, v) => {
  //     link.push($(v).attr("href"));
  //   });
  //   worker.terminate(); // 关闭此线程
  // });
  const title = $(".viewbox div.title h2").text();
  const cover = $(".viewbox>div.picview>img").attr("src");
  const temp = [];
  $(".viewbox>div.infolist span").each((_, v) => {
    temp.push($(v).text());
  });
  const [size, date, allowDownload, status, env, author] = temp;
  const intro = $(".viewbox div.content>p").text();
  const params = $(".viewbox .content>ul.downurllistad>ul.downurllist a").attr("href")?.split('?')[1].split('&').map(item => item.split('=')[1]);
  // @ts-ignore
  const [ classid, _id, pathid ] = params;
  return {
    // link,
    title,
    cover,
    size,
    date,
    status,
    author,
    intro,
    id,
    classid,
    pathid
  };
}
async function getDownload({ classid, id, pathid = 0 }) {
  const { data } = await instance.get(
    `${url}/e/DownSys/DownSoft/?classid=${classid}&id=${id}&pathid=${pathid}`
  );
  const link = [];
  const _ = cheerio.load(data);
  _(".panel-body .downfile a").each((i, v) => {
    link.push(_(v).attr("href"));
  });
  return link
}

function getTxtId(str) {
  return Number(str.replace(".", "/").split("/")[2]);
}

module.exports = {
  getIndex,
  search,
  category,
  top,
  detail,
  getDownload,
};
