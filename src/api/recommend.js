//获取推荐的资源

import jsonp from 'common/js/jsonp'
import {commonParams,options} from './config'
import axios from 'axios'



export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return jsonp(url, data, options)
}



export function getRecommendList(){
	const url='/api/getRecommendList';
	const data = Object.assign({}, {}, {
    g_tk:5381,
	uin:1152921504737068114,
	format:'json',
	inCharset:'utf-8',
	outCharset:'utf-8',
	notice:0,
	platform:'h5',
	needNewCode:1,
	tpl:3,
	page:'detail',
	type:'top',
	topid:26,
	_:1499400941622
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// export function getRecommendList(){
// 	const url='/api/getRecommendList';
// 	const data=Object.assign({},commonParams,{
// 		g_tk:1928093487,
// 		inCharset:'utf-8',
// 		outCharset:'utf-8',
// 		notice:0,
// 		format:'json',
// 		platform:'yqq',
// 		hostUin:0,
// 		sin:0,
// 		ein:29,
// 		sortId:5,
// 		needNewCode:0,
// 		categoryId:10000000,
// 		rnd:0.6692404593282741
// 	})

// 	return axios.get(url,{
// 		params:data
// 	}).then(res=>{
// 		return Promise.resolve(res.data);
// 	})
// }


