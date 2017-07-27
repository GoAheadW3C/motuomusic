<template>
  <div id="my" ref="myWrapper">
  	<scroll 
  	ref="myView"
  	class="scrollMy"
	:listenScroll='listenScroll'
  	:probeType="probeType"
  	:data="num"
  	>
  		<div>
	  		<div class="header">
	  			<img class="avator" src="http://img1.imgtn.bdimg.com/it/u=4174556084,2595197049&fm=26&gp=0.jpg">
	  			<div class="nickname">— 我的本地 —</div>
	  		</div>
	  		<div class="content">
	  			<ul class="contentList">
	  				<li class="item" @click.stop="showCollectionList">
	  					 <i class="icon iconfont icon-wodeshoucang contentIcon"></i>
	  					 <div class="desc">本地收藏</div>
	  				</li>
	  				<li class="item" @click.stop="showRecordList">
	  					 <i class="icon iconfont icon-gerenzhongxin-liulanjilu- contentIcon"></i>
	  					 <div class="desc">本地记录</div>
	  				</li>
	  				<li class="item" @click.stop="showSettingList">
	  					 <i class="icon iconfont icon-xitongshezhi contentIcon"></i>
	  					 <div class="desc">本地设置</div>
	  				</li>
	  				<li class="item activeItem selectIt" ref="selectItBg"></li>
	  			</ul>
	  		</div>
	  		<router-view 
		  		class="contentDetail" 
		  		@hasChange="hasChange" 
		  		:collectionList="collectionList" 
		  		:recordList='recordList' 
		  		@haveCleardCollectionOne="haveCleardCollectionOne" 
		  		@haveCleardRecordOne="haveCleardRecordOne"
	  		></router-view>
	  	</div>
  	</scroll>
  	
  </div>
</template>

<script>

import {toggleStorage,STORAGE_SONGS_LIST,STORAGE_RECORD_LIST} from 'common/js/localStorage'
import Scroll from 'base/scroll/scroll'
import {playlistMinxin} from 'common/js/mixin'
export default {
  name: 'my',
  mixins:[playlistMinxin],
  data(){
  	return {
  		num:[0],//通过data传给scroll组件，组件内容watch了data这个属性，长度变化就refresh
  		collectionList:[],
  		recordList:[],
  		isShowModal:false//控制模态框能否显示
  	}
  },
  watch:{
  	num(newVal){
  		if(newVal.length>20){
  			newVal.length=1;
  		}
  	}
  },
  updated(){
  	
  },
  created(){
  	

  	this.listenScroll=true;
  	this.probeType=3;

  	//从localstorage中获取收藏列表
  	let colist=toggleStorage(STORAGE_SONGS_LIST);
  	if(colist==null){
  		this.collectionList=[];
  	}else{
  		this.collectionList=colist;
  	}
  	//从localstorage中获取播放记录列表
  	let relist=toggleStorage(STORAGE_RECORD_LIST);
  	if (relist==null) {
  		this.recordList=[];
  	}else{
  		this.recordList=relist;
  	}

  	
  },
  activated(){
  	//从localstorage中获取收藏列表
  	let list=toggleStorage(STORAGE_SONGS_LIST);
  	if(list==null){
  		this.collectionList=[];
  	}else{
  		this.collectionList=list;
  	}

  	//从localstorage中获取播放记录列表
  	let relist=toggleStorage(STORAGE_RECORD_LIST);
  	if (relist==null) {
  		this.recordList=[];
  	}else{
  		this.recordList=relist;
  	}

  	// window.addEventListener('hashchange',()=>{
      if(location.hash=="#/my/MyRecord"){
      	console.log('#/my/MyRecord')
      	this.changeSelectItBg(1);
      }else if(location.hash=="#/my/MyCollection"){
      	console.log('#/my/MyCollection')
		this.changeSelectItBg(0);
      }else if(location.hash=="#/my/MySetting"){
      	console.log('#/my/MySetting')
      	this.changeSelectItBg(2);
      }
    // });
  },
  methods:{
  	handlePlaylist(playlist){
      const bottom=playlist.length>0?'3rem':'';
      this.$refs.myWrapper.style.bottom=bottom;

      this.num.push(0);

    },
  	showModal(data){
  		this.isShowModal=true;
  		// console.log(data);
  	},
  	haveCleardRecordOne(){
  		//已经清除记录了，要重新获取下
  		//从localstorage中获取收藏列表
	  	let relist=toggleStorage(STORAGE_RECORD_LIST);
	  	if(relist==null){
	  		this.recordList=[];
	  	}else{
	  		this.recordList=relist;
	  	}
	  	this.num.push(0);
  	},
  	haveCleardCollectionOne(){
      console.log('haveCleardCollectionOne')
  		//已经清除收藏了，要重新获取下
  		//从localstorage中获取收藏列表
	  	let list=toggleStorage(STORAGE_SONGS_LIST);
	  	if(list==null){
	  		this.collectionList=[];
	  	}else{
	  		this.collectionList=list;
	  	}
	  	this.num.push(0);
  	},
  	hasChange(){
  		this.num.push(0);
  	},
  	showCollectionList(){
  		this.haveCleardCollectionOne();
  		this.$router.push('/my/MyCollection');
  		this.num.push(0);
  		this.changeSelectItBg(0);
  	},
  	showRecordList(){
  		this.haveCleardRecordOne();
  		this.$router.push('/my/MyRecord');
  		this.num.push(0);
  		// console.log(this.num,'ss')
  		this.changeSelectItBg(1);
  	},
  	showSettingList(){
  		this.$router.push('/my/MySetting');
  		this.num.push(0);
  		this.changeSelectItBg(2);
  	},
  	changeSelectItBg(num){
  		this.$refs.selectItBg.style.left=num*5.325+'rem';
  		this.$refs.selectItBg.style.transition=".3s";
  		this.$refs.selectItBg.style.webkitTransition=".3s";
  	}
  },
  components:{Scroll}
}
</script>

