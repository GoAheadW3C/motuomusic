<template>
  <div class="songs-list">
  	<div class="back" @click="goback">
  		<i class="icon iconfont icon-fanhui1"></i>
  	</div>
  	<h1 class="title" v-html="title"></h1>
  	<div class="bg-image" :style="bgstyle" ref="bgimage">
  		<div class="play-wrapper" ref="playwrapper">
  			<div class="play" v-show="songs.length" @click="randomPlayBtn">
  				<i class="icon iconfont icon-iconfontsuijibofang0101 icon-play"></i>
  				<span class="text">随机播放全部</span>
  			</div>
  		</div>
  		<div class="filter" ref="filter"></div>
  	</div>
  	<div class="bg-layer" ref="layer"></div>
  	<scroll @scroll="scroll" :probe-type='probeType' :listen-scroll='listenScroll'  :data="songs" class="list" ref="list">
  		<div class="song-list-wrapper">
  			<song-list @select='selectItem' :songs="songs"></song-list>
  		</div>
  		<div class="loading-container" v-show="!songs.length">
  			<loading></loading>
  		</div>
  	</scroll>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import SongList from 'base/songlist/songlist'
import Loading from 'base/loading/loading'
import {mapActions} from 'vuex'
import {playlistMinxin} from 'common/js/mixin'
export default {
  name: 'songlist',
  mixins:[playlistMinxin],
  props:{
  		bgimage:{
	  		type:String,
	  		default:''
	  	},
	  	songs:{
	  		type:Array,
	  		default:[]
	  	},
	  	title:{
	  		type:String,
	  		default:''
	  	}
  },
  data(){
  	return {
  		scrollY:0
  	}
  },
  created(){
  	this.probeType=3;
  	this.listenScroll=true;

  },
  mounted(){
  	this.imageHeight=this.$refs.bgimage.clientHeight;
  	this.minTranslateY=-this.imageHeight+document.body.scrollWidth/16*1.6;
  	this.$refs.list.$el.style.top=`${this.$refs.bgimage.clientHeight}px`;
    // this.$nextTick(()=>{
    //   console.log(this.songs,'songslist')
    // })
  },
  methods:{
    handlePlaylist(playlist){
      const bottom=playlist.length>0?'3rem':'';
      this.$refs.list.$el.style.bottom=bottom;
      this.$refs.list.refresh();
    },
    randomPlayBtn(){
      this.randomPlay({
        list:this.songs
      })
    },
    selectItem(item,index){
      // console.log(this.songs,'ssa');
      this.selectPlay({
        list:this.songs,
        index:index
      });
    },
  	scroll(pos){
  		this.scrollY=pos.y;
  	},
  	goback(){
  		this.$router.back();
  	},
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  },
  watch:{
  	scrollY(newY){
  		let translateY=Math.max(this.minTranslateY,newY);
  		let zIndex=0;
  		let scale=1;
  		let blur=0;
  		this.$refs.layer.style['transform']=`translate3d(0,${translateY}px,0)`;
  		this.$refs.layer.style['webkitTransform']=`translate3d(0,${translateY}px,0)`;
  		if(newY>0){
  			scale=1+Math.abs(newY/this.imageHeight);
  			zIndex=100;
  		}else{
  			// blur=Math.min(20,20*Math.abs(newY/this.imageHeight));
  		}
  		// this.$refs.filter.style['backdrop-filter']=`blur(${blur}px)`;
  		// this.$refs.filter.style['weibkitBackdrop-filter']=`blur(${blur}px)`;
  		if (newY<this.minTranslateY) {
  			zIndex=20;
  			this.$refs.bgimage.style.paddingTop=0;
  			this.$refs.bgimage.style.height=document.body.scrollWidth/16*1.6+'px';
  			this.$refs.playwrapper.style.opacity=0;
  		}else{
  			zIndex=0;
  			this.$refs.bgimage.style.paddingTop='70%';
  			this.$refs.bgimage.style.height=0;
  			this.$refs.playwrapper.style.opacity=1;
  		}
  		this.$refs.bgimage.style['transform']=`scale(${scale})`;
  		this.$refs.bgimage.style['webkitTransform']=`scale(${scale})`;
  		this.$refs.bgimage.style.zIndex=zIndex;
  	}
  },
  computed:{
  	bgstyle(){
  		return `background-image:url(${this.bgimage})`;
  	}
  },
  components:{Scroll,SongList,Loading}
}
</script>


<style scoped>
.songs-list{
	position: fixed;
	z-index: 102;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #222222;
	/*background-color: blue;*/
}
.back{
	position:absolute;
  	top: 0;
  	left: .3rem;
  	z-index: 50;
	
}
.icon-fanhui1{
	display: block;
    padding: 10px;
    font-size: .6rem;
	color:gold;
}
.title{
	position: absolute;
	top: 0;
	left: 10%;
	z-index: 40;
	width: 80%;
	text-align: center;
	line-height: 2rem;
	font-size: .8rem;
	color: white;
}
.bg-image{
	position: relative;
	width: 100%;
	height: 0;
	padding-top: 70%;
	transform-origin: top;
	background-size: cover;
}
.bg-image .play-wrapper{
	position: absolute;
	bottom: 1rem;
	z-index: 50;
	width: 100%;
}
.bg-image .play-wrapper .play{
	box-sizing: border-box;
	width: 6.75rem;
	padding: .35rem 0;
	margin: 0 auto;
	text-align: center;
	border: 1px solid gold;
	color: gold;
	border-radius: 5rem;
	font-size: 0;
}
.bg-image .play-wrapper .play .icon-play{
	display: inline-block;
	vertical-align: middle;
	margin-right: .3rem;
	font-size: .7rem;
	vertical-align: middle;
}
.bg-image .play-wrapper .play .text{
	display: inline-block;
	vertical-align: middle;
	font-size: .6rem;
}
.filter{
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(7, 17, 27, 0.4);
}
.bg-layer{
	position: relative;
	height: 100%;
	background: #222222;
}
      
.songs-list .list{
	position: fixed;
	top: 0;
	bottom: 0;
	width: 100%;
	/*overflow: hidden;*/
    /*background-color: red;*/
}
.song-list-wrapper{
	padding: 20px 30px;
	/*background-color: blue;*/
}  
.loading-container{
	position: absolute;
	width: 100%;
	top: 50%;
	transform: translateY(-50%);  
}  
</style>