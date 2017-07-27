import {creatLocalSong} from 'common/js/song'
export function toggleStorage(name,isRemove,value){
	if(typeof isRemove!='boolean'){
		//第二个参数如果不是布尔值，那么就当做是value
		value=isRemove;
	}else{
		//第二个参数是布尔值，判断真假，为真，则删除，为假，不处理
		if(isRemove===true){
			//移除
			localStorage.removeItem(name);
			return;
		}
	}

	if(value!=undefined){
		console.log(value,88)
		localStorage.setItem(name,JSON.stringify(value));
	}else{
		//让其每个元素都带上getLyric的方法
		if(localStorage.getItem(name)==null){
			return null;
		}
		let songArry=[];
		JSON.parse(localStorage.getItem(name)).forEach(item=>{
			songArry.push(creatLocalSong(item));
		})
		
		return songArry;
	}
}

function _normalizeSongs(list){
      let ret=[];
      list.forEach((item)=>{
        let musicData=item;
        if(musicData.id){
          ret.push(createSong(musicData));
        }
      });
      return ret;
    }
export const STORAGE_SONGS_LIST='collectionSongs';//常量：本地存储收藏列表的名称
export const STORAGE_RECORD_LIST='recordSongs';//常量：本地存储播放记录列表的名称
export const STORAGE_PLAY_LIST='PlayingSongs';//常量：本地存储正在播放的列表的名称