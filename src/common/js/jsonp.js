import oldJSONP from 'jsonp';

//url为地址，data为一个对象，是查询字符串
export default function jsonp(url,data,option){

	//如果有？那就直接加&，如果没有就加？
	url+=(url.indexOf('?')<0?'?':'&')+param(data);

	return new Promise((resolve,reject)=>{
		oldJSONP(url,option,(err,data)=>{
			//这个err如果是null，表示成功
			if(!err){
				resolve(data);
			}else{
				reject(err);
			}
		})
	})
}

//参数与url拼接
function param(data){
	let url='';
	for(var attr in data){
		let value=data[attr]!=undefined?data[attr]:'';
		url += `&${attr}=${encodeURIComponent(value)}`;
	}
	return url?url.substring(1):'';
}