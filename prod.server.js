var express=require('express');
var config=require('./config/index');
var axios=require('axios');


var app = express()

//自己设定的后端代理
var apiRouter =  express.Router()

apiRouter.get('/getRecommendList',function(req,res){
  var url='https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg';
  axios.get(url,{
    headers:{
      referer:'https://c.y.qq.com',
      hots:'c.y.qq.com'
    },
    params:req.query
  }).then(response=>{
    res.json(response.data);//输出给浏览器端
  }).catch(e=>{
    console.log(e);
  })

})

apiRouter.get('/lyric',function(req,res){
  var url='https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg';
  axios.get(url,{
    headers:{
      referer:'https://c.y.qq.com',
      hots:'c.y.qq.com'
    },
    params:req.query
  }).then(response=>{
    // res.json(response.data);//输出给浏览器端
    var ret = response.data
    if (typeof ret === 'string') {
      var reg = /^\w+\(({[^()]+})\)$/
      var matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret);
  }).catch(e=>{
    console.log(e);
  })

})



app.use('/api',apiRouter);

app.use(express.static('./dist'));

var port = process.env.PORT || config.build.port;
module.exports=app.listen(port,function(err){
	if(err){
		console.log(err);
		return;
	}
	console.log('Listening at http://localhost:'+port+'\n');
})