export function addClass(el,className){
	if(hasClass(el,className)){
		return;
	}
	let newClass=el.className.split('');
	newClass.push(className);
	el.className=newClass.join(' ');
}

//判断是否有这个class
export function hasClass(el,className){
	let reg=new RegExp('(^|\\s)'+className+'(\\s|$)');
	return reg.test(el.className);
}

//有value的时候可以get，没有的时候可以set
export function getData(el,name,val){
	const prefix='data-';
	name=prefix+name;
	if(val){
		return el.setAttribute(name,val);
	}else{
		return el.getAttribute(name);
	}
}