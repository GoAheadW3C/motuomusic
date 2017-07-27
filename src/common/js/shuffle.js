//产生[min,max]闭区间内的整数
function getRandomInt(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

//打乱数组
//让第i个元素跟[0,i]之间的随机的一个元素交换位置
export default function shuffle(arr){
	let _arr=arr.slice();
    for(let i=0;i<_arr.length;i++){
        let j=getRandomInt(0,i);
        let t=_arr[i];
        _arr[i]=_arr[j];
        _arr[j]=t;
    }
    return _arr;
}