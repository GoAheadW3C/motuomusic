export default class Singer {
	constructor({id,name}){
		this.id=id;//歌手ID
		this.name=name;//歌手名字
		this.avator=`https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000` //歌手头像地址
	}
}