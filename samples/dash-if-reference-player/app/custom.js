// 右下角小视频
$(function(){
var videoHeight = ($('#minVideo').offset().top + $('#minVideo').height());
    // offset().top获取div距离窗口顶部的距离
    //console.log(videoHeight);
    $(window).scroll(function() {
         if ($(window).scrollTop() < videoHeight) {
            $('#minVideo').removeClass('out');
            $('#minVideo').addClass('in');
        } else {
            $('#minVideo').addClass('out');
            $('#minVideo').removeClass('in');
            // 这是距离底部的距离
        }

    });
});

$(//-->右键自定义菜单
    window.onload = function() {
        var video = document.getElementById('minVideo');
        var menu = document.getElementById('rightclickmenu');


        /*显示菜单*/
        function showMenu() {
            var evt = window.event || arguments[0];
            /*获取当前鼠标右键按下后的位置，据此定义菜单显示的位置*/
            var rightedge = video.clientWidth-evt.clientX;
             // console.log(video.clientWidth); 输出857 
            // console.log( evt.clientX); 鼠标点击的位置x值
            var bottomedge = video.clientHeight-evt.clientY;
            // console.log(video.scrollLeft); 输出0
            // console.log(menu.offsetWidth); 240

             /*鼠标位置到容器右边的空间小于菜单的宽度，定位左坐标（Left）为当前鼠标位置向左一个菜单宽度*/
              if (rightedge < menu.offsetWidth) 
                menu.style.left = video.scrollLeft + evt.clientX -  menu.offsetWidth + "px";
            else
             /*否则，就定位菜单的左坐标为当前鼠标位置*/
            menu.style.left = video.scrollLeft + evt.clientX  + "px";
            /*从鼠标位置到容器下边的空间小于菜单的高度，定位菜单的上坐标（Top）为当前鼠标位置向上1/2菜单高度*/
            if (bottomedge < menu.offsetHeight)
                menu.style.top = video.scrollTop + evt.clientY - menu.offsetHeight/2 + "px";
            else
                /*否则，就定位菜单的上坐标为当前鼠标位置*/
            menu.style.top = video.scrollTop + evt.clientY + "px";

            /*设置菜单可见*/
            menu.style.visibility = "visible";
            LTEvent.addListener(menu,"contextmenu",LTEvent.cancelBubble);
        }
        /*隐藏菜单*/
         function hideMenu() {
                 menu.style.visibility = 'hidden';
           }    
            LTEvent.addListener(video,"contextmenu",LTEvent.cancelBubble);
            LTEvent.addListener(video,"contextmenu",showMenu);
           LTEvent.addListener(video,"click",hideMenu);                    
});

// // 摄像头
 $(function () {
    const video = document.getElementById('cam');
    Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('app/models/'),
        faceapi.nets.faceLandmark68Net.loadFromUri('app/models/'),
        faceapi.nets.faceRecognitionNet.loadFromUri('app/models/'),
        faceapi.nets.faceExpressionNet.loadFromUri('app/models/')
        ]).then(startRecognize)
     function startRecognize(){
        const constraints = {
            video: true,
             audio: false
         };
    let promise = navigator.mediaDevices.getUserMedia(constraints);
    promise.then(stream => {
        // 旧的浏览器可能没有srcObject
         if ("srcObject" in video) {
            video.srcObject = stream;
        } else {
            // 防止再新的浏览器里使用它，应为它已经不再支持了
            video.src = window.URL.createObjectURL(stream);
        }
        video.onloadedmetadata = function (e) {
             video.play();
         };

        video.addEventListener('play', () => {
            // console.log("cccccccccccccc");
            const canvas = faceapi.createCanvasFromMedia(video)
            canvas.setAttribute("id", "facemark");
            document.body.append(canvas)

            const displaySize = { width:video.clientWidth, height:video.clientHeight}
  // 这个是css设计的，所以要这样写
         faceapi.matchDimensions(canvas, displaySize)
         setInterval(async () => {
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
           const resizedDetections = faceapi.resizeResults(detections, displaySize)
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
            faceapi.draw.drawDetections(canvas, resizedDetections)
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
        }, 100)
     })
    }).catch(err => {
        console.error(err.name + ": " + err.message);
    }) 
  }
});



//窗口大小值与视频清晰度
$(function(){ setInterval(function(){
  var v = document.getElementById('firstVideo');
        v.addEventListener('canplay', function() {
            //一定要这样才可以取到视频本身的宽高
            var video_width = v.clientWidth;
            var video_height = v.clientHeight;
            var result = video_width+'x'+video_height;
            document.getElementById('viewPort').innerHTML = result;
           
            var res_w = this.videoWidth;
            var res_h = this.videoHeight; 
            var resultion = res_w+'x'+res_h;
            document.getElementById('videoRes').innerHTML = resultion;
             },1000);
              });
});




