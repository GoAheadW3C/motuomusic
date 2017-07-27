import * as taypes from './mutation-types'

export default {
	[taypes.SET_SINGER](state,singer){
		state.singer=singer;
	},
	[taypes.SET_PLAYING_STATE](state,flag){
		state.playing=flag;
	},
	[taypes.SET_FULL_SCREEN](state,flag){
		state.fullScreen=flag;
	},
	[taypes.SET_PLAYLIST](state,list){
		state.playlist=list;
	},
	[taypes.SET_SEQUENCE_LIST](state,list){
		state.sequenceList=list;
	},
	[taypes.SET_PLAY_MODE](state,mode){
		state.mode=mode;
	},
	[taypes.SET_CURRENT_INDEX](state,index){
		state.currentIndex=index;
	},
	[taypes.SET_HOTLIST](state,hotitem){
		state.hotitem=hotitem;
	},
	[taypes.SET_MODAL_VAL](state,isShow){
		state.isShowModal=isShow;
	},
	[taypes.SET_ADD_SONG](state,isAdd){
		state.isAdd=isAdd;
	}
}