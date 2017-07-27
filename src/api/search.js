import jsonp from 'common/js/jsonp'
import {commonParams,options} from './config'

export function getHotKeys() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg';

  const data = Object.assign({}, commonParams, {
	uin:0,
	platform:'h5',
	needNewCode:1,
	_:Date.now()
  });

  return jsonp(url, data, options);
}

export function getSearchWords(searchWord,page){
	const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp';

	const data = Object.assign({}, commonParams, {
		w:searchWord,
		zhidaqu:1,
		catZhida:1,
		t:0,
		flag:1,
		ie:'utf-8',
		sem:1,
		aggr:0,
		perpage:20,
		n:20,
		p:page,
		remoteplace:'txt.mqq.all',
		uin:0,
		platform:'h5',
		needNewCode:1,
		_:Date.now()
	});

	return jsonp(url, data, options);
}