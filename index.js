'use strict';

var path = require("path");

module.exports = function(ret, conf, settings, opt){
  if (!settings.placeholder) {
    fis.log.error('fis3-postpackager-query: 缺少query占位参数');
    return;
  }
  
  var placeholder = settings.placeholder.split("=");
  var key = placeholder[0].substring(1); // 占位符的key
  var reg = new RegExp('(\/[^\\?\\*\\|<>:"]+)\\' + settings.placeholder, 'mg'); // 匹配占位符的正则
  var hasGenerate = {}; // 记录已经处理过的文件
  var cb = settings.replace; // 自定义的替换函数

  // 根据匹配到的路径，返回对应文件
  var findFile = function(subpath) {
    var file = ret.pkg[subpath] || ret.src[subpath];

    if (!file) {
      for (var k in ret.src) {
        if (ret.src[k].release === subpath) {
          return ret.src[k];
        }
      }
    }

    return file;
  };

  // 替换占位符
  var replace = function(subpath, file) {
    var content = file.getContent();

    if (content.replace) {
      file.setContent(
        content = content.replace(reg, function (str, res) {
          var resFile = findFile(res);

          if (!resFile) return str;

          if (!hasGenerate[res]) {
            // 如果用户自定义了替换函数，就不使用md5
            if (cb) {
              replace(res, resFile);
              hasGenerate[res] = cb(ret, res, resFile);
            } else {
              hasGenerate[res] = fis.util.md5(replace(res, resFile));
            }
          }

          return res + '?' + key + '=' + hasGenerate[res];
        })
      );
    }

    return content;
  }

  fis.util.map(ret.src, function (subpath, file) {
    replace(subpath, file);
  });
  
  hasGenerate = null;

};
