import jsonp from 'common/js/jsonp'
import {commonParams,options} from './config'

export function getHotList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg';

  const data = Object.assign({}, commonParams, {
	uin:0,
	platform:'h5',
	needNewCode:1,
	_:Date.now()
  });

  return jsonp(url, data, options);
}

export function getHotlistDetail(id){
	const url="https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg";

	const data=Object.assign({},commonParams,{
		// g_tk:671409464,
		uin:0,
		platform:'h5',
		needNewCode:1,
		tpl:3,
		page:'detail',
		type:'top',
		topid:id,
		_:Date.now()
	});

	return jsonp(url,data,options);
}