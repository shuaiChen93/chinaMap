var myChart = echarts.init(document.getElementById("container"));

var mapJSON = aliChina;
function draw(mapJSON) {
  echarts.registerMap("china", mapJSON); // 注册地图
  var data = [
    //地图数据
    {
      name: "东北",
      value: 3685,
    },
    {
      name: "华北",
      value: 7342,
    },
    {
      name: "华南",
      value: 21416,
    },
    {
      name: "华东",
      value: 25314,
    },
    {
      name: "华中",
      value: 2500,
    },
    {
      name: "西南",
      value: 10427,
    },
    {
      name: "西北",
      value: 2440,
    },
  ];

  myChart.clear();

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
        var a = '<br> <a href="http://www.baidu.com" style="color: red">查看详情</a>';
        // return params.name + ": " + value[2] + a;
        let result = params.name + ": " + value[2]; // 最后一定要是 个字符串

        return result;
      },
    }, // 配置提示框,提示框默认显示value中的第二段

    geo: {
      // 地理坐标系组件用于地图的绘制
      // map: pName ? pName : "china", // 表示中国地图
      map: "china", // 表示中国地图
      roam: true, // 是否开启鼠标缩放和平移漫游
      zoom: 1.2, // 当前视角的缩放比例（地图的放大比例）
      // label: {
      //     show: true,
      // },
      scaleLimit: {
        min: 0.5,
        max: 4,
      },

      itemStyle: {
        normal: {
          borderWidth: 1, //区域边框宽度
          borderColor: "#059CC0 ", //区域边框颜色
          areaColor: "rgb(219,230,248) ", //区域颜色
        },

        emphasis: {
          borderWidth: 1,
          borderColor: "#4b0082",
          areaColor: "#ece39e",
        },
      },
    },

    series: [
      {
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
        // showEffectOn: "emphasis", ////'render' 绘制完成后显示特效,'emphasis' 高亮（hover）的时候显示特效。
        // data: seriesData,
      },
    ],
  };

  console.log("option--------", option);
  myChart.setOption(option, true);
}

// aliChinaCity
// aliChina
// areaParams :{
//  area:[]
// }

function mergeProvinces(area, chinaJson, chinaCityJson) {
  // type Polygon  type: "MultiPolygon",
  var features = [];
  var chinaFeatures = chinaJson.features;
  var chinaCityFeatures = chinaCityJson.features;
  area.forEach((areaItem, i) => {
    // childrenNum: 11, level: "province", parent: { adcode: 100000 }, subFeatureIndex: 2, acroutes: [100000]
    /*  areaItem:{ areaName: "成都仓库",
      children: ["四川省", "重庆市"],
      center: [104.065735, 30.659462]} , */

    let fetureItem = {
      type: "Feature",
      properties: { name: areaItem.areaName, center: areaItem.center },
      geometry: {
        type: "MultiPolygon",
        coordinates: [],
      },
    };
    let coordinates = [];

    areaItem.children &&
      areaItem.children.forEach(childrenItem => {
        // childrenItem:四川省 / [];
        let obj = {};
        if (typeof childrenItem === "string") {
          // 去全国找    properties: { adcode: 110000, name: "北京市",
          obj = chinaFeatures.find(item => item.properties.name === childrenItem);
          obj.properties.areaName = areaItem.areaName;
          if (!obj) {
            console.log("🚀 ~ file: chinamapAli.js ~ line 157 ~ areaItem.children.forEach---->没找到 ~ obj", childrenItem);
          } else {
            if (obj.geometry.type === "MultiPolygon") {
              coordinates.push(obj.geometry.coordinates.flat(1));
            } else if (obj.geometry.type === "Polygon") {
              coordinates.push(obj.geometry.coordinates);
            }
          }
        } else if (typeof childrenItem === "object") {
          childrenItem.forEach(cityName => {
            obj = chinaCityFeatures.find(item => item.properties.name === cityName);
            if (!obj) {
              /* *
            * 丰城市/高安市->宜春市
             莱芜市->撤销 归济南
              巢湖市->合肥
               青州市->山东省潍坊市
            */
            } else {
              // console.log(obj);
              if (obj.geometry.type === "MultiPolygon") {
                coordinates.push(obj.geometry.coordinates.flat(1));
              } else if (obj.geometry.type === "Polygon") {
                coordinates.push(obj.geometry.coordinates);
              }
            }
          });
          // console.log(childrenItem, "  // 去全国城市找");
        }
      });
    fetureItem.geometry.coordinates = coordinates;
    features.push(fetureItem);
  });
  // adcode: "100000_JD"
  // properties
  let item = chinaFeatures.find(item => item.properties.adcode === "100000_JD");
  features.push(item); //缺失的一部分
  mapJSON = {
    type: "FeatureCollection",
    features: features,
  };
  draw(mapJSON);
  chinaFeatures.forEach(item => {
    // properties: { name: areaItem.areaName, center: areaItem.center },
    if (!item.properties.areaName) {
      console.log("areaName 不存在----->", item);
    }
  });
  // console.log("🚀 ~ file: chinamapAli.js ~ line 130 ~ mergeProvinces ~ area, chinaJson, chinaCityJson", area, chinaJson, chinaCityJson, features);
}
mergeProvinces(areaParams.area, aliChina, aliChinaCity);
