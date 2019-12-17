var http = require('http');
var querystring = require('querystring');
var url = require("url");
var util = require('util');
 var mysql  = require('mysql');
 const express = require("express");
// const router = express.Router();
// var app = express();


http.createServer(function(req, res){
	var post = ''; 
	// console.log(req.url);
	req.on('data', function(chunk){    
        post += chunk;
        //console.log(post); //enrollData={"user":"非","password":"非"}
    });

     req.on('end', function(){   
    	res.writeHead(200, {  // 响应状态
		   'Content-Type': 'text/plain;charset=utf-8',  // 响应数据类型plain是纯文本浏览器不会不会处理它，html会调用html的解析器
		   'Access-Control-Allow-Origin': '*'  // 允许任何一个域名访问
			});
    	let backmsg = {
        		id:0,
        		msg:'操作失败，请重新尝试'
        	};
        post = querystring.parse(post);//将URL数据进行解析， //console.log(post);//  loginData: '{"user":"d","password":"d","email":"603505124@qq.com"}' }

        var connection = mysql.createConnection({
          host:'localhost',
          user:'root',
          password:'sophia205',
          port:'3306', 
          database:'pagedate'
          });
         connection.connect();

     if(req.url=='/login'){
        var datas= JSON.parse(post.loginData); 
        //解析成jason格式，方便使用{ user: '非', password: '非' }
        console.log('要查询的登陆数据是');
        console.log(datas);
       // console.log(datas.user);//非

       var  selectSql = 'SELECT * FROM userinfo WHERE user=?&&password=?&&email=?';
       var param = [datas.user,datas.password,datas.email];
       connection.query(selectSql,param,function (err, result) {
        if(err){
         console.log('[SELECT ERROR] - ',err.message);
         return;
        }
        console.log(result.length); 
         if(result.length ==1){
                backmsg.id = result[0].id;
                backmsg.msg = result[0].user;
                console.log(backmsg); 
                res.write(JSON.stringify(backmsg));
            }else {
             res.write(JSON.stringify(backmsg)); 
         }
         res.end();
            })
  }//if的

    else if(req.url=='/enroll'){
        var datas= JSON.parse(post.enrollData); 
        console.log('要的注册信息是');
        console.log(datas);
        var  addSql = 'INSERT INTO userinfo(user,password,email,phone) VALUES(?,?,?,?)';
        var param = [datas.user,datas.password,datas.email,datas.phone];
        connection.query(addSql,param,function (err, result) {
        if(err){
         console.log('[INSERT ERROR] - ',err.message);
         return;
        }  
         // console.log(result.insertId); 
          if(result.insertId>0){
                backmsg.id = result.insertId;
                backmsg.msg = datas.user;
             res.write(JSON.stringify(backmsg));
            }else {
             res.write(JSON.stringify(backmsg)); 
         }
         res.end();

});
    }



      connection.end();

    });

}).listen(3044, () => {
	console.log('启动')
});