//评论
$(function(){
//监听内容实时输入没有,事件委托，也可以是on
    $("body").delegate("#commentText","propertychange input",function(){
       if($(this).val.length > 0){
        $(".PostBtn").prop("disabled",false);
        //按钮可用
       }else{
        $(".PostBtn").prop("disabled",true);
        //按钮不可用
       }
    });

//监听发布按钮的点击
$(".PostBtn").click(function(){
        //拿到用户输入内容
        var $text = $("#commentText").val();
        //把内容提交到远程服务器
        let text = {
           ' text':$text
        }
         ajax('POST', "http://192.168.1.104:8004/api/monitor/now/info", 'content='+JSON.stringify(text));
         // ajax('POST', "http://127.0.0.1:3033/", 'content='+$text);
        // 创建节点
        var $comment = createEle($text);
        //插入评论的前面去
        $("#commentList").prepend($comment);
        // $("#commentList").after($comment);
        // 往后面添加
    });

//监听点赞
$("body").delegate(".infoTop","click",function(){
    $(this).text(parseInt($(this).text()) + 1);
    //parseInt是字符串变成整型，放错位置变成了111111
});
//监听踩
$("body").delegate(".infoDown","click",function(){
    $(this).text(parseInt($(this).text()) + 1); 
    //拿到的是一个字符串，要相加变成数字才行
});
//监听删除点击
$("body").delegate(".infoDel","click",function(){
    $(this).parents("#info").remove();
    //parents，找到指定的祖先

});
//创建节点方法
function createEle (text) {
        var $comment = $("<div id=\"info\">\n "+
         "      <p id=\"infoText\">"+ text + "</p>\n" +
         "     <p id=\"infomess\">\n" +
         "         <span id=\"infoTime\">"+formartDate()+"</span>\n" +
         "         <span id=\"infoHandle\">\n" +
         "           <a href=\"javascript:\" class='infoTop'>0</a>\n" +
         "           <a href=\"javascript:\" class='infoDown'>0</a>\n" +
         "          <a href=\"javascript:\" class='infoDel'>删除</a>\n" +
         "     </span>\n" +
         "  </p>\n" +
         " </div>");
          return  $comment;
      }

//生成时间方法
function formartDate() { 
    var date = new Date();
    var arr = [date.getFullYear()+"-",date.getMonth()+1+"-",
                date.getDate()+" ",date.getHours()+":",
                date.getMinutes()+":",date.getSeconds()];
    return arr.join("");
    //数组变成字符串
}
  });

function ajax(method, url, val) {  // 方法，路径，传送数据
    let xhr = new XMLHttpRequest();
    // xhr.onreadystatechange = function() {
    //     if(xhr.readyState == 4) {
    //         if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
    //              reply = xhr.responseText;
    //             // alert(reply+"\n 这里开始是custom.js的ajax加的哦！");
    //         } else {
    //             // alert('Request was unsuccessful: ' + xhr.status);
    //         }
    //     }
    // };

    xhr.open(method, url, true);   
    if(val) {
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
      //设置POST 较常见表单的提交数据方式
    }
    xhr.send(val);
}


//拿到视频信息数据，隔几秒更新数据。为后面传输准备
//监听视频可以播放就传数据
$(function(){
        var video = document.getElementById('firstVideo');
        video.addEventListener('canplay', () => {
    setInterval(function () { 
    let url = $(".vurl").text();
    let vbitrate = $(".vbitrate").text();
    let vbuffer = $(".vbuffer").text(); 
   let vdframes = $(".vdframes").text();
    let videoratio = $(".vratio").text();
    let v = videoratio.split('|'); // ["最小","平均","最大"]
   let vratio = v[1];

    let abitrate = $(".abitrate").text();
   let abuffer = $(".abuffer").text();
  let adframes= $(".adframes").text();
    let audioratio = $(".aratio").text();
    let a = audioratio.split('|'); // ["最小","平均","最大"]
   let aratio = a[1];

//获取页面cookie
var info = document.cookie.split('; ');//居然因为cookie默认带空格，好绝望
    //console.log(info);//["userName=执笔", " userId=33"]
    let obj = {};
    info.forEach((i) => { 
            let arr = i.split("=");
            obj[arr[0]]=arr[1];
    })
     // console.log(obj.userId);
     // console.log(obj.userName);



   let datajsons = { 
    'userId':obj.userId,
    'userName':obj.userName,
    'vUrl':url,
    'vBitrate':vbitrate,
    'vBuffer':vbuffer,
    'vDframes':vdframes,
    'vRatio':vratio,
    'aBitrate':abitrate,
    'aBuffer':abuffer,
    'aDframes':adframes,
    'aRatio':aratio,

    };
    // console.log(datajsons.vUrl);
   // console.log(datajsons);
   // console.log(JSON.stringify(datajsons)); 将 JavaScript 对象转换为字符串。

 ajax('POST', "http://192.168.1.104:8004/api/monitor/now/info", 'flowData=' + JSON.stringify(datajsons));
 // ajax('POST', "http://127.0.0.1:3044/flow", 'flowData=' + JSON.stringify(datajsons));
   },50000);

});
    });


