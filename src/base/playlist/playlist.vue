<template>
	<div id="wrapper" @click.stop="closeWindow" ref="wrapper">
		<div id="playlist-wrapper" @click.stop="">
			<div class="header">
				<span class="left">播放列表</span>
				<i class="icon iconfont icon-qingchu right" @click.stop="clearAll"></i>
			</div>
			<div class="scrollWrapper">
				<scroll
				:probeType='probeType' 
				:listenScroll='listenScroll'  
				:data="playlist"
				class="scrollList"
				>
					<div class="list-wrapper">
						<no-scroll-list
						:songs="playlist||[]"
						:showRandomBtn='false'
						></no-scroll-list>
					</div>
				</scroll>
			</div>
			<div class="bottom" @click.stop="closeWindow">关闭</div>
		</div>
	</div>
</template>

<script>
import NoScrollList from 'base/no-scroll-list/no-scroll-list'
import Scroll from 'base/scroll/scroll'
import {mapGetters,mapMutations} from 'vuex'
import {toggleStorage,STORAGE_PLAY_LIST} from 'common/js/localStorage'
export default {
  name: 'playlist',
  data(){
  	return{
  		probeType:3,
  		listenScroll:true
  	}
  },
  methods:{
  	// addSong(){
  	// 	console.log(1);
  	// 	//发送请求，将isAdd设置为true
  	// 	this.setAddSong(true);
  	// 	// console.log(this.playlist,'先存起来');
  	// 	toggleStorage(STORAGE_PLAY_LIST,this.playlist)
  	// 	//先撤退页面
  	// 	this.closeWindow();
  	// 	//跳转页面到搜索页面
  	// 	this.$router.push('/search');
  	// },
  	closeWindow(){
  		// this.setAddSong(false);
  		this.$refs.wrapper.style.bottom="-14rem";
  		this.$refs.wrapper.style.transition=".3s bottom";
  		setTimeout(()=>{
  			this.$refs.wrapper.style.zIndex="-100";
  		},300)
  		// 
  	},
  	clearAll(){
  		let ret=confirm('你确定要清除吗?');
  		if(ret){
  			this.setPlayList([]);
	  		this.setPlayingState(false);
			this.setCurrentIndex(-1);
			this.setSequenceList([]);
  		}
  		
  	},
  	...mapMutations({
  		setModalVal:'SET_MODAL_VAL',
  		setFullScreen:'SET_FULL_SCREEN',
  		setPlayingState:'SET_PLAYING_STATE',
  		setCurrentIndex:'SET_CURRENT_INDEX',
  		setPlayMode:'SET_PLAY_MODE',
  		setPlayList:'SET_PLAYLIST',
  		setSequenceList:'SET_SEQUENCE_LIST',
  		setAddSong:'SET_ADD_SONG'
  	})
  },
  computed:{
  	...mapGetters([
  		'playlist'
  	])
  },
  components:{NoScrollList,Scroll}
}
</script>


<style scoped>
#wrapper{
	width: 100%;
	position: fixed;
	top: 0;
	bottom: -14rem;
	z-index: -100;
	background: rgba(0,0,0,.5);
}
#playlist-wrapper{
	width: 100%;
	height: 14rem;
	position: absolute;
	bottom: 0rem;
	left: 0;
	background: rgba(49,49,49,1);
	z-index: 9999;
}
#playlist-wrapper .header{
	width: 100%;
	height: 1.5rem;
	line-height: 1.5rem;
	font-size: .6rem;
	border-bottom: 2px solid gold;
	color: gold;
	text-align: center;
	margin-bottom: .5rem;
	letter-spacing: .2rem;
	box-sizing: border-box;
}
#playlist-wrapper .header .left{
	float: left;
	padding-left: .4rem;
}
#playlist-wrapper .header .right{
	float: right;
	padding-right: .4rem;
}
.scrollWrapper{
	width: 100%;
	height:10.5rem;
}
.scrollList{
	position: relative;
	width: 100%;
	height: 100%;
	top: 0;
	bottom: 0;
	overflow: hidden;
}
.bottom{
	font-size: .6rem;
	height: 1.5rem;
	line-height: 1.5rem;
	text-align: center;
	color: gold;
	position: absolute;
	bottom: 0;
	width: 100%;
	background: rgba(80,80,80,1);
}
</style>