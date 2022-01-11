var myChart = echarts.init(document.getElementById("container"));
var myChartBg = echarts.init(document.getElementById("containerBg"));
function draw(chart, mapJSON, type = 1) {
  // type:1 底图/背景图;  2是上层图
  echarts.registerMap("china", mapJSON); // 注册地图

  chart.clear();

  var option = {
    grid: {
      left: "2%",
      right: "2%",
      bottom: "5%",
      top: "5%",
      containLabel: true,
    },

    tooltip: {
      enterable: true,
      formatter: function (params) {
        var value = params.value;
        let result = params.name + ": " + value[2]; // 最后一定要是 个字符串
        return result;
      },
    }, // 配置提示框,提示框默认显示value中的第二段

    geo: {
      // 地理坐标系组件用于地图的绘制
      // map: pName ? pName : "china", // 表示中国地图
      map: "china", // 表示中国地图
      roam: false, // 是否开启鼠标缩放和平移漫游
      zoom: 1.2, // 当前视角的缩放比例（地图的放大比例）

      scaleLimit: {
        min: 0.5,
        max: 4,
      },

      itemStyle: {
        normal: {
          borderWidth: type === 1 ? 1 : 0, //区域边框宽度
          borderColor: "#059CC0 ", //区域边框颜色
          areaColor: type === 1 ? "rgb(219,230,248)" : "rgba(219,255,255,0.01)", //区域颜色
        },

        emphasis:
          type === 2
            ? {
                borderWidth: 1,
                borderColor: "#4b0082",
                areaColor: "#ece39e",
              }
            : {},
      },
    },

    series: [
      {
        roam: false, // 是否开启鼠标缩放和平移漫游
        type: "effectScatter", //  指明图表类型：带涟漪效果的散点图
        coordinateSystem: "geo", //  指明绘制在geo坐标系上
        Symbol: "rect",
        itemStyle: {
          // 配置每个数据点的样式
          color: function (params) {
            var color = "";
            var value = params.value;
            color = "#E6A63E";

            return color;
          },
        },

        symbolSize: function (val) {
          return 8;
        },
        zlevel: 2,
        cursor: "pointer",
        // emphasis: { scale: true, focus: "self" },
        hoverAnimation: true,
      },
    ],
  };

  chart.setOption(option, true);
}

window.onload = () => {
  $.getJSON("chinaAli.json", function (aliData) {
    draw(myChartBg, aliData, 1);
    $.getJSON("china.json", function (data) {
      draw(myChart, data, 2);
    });
  });
};
