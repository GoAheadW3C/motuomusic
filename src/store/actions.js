import * as types from './mutation-types'
import shuffle from 'common/js/shuffle'
import {playMode} from 'common/js/config'

function keepCurrentIndex(lists,currentIndex,oldlist){
	let item=lists[currentIndex];
	lists.forEach((item,index)=>{
		if(item.id==oldlist[currentIndex].id){
			lists[currentIndex]=oldlist[currentIndex];
			console.log(lists[currentIndex])
			lists[index]=item;
		}
	})
}


export default {
	selectPlay({commit,state},{list,index}){
		console.log(list,'list');
		commit(types.SET_SEQUENCE_LIST,list);
		if(state.mode===2||state.mode==playMode.random){
			let randomList=shuffle(list);
			console.log(index);
			keepCurrentIndex(randomList,index,list);
			commit(types.SET_PLAYLIST,randomList);
		}else{
			commit(types.SET_PLAYLIST,list);
		}
		// commit(types.SET_PLAYLIST,list);
		commit(types.SET_CURRENT_INDEX,index);
		commit(types.SET_FULL_SCREEN,true);
		commit(types.SET_PLAYING_STATE,true);
	},

	randomPlay({commit,state},{list}){
		commit(types.SET_PLAY_MODE,2);
		commit(types.SET_SEQUENCE_LIST,list);
		let randomList=shuffle(list);
		commit(types.SET_PLAYLIST,randomList);
		commit(types.SET_CURRENT_INDEX,0);
		commit(types.SET_FULL_SCREEN,false);
		commit(types.SET_PLAYING_STATE,true);
	},

	loopPlay({commit,state},{list}){
		commit(types.SET_PLAY_MODE,1);
		commit(types.SET_SEQUENCE_LIST,list);
		commit(types.SET_PLAYLIST,list);
		commit(types.SET_CURRENT_INDEX,0);
		commit(types.SET_FULL_SCREEN,true);
		commit(types.SET_PLAYING_STATE,true);
	}
}