# fis3-postpackager-query

给文件添加自定义query，默认是md5

## 安装

```
npm install -g fis3-postpackager-query
```

## 使用方法

### 配置

```js

fis.match('*.{js,css,png,gif}', {
    useHash: false // 先关闭默认的md5 戳
});

// 设置占位符
var query = '?v=' + Date.now();

// 应用占位符
fis.match('*', {
    query: query
});

// 基本用法
fis.match('::package', {
  // 默认query为md5
  postpackager : fis.plugin('query', {
    placeholder: query // 这里传入占位符
  })
});

// 自定义用法
fis.match('::package', {
  postpackager : fis.plugin('query', {
    placeholder: query, // 这里传入占位符
    // 不使用replace参数时，默认输出每个文件对应的md5作为query部分
    // ret：打包信息，subpath：处理的资源路径，file：subpath对应的文件对象
    replace: function (ret, subpath, file) {
      return Math.random();
    }
  })
});
```