<style scoped>
#my{
	position: fixed;
	top: 3.3rem;
	bottom: 0;
	width: 100%;
	left: 0;
	right: 0;
	/*background: red;*/
	background-color: #222222;
}
.scrollMy{
	position: relative;
	width: 100%;
	height: 100%;
	top: 0;
	bottom: 0;
	overflow: hidden;
	/*background: blue;*/
}
.header{
	width: 100%;
	height: 4rem;
	padding: .5rem 0;
	text-align: center;
	overflow: hidden;
	/*background: orange;*/
}
.avator{
	width: 3rem;
	height: 3rem;
	border-radius: 50%;
	border:4px solid rgba(255,255,255,.5);
}
.nickname{
	width: 100%;
	height: 1rem;
	line-height: 1rem;
	font-size: .7rem;
	color: white;
	text-align: center;
	/*background: blue;*/

}
.contentList{
	width: 100%;
	height: 5rem;
	overflow: hidden;
	/*background: white;*/
	position: relative;
}
.contentList .item{
	width: 4rem;
	height: 5rem;
	float: left;
	margin: 0 .66rem;
	background-color: /*blue*/;
}
.selectIt{
	position: absolute;
	left: 0rem;
	/*第一个是0rem;第二个的是5.32rem;第三个是10.65rem*/
	top: 0;
	z-index: -1;
}
.activeItem{
	background: rgba(255,255,255,.1);
}
.contentIcon{
	display: inline-block;
	width: 100%;
	height: 3rem;
	/*background: red;*/
	font-size: 2rem;
	text-align: center;
	line-height: 3rem;
	color: rgba(255,215,0,.8);
	margin-top: .5rem;
}
.desc{
	width: 100%;
	height: 1rem;
	line-height: 1rem;
	font-size: .6rem;
	text-align: center;
	color: rgba(255,255,255,.6);
}
.contentDetail{
	/*width: 100%;*/
	margin: 1rem .5rem;
	padding: .5rem;
	border-radius: .3rem;
	background: rgba(56,55,52,.67);
	border:.1rem solid gold;
	min-height: 10rem;
}
</style>