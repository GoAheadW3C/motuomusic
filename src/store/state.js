import {playMode} from 'common/js/config'
export default {
	singer:{},
	playing:false,//是否正在播放
	fullScreen:false,//是否全屏
	playlist:[],//顺序播放列表
	sequenceList:[],//播放的列表,可以随机、顺序、循环等
	mode:playMode.sequence,//播放模式
	currentIndex:-1,//播放歌曲的索引,可以前进后退等
	// oldlist:[]
	hotitem:{},
	isShowModal:{
		isShow:false,//控制模态框的开关
		data:''//要传输的内容
	},
	isAdd:false
}