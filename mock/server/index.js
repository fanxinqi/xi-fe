"use strict";
//加载所需要的模块
const http = require('http');

const processRequest = require('./server');

//创建服务，这里很机智的把对response和request的处理封装成一个匿名函数，传入createServer中
//也可以直接在里面写，但是看起来不是很整洁
const httpServer = http.createServer((req, res) => {
    processRequest(req, res);
});

const port = 8989;
console.log("dada");
//指定一个监听的接口
httpServer.listen(port, function() {

    console.log(`app is running at port:${port}`);
});
    