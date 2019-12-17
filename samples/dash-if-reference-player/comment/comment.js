//用nodejs的http模块，

let http = require('http');
var sd= require('silly-datetime');
let qs = require('querystring');  
var fs=require("fs");//加载文件模块

var time=sd.format(new Date(), 'YYYY-MM-DD HH:mm');
let server = http.createServer(function(req, res) {  

 //该函数用来创建一个HTTP服务器，并将 requestListener 作为 request 事件的监听函数。req请求对象，res响应对象
  let body ="";  // 一定要初始化为"" 不然是undefined
  req.on('data', function(data) {
	  body += data; // 所接受的Json数据
	 console.log(body ); 
	  fs.appendFile("comment.txt", '\n'+' '+time +' '+body,function(err){
	 	console.log(err);
	 })
	 //writeFile是写入文档，每次都会更新，而appendfile会追加数据
	 
});  


//express框架中用req.body接收post客户端的数据；req.query接收get请求    //  console.log(body);
    req.on('end', function() { 
        res.writeHead(200, {  // 响应状态
        "Content-Type": "text/plain",  // 响应数据类型
        'Access-Control-Allow-Origin': '*'  // 允许任何一个域名访问
        });
        if(qs.parse(body).content > 0) {
            res.write('successful!');
        } else{
            res.write('failure！');
            // http://127.0.0.1:3001/显示的永远都是后面这个
        }
        res.end(); 
        //每次成功都会有滴，接在res.write后面哦
    });   
});

server.listen(3001);