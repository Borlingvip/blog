/* ===== 旅行数据（以后只改这里）===== */

const places = [

{
lat:24.43,
lng:118.06,
title:'厦门 · 鼓浪屿',
img:'https://oss.borling.daydayupup.com/post/2025/02.02/6.jpg',
desc:'海风、钢琴、老别墅',
date:'2025-02-02',
url:'https://你的博客.com/xiamen'
},

{
lat:24.91,
lng:118.59,
title:'泉州 · 古城',
img:'https://oss.borling.daydayupup.com/post/2025/01.31/1-6.png',
desc:'半城烟火半城仙',
date:'2025-01-31',
url:'https://你的博客.com/quanzhou'
},

{
lat:26.08,
lng:119.30,
title:'福州',
img:'https://picsum.photos/400/300?random=3',
desc:'温泉与三坊七巷',
date:'2024-10-03',
url:'https://你的博客.com/fuzhou'
}

];


/* ===== 初始化地图 ===== */

const map = new AMap.Map('map',{
  zoom:5,
  center:[108,32],
  viewMode:'3D'
});


/* ===== 卡片 DOM ===== */

const box = document.getElementById('infoBox');
const imgEl = document.getElementById('ibImg');
const titleEl = document.getElementById('ibTitle');
const descEl = document.getElementById('ibDesc');
const dateEl = document.getElementById('ibDate');
const linkEl = document.getElementById('ibLink');

let fixed = false;


/* ===== 显示卡片 ===== */

function showBox(pixel,data){

  imgEl.src='';
  titleEl.textContent=data.title;
  descEl.textContent=data.desc;
  dateEl.textContent='旅行日期：'+data.date;
  linkEl.href=data.url;

  imgEl.src=data.img;

  box.classList.remove('hidden');

  const rect = map.getContainer().getBoundingClientRect();

  const boxWidth = box.offsetWidth;
  const boxHeight = box.offsetHeight;

  let x = rect.left + pixel.getX() + 18;
  let y = rect.top + pixel.getY() - boxHeight/2;

  if(x+boxWidth>window.innerWidth)
    x = rect.left + pixel.getX() - boxWidth - 18;

  if(y<10) y=10;
  if(y+boxHeight>window.innerHeight)
    y=window.innerHeight-boxHeight-10;

  box.style.left=x+'px';
  box.style.top=y+'px';
}

function hideBox(){
  if(!fixed) box.classList.add('hidden');
}


/* ===== 正确加载插件 + marker ===== */

AMap.plugin(
['AMap.Scale','AMap.ToolBar','AMap.Marker'],
function(){

  map.addControl(new AMap.Scale());
  map.addControl(new AMap.ToolBar());

  const markers=[];

  places.forEach(p=>{

    const marker = new AMap.Marker({
      position:[p.lng,p.lat],
      map:map
    });

    markers.push(marker);

    const data={
      img:p.img,
      title:p.title,
      desc:p.desc,
      date:p.date,
      url:p.url
    };

    marker.on('mouseover',e=>{
      if(!fixed) showBox(e.pixel,data);
    });

    marker.on('mouseout',()=>{
      setTimeout(hideBox,120);
    });

    marker.on('click',e=>{
      fixed=true;
      showBox(e.pixel,data);
    });

  });

  map.setFitView(markers);

});


/* ===== 点击地图关闭卡片 ===== */

map.on('click',()=>{
  fixed=false;
  box.classList.add('hidden');
});
