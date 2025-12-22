// 1. 将所有逻辑封装在一个函数中
function initTravelMap() {
  const mapContainer = document.getElementById('map');
  const infoBox = document.getElementById('infoBox');

  // 安全检查：如果当前页面没有 map 容器，则不执行（防止在博客其他页面报错）
  if (!mapContainer) return;

  // 数据配置
  const places = [
    [25.91, 119.46, '福建 · 赤屿村', '2025.01.30', '游神', 'https://oss.borling.daydayupup.com/post/2025/01.31/2-2.png'],
    [25.91, 119.46, '福建 · 三坊七巷', '2025.01.30', '上下杭、三坊七巷', 'https://oss.borling.daydayupup.com/post/2025/01.31/2-9.png'],
    [24.91, 118.59, '泉州 · 古城', '2025.01.31', '半城烟火半城仙', 'https://oss.borling.daydayupup.com/post/2025/01.31/1-6.png'],
    [24.44, 118.06, '厦门 · 集美学村', '2025.02.01', '海风、老别墅', 'https://oss.borling.daydayupup.com/post/2025/02.02/2.jpg'],
    [24.44, 118.06, '厦门 · 鼓浪屿', '2025.02.02', '钢琴、郑成功', 'https://oss.borling.daydayupup.com/post/2025/02.02/6.jpg'],
    [24.44, 118.09, '厦门 · 主城区', '2025.02.03', '普陀寺、双子塔', 'https://oss.borling.daydayupup.com/post/2025/02.02/16.jpg'],
    [23.44, 116.68, '潮州 · 潮安', '2025.02.04', '英歌舞、龙湖古镇', 'https://oss.borling.daydayupup.com/post/2025/02.04/3.jpg'],
    [22.16, 113.58, '澳门 · 氹仔', '2025.02.06', '四兽首、美食、发财树', 'https://oss.borling.daydayupup.com/post/2025/02.04/3.jpg']
  ];

  // 初始化地图
  const map = new AMap.Map('map', { 
    zoom: 5, 
    center: [108, 32],
    viewMode: '2D' 
  });

  places.forEach((p, i) => {
    // 高德地图坐标顺序是 [经度, 纬度]，你的数据是 [纬度, 经度]，所以用 [p[1], p[0]]
    const marker = new AMap.Marker({ 
      position: [p[1], p[0]], 
      map: map 
    });

    marker.extData = { name: p[2], time: p[3], desc: p[4], img: p[5] };

    // 鼠标移入显示卡片
    marker.on('mouseover', function (e) {
      const data = e.target.extData;
      
      document.getElementById('ibName').textContent = data.name;
      document.getElementById('ibTime').textContent = '到达时间：' + data.time;
      document.getElementById('ibDesc').textContent = data.desc;
      document.getElementById('ibImg').src = data.img;

      // 计算位置（相对于地图容器）
      infoBox.style.left = (e.pixel.x + 15) + 'px';
      infoBox.style.top = (e.pixel.y + 15) + 'px';
      infoBox.classList.remove('hidden');
    });

    // 鼠标移出隐藏卡片
    marker.on('mouseout', () => {
      infoBox.classList.add('hidden');
    });
  });
}

// 2. 执行初始化
initTravelMap();

// 3. 【关键】适配 Anheyu 主题的 PJAX
// 当页面无刷新跳转完成后，重新初始化地图
document.addEventListener('pjax:complete', function () {
  if (window.location.pathname.includes('/map/')) {
    initTravelMap();
  }
});