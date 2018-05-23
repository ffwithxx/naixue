# VK
npm install
bower install
gulp serve

It's time to use Gulp tasks:
- `$ gulp` to build an optimized version of your application in folder dist
- `$ gulp serve` to start BrowserSync server on your source files with live reload
- `$ gulp serve:dist` to start BrowserSync server on your optimized application without live reload


本地调试说明：

1. 注释index.html里边的base url
2. 注释index.route.js里边的html5mode
3. 修改index.constants.js里边的url，记得用代理，要不然有跨域问题
4. 喜茶和通用版，都需要注释掉下边的代码：见图片“本地调试注释代码.png”
	
