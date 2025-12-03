(function () {
  /* ===== 配置 ===== */
  const BLOGGER_LAT = 34.142039;   // 博主纬度
  const BLOGGER_LNG = 108.913090;  // 博主经度
  const API_URL     = 'https://api.nsmao.net/api/ipip/query?key=wSJwLaBpG04ZkCYovcAwAnEOfq';

  /* ===== 工具：计算两地直线距离 ===== */
  function getDistance(e1, n1, e2, n2) {
    const R = 6371;
    const { sin, cos, asin, PI, hypot } = Math;
    const getPoint = (e, n) => {
      e *= PI / 180; n *= PI / 180;
      return { x: cos(n) * cos(e), y: cos(n) * sin(e), z: sin(n) };
    };
    const a = getPoint(e1, n1), b = getPoint(e2, n2);
    const c = hypot(a.x - b.x, a.y - b.y, a.z - b.z);
    return Math.round(asin(c / 2) * 2 * R);
  }

  /* ===== 工具：时段问候 ===== */
  function getTimeGreeting() {
    const h = new Date().getHours();
    if (h >= 5 && h < 11) return '🌤️ 早上好，一日之计在于晨';
    if (h >= 11 && h < 13) return '☀️ 中午好，记得午休喔~';
    if (h >= 13 && h < 17) return '🕞 下午好，饮茶先啦！';
    if (h >= 17 && h < 19) return '🚶‍♂️ 即将下班，记得按时吃饭~';
    if (h >= 19 && h < 24) return '🌙 晚上好，夜生活嗨起来！';
    return '🌙 夜深了，早点休息，少熬夜';
  }

  /* ===== 工具：彩蛋文案 ===== */
  function getPosDesc(d) {
    const { country, province, city } = d;
    if (country !== '中国') {
      const map = {
        日本: 'よろしく，一起去看樱花吗',
        美国: 'Let us live in peace!',
        英国: '想同你一起夜乘伦敦眼',
        俄罗斯: '干了这瓶伏特加！',
        法国: "C'est La Vie",
        德国: 'Die Zeit verging im Fluge.',
        澳大利亚: '一起去大堡礁吧！',
        加拿大: '拾起一片枫叶赠予你'
      };
      return map[country] || '带我去你的国家逛逛吧';
    }

    /* 中国省市彩蛋 */
    const descMap = {
      北京市: '北——京——欢迎你~~~',
      天津市: '讲段相声吧',
      河北省: '山势巍巍成壁垒，天下雄关铁马金戈由此向，无限江山',
      山西省: '展开坐具长三尺，已占山河五百余',
      内蒙古自治区: '天苍苍，野茫茫，风吹草低见牛羊',
      辽宁省: '我想吃烤鸡架！',
      吉林省: '状元阁就是东北烧烤之王',
      黑龙江省: '很喜欢哈尔滨大剧院',
      上海市: '众所周知，中国只有两个城市',
      江苏省: { 南京市: '这是我挺想去的城市啦', 苏州市: '上有天堂，下有苏杭', _def: '散装是必须要散装的' },
      浙江省: { 杭州市: '东风渐绿西湖柳，雁已还人未南归', _def: '望海楼明照曙霞,护江堤白蹋晴沙' },
      河南省: {
        郑州市: '豫州之域，天地之中',
        信阳市: '品信阳毛尖，悟人间芳华',
        南阳市: '臣本布衣，躬耕于南阳此南阳非彼南阳！',
        驻马店市: '峰峰有奇石，石石挟仙气嵖岈山的花很美哦！',
        开封市: '刚正不阿包青天',
        洛阳市: '洛阳牡丹甲天下',
        _def: '可否带我品尝河南烩面啦？'
      },
      安徽省: '蚌埠住了，芜湖起飞',
      福建省: '井邑白云间，岩城远带山',
      江西省: '落霞与孤鹜齐飞，秋水共长天一色',
      山东省: '遥望齐州九点烟，一泓海水杯中泻',
      湖北省: { 黄冈市: '红安将军县！辈出将才！', _def: '来碗热干面~' },
      湖南省: '74751，长沙斯塔克',
      广东省: {
        广州市: '看小蛮腰，喝早茶了嘛~',
        深圳市: '今天你逛商场了嘛~',
        阳江市: '阳春合水！博主家乡~ 欢迎来玩~',
        _def: '来两斤福建人~'
      },
      广西壮族自治区: '桂林山水甲天下',
      海南省: '朝观日出逐白浪，夕看云起收霞光',
      四川省: '康康川妹子',
      贵州省: '茅台，学生，再塞200',
      云南省: '玉龙飞舞云缠绕，万仞冰川直耸天',
      西藏自治区: '躺在茫茫草原上，仰望蓝天',
      陕西省: '来份臊子面加馍',
      甘肃省: '羌笛何须怨杨柳，春风不度玉门关',
      青海省: '牛肉干和老酸奶都好好吃',
      宁夏回族自治区: '大漠孤烟直，长河落日圆',
      新疆维吾尔自治区: '驼铃古道丝绸路，胡马犹闻唐汉风',
      台湾省: '我在这头，大陆在那头',
      香港特别行政区: '永定贼有残留地鬼嚎，迎击光非岁玉',
      澳门特别行政区: '性感荷官，在线发牌'
    };

    const pv = descMap[province];
    if (typeof pv === 'object') return pv[city] || pv._def || '带我去你的城市逛逛吧';
    return pv || '带我去你的城市逛逛吧';
  }

  /* ===== 主渲染 ===== */
  function showWelcome() {
    if (!window.ipLocation || !window.ipLocation.data) return;

    const d   = window.ipLocation.data;
    const pos = `${d.country} ${d.province} ${d.city}`.trim();
    const dist= getDistance(BLOGGER_LNG, BLOGGER_LAT, parseFloat(d.lng), parseFloat(d.lat));
    const desc= getPosDesc(d);
    const grt = getTimeGreeting();

    const html = ''
      + `欢迎来自 <b>${pos}</b> 的小友💖<br>`
      + `当前位置距博主约 <b>${dist.toFixed(2)}</b> 公里！<br>`
      + `${grt}<br>`
      + `Tip：<b>${desc}</b>`;

    let box = document.getElementById('welcome-info');
    if (box) box.innerHTML = html;
  }

  /* ===== 接口请求 ===== */
  fetch(API_URL)
    .then(r => r.json())
    .then(json => {
      window.ipLocation = json;
      showWelcome();          // ← 直接调用，不再判断路径
    })
    .catch(err => {
      console.error('[welcome] 获取失败', err);
      window.ipLocation = { data: { country: '地球', province: '', city: '' } };
    });
    
  /* ===== pjax 兼容 ===== */
  document.addEventListener('pjax:complete', () => {
    if (window.location.pathname === '/') showWelcome();
  });
})();

/* ===== 把欢迎卡片插到公告后面 ===== */
(function insertWelcomeCard() {
  const card = document.createElement('div');
  card.className = 'card-widget card-welcome';
  card.innerHTML = `
    <div class="item-headline">
      <i class="anzhiyufont anzhiyu-icon-bolt"></i>
      <span>欢迎信息</span>
    </div>
    <div id="welcome-info" class="welcome-content">
      <!-- 内容由 showWelcome() 填充 -->
    </div>`;

  const aside = document.querySelector('#aside-content');
  const firstCard = aside.querySelector('.card-widget'); // 主题公告
  firstCard ? firstCard.after(card) : aside.appendChild(card);
})();