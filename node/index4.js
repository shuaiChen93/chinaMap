var fs = require("fs");
const path = require("path");
console.log(__dirname, "__dirname");
var fileDir = __dirname + "/provinces/";
var cityFeatures = [];

function toWrite(data) {
  let dir = path.join(__dirname, "china-cities.json");
  console.log("开始---写入");
  fs.writeFile(
    dir,
    JSON.stringify({
      type: "FeatureCollection",
      features: data,
    }),
    "utf8",
    err => {
      console.log("写入成功", err);
    }
  );
}

fs.readdir(fileDir, { withFileTypes: true }, function (derr, files) {
  console.log("🚀 ~ file: index4.js ~ line 24 ~ files--- files.length", files.length);
  if (derr) {
    return console.error(derr);
  }
  var fileNames = [];

  files.forEach(function (file, index) {
    console.log("🚀 ~ file: index4.js ~ line 19 ~ files.forEach ~ index", index, file.isFile());

    if (file.isFile()) {
      fileNames.push(fileDir + file.name);
      fs.readFile(fileDir + file.name, "utf8", function (err, data) {
        if (err) console.log(err);
        let obj = JSON.parse(data);
        cityFeatures.push(obj.features);
        if (index === files.length - 1) {
          console.log(cityFeatures.length);
          setTimeout(() => {
            if (cityFeatures.length === files.length) {
              console.log("cityFeatures.length===34", cityFeatures.length === 34);
              toWrite(cityFeatures.flat(1));
            } else {
              console.log("读取数据不全,写入会有缺失");
            }
          }, 0);
        }
      });
    } else {
      console.log(file.name + ":isFile() false");
    }
  });
  console.log("cityFeatures---->");
});
