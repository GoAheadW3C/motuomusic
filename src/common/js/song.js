import {getLyric} from 'api/lyric'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'

export default class Song{
	constructor({id,mid,name,singer,album,url,image,duration}){
		this.id=id;
		this.mid=mid;
		this.singer=singer;
		this.name=name;
		this.album=album;
		this.duration=duration;
		this.image=image;
		this.url=url;
	}
	getLyric(){
		if(this.lyric){
			return Promise.resolve(this.lyric);
		}

		return new Promise((resolve,reject)=>{
			getLyric(this.mid).then(res=>{
				// console.log(res,'res');
				if (res.retcode === ERR_OK) {
		          this.lyric = Base64.decode(res.lyric);
		          resolve(this.lyric)
		        } else {
		          reject('暂无歌词')
		        }
			})
		})
	}
}



export function creatLocalSong(song){
	return new Song({
		id:song.id,
		mid:song.mid,
		singer:song.singer,
		name:song.name,
		album:song.album,
		duration:song.duration,
		image:song.image,
		url:song.url
	})
}

export function createSong(musicData){
	// console.log(musicData,'musicData');
	// console.log(musicData.songmid,'musicData.songmid');
	return new Song({
		id:musicData.songid,
		mid:musicData.songmid,
		singer:filterSinger(musicData.singer),
		name:musicData.songname,
		album:musicData.albumname,
		duration:musicData.interval,
		image:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
		url:`http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
	})
}

function filterSinger(singer){
	let ret=[];
	if(!singer){
		return ''
	}
	singer.forEach(item=>{
		ret.push(item.name)
	})
	return ret.join('/');
}