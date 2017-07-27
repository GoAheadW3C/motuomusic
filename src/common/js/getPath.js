//用于获取地址栏中的path，这个主要用来让导航应该对应相关地址
export default function getPath(){
	let hashVal=window.location.hash.substring(2);
	if(hashVal.indexOf('singer')!=-1){
		hashVal={
			main:'singer',
			whole:hashVal
		}
	}else if(hashVal.indexOf('rank')!=-1){
		hashVal={
			main:'rank',
			whole:hashVal
		}
	}else if(hashVal.indexOf('my')!=-1){
		hashVal={
			main:'my',
			whole:hashVal
		}
	}else{
		hashVal={
			main:'recommend',
			whole:hashVal
		}
	}
	return hashVal;
}