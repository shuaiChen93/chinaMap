const path = require("path");
const fs = require("fs");
var params = require("./areaParams");

function mergeProvinces(area, chinaJson, chinaCityJson) {
  // type Polygon  type: "MultiPolygon",
  var features = [];
  var chinaFeatures = chinaJson.features;
  var chinaCityFeatures = chinaCityJson.features;
  area.forEach((areaItem, i) => {
    // childrenNum: 11, level: "province", parent: { adcode: 100000 }, subFeatureIndex: 2, acroutes: [100000]
    /*  areaItem:{ araeName: "成都仓库",
    children: ["四川省", "重庆市"],
    center: [104.065735, 30.659462]} , */

    let fetureItem = {
      type: "Feature",
      properties: {
        // adcode: 130000,
        name: areaItem.araeName,
        center: areaItem.center,
        araeName: areaItem.araeName,
      },
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
  let item = chinaFeatures.find(item => item.properties.adcode === "100000_JD");
  features.push(item); //缺失的一部分 遗漏的
  // adcode: "100000_JD"
  let mapJSON = {
    type: "FeatureCollection",
    features: features,
  };
  toWrite(mapJSON, "aliChinaProvince");

  // console.log("🚀 ~ file: chinamapAli.js ~ line 130 ~ mergeProvinces ~ area, chinaJson, chinaCityJson", area, chinaJson, chinaCityJson, features);
}
function mergeCitys(area, chinaJson, chinaCityJson) {
  // type Polygon  type: "MultiPolygon",
  var features = [];
  var chinaFeatures = chinaJson.features;
  var chinaCityFeatures = chinaCityJson.features;
  area.forEach((areaItem, i) => {
    // childrenNum: 11, level: "province", parent: { adcode: 100000 }, subFeatureIndex: 2, acroutes: [100000]
    /*  areaItem:{ araeName: "成都仓库",
    children: ["四川省", "重庆市"],
    center: [104.065735, 30.659462]} , */

    let fetureItem = {
      type: "Feature",
      properties: {
        name: areaItem.araeName,
        araeName: areaItem.araeName,
        center: areaItem.center,
      },
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
          obj.properties.araeName = areaItem.araeName;
          if (!obj) {
            console.log("🚀 ~ file: chinamapAli.js ~ line 157 ~ areaItem.children.forEach---->没找到 ~ obj", childrenItem);
          } else {
            // properties: { adcode: 110000, name: "北京市"

            if (obj.geometry.type === "MultiPolygon") {
              coordinates.push(obj.geometry.coordinates.flat(1));
            } else if (obj.geometry.type === "Polygon") {
              coordinates.push(obj.geometry.coordinates);
            }
          }
        } else if (Object.prototype.toString.call(childrenItem) === "[object Object]") {
          /*         {
          province: "浙江省",
          value: [
            "杭州市",
          ] //"浙江",
        }, */
          childrenItem.value.forEach(cityName => {
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

  let mapJSON = {
    type: "FeatureCollection",
    features: features,
  };
  toWrite(mapJSON, "aliChinaCity");
  // toWrite(mapJSON, "aliChinaProvince");
  /*   chinaFeatures.forEach(item => {
  // properties: { name: areaItem.araeName, center: areaItem.center },
  if (!item.properties.araeName) {
    console.log("araeName 不存在----->", item);
  }
}); */
  // console.log("🚀 ~ file: chinamapAli.js ~ line 130 ~ mergeProvinces ~ area, chinaJson, chinaCityJson", area, chinaJson, chinaCityJson, features);
}

// toWrite(mapJSON, "aliChinaProvince");
const aliChina = require("./chinaAli.json");
const aliChinaCity = require("./china-cities.json");

mergeProvinces(params.province, aliChina, aliChinaCity);
mergeCitys(params.city, aliChina, aliChinaCity);
function toWrite(data, name) {
  let dir = path.join(__dirname, name + ".json");
  console.log("开始---写入");
  fs.writeFile(dir, JSON.stringify(data), "utf8", err => {
    console.log("写入成功", err);
  });
}
