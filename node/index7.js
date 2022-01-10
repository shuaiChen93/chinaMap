const path = require("path");
const fs = require("fs");
var cityJson = require("./aliChinaCity2.json");
var provinceJson = require("./aliChinaProvince.json");
let featuresResult = [];
let provinceJsonFeatures = provinceJson.features;
let cityJsonFeatures = cityJson.features;
provinceJsonFeatures.forEach(item => {
  let cityObj = cityJsonFeatures.find(cityItem => item.properties.name === cityItem.properties.name || item.properties.name === cityItem.properties.areaName);
  if (cityObj) {
    /*  "geometry": {
    "type": "MultiPolygon", */
    if (item.geometry.type === cityObj.geometry.type) {
      item.geometry.coordinates = [].concat(item.geometry.coordinates, cityObj.geometry.coordinates);
    } else {
      //  不同
      if (item.geometry.type === "MultiPolygon" && cityObj.geometry.type === "Polygon") {
        item.geometry.coordinates = [].concat(item.geometry.coordinates, [cityObj.geometry.coordinates]);
      } else if (item.geometry.type === "Polygon" && cityObj.geometry.type === "MultiPolygon") {
        item.geometry.coordinates = [].concat(item.geometry.coordinates, [cityObj.geometry.coordinates.flat(1)]);
      }
    }
  }
});
let results = {
  type: "FeatureCollection",
  features: provinceJsonFeatures,
};

function toWrite(data) {
  let dir = path.join(__dirname, "chinaData.json");
  console.log("开始---写入");
  fs.writeFile(dir, JSON.stringify(data), "utf8", err => {
    console.log("写入成功", err);
  });
}
toWrite(results);
