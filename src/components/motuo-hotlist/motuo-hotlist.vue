<template>
  	<div class="hotlist">
  		<div class="hotlist" ref="hotlist">
	  		<scroll 
	  		ref="listScrolls"
	  		class="listview"
	  		:listenScroll='listenScroll'
	  		:probeType="probeType"
	  		:data="num"
	  		>
	  			<ul v-show="hotlist.length>0" class="hotlist-list">
		  			<li v-for="item in hotlist" class="hotlist-item" @click="selectItem(item)" v-show="item.id!=201">
		  				<img v-lazy="item.picUrl" class="left-pic">
		  				<div class="right-text">
		  					<h2 v-html="item.topTitle" class="title"></h2>
		  					<ul v-show="item.songList.length>0" class="topsongs">
		  						<li v-for="(song,index) in item.songList" class="topsongs-item" >
		  							<span style="color:rgba(230,230,230,.8);">{{index+1}}</span>&nbsp<span style="font-weight:bolder;">{{song.songname}}</span>&nbsp&nbsp-&nbsp&nbsp<span style="color:rgba(230,230,230,.8);">{{song.singername}}</span>
		  						</li>
		  					</ul>
		  				</div>
		  			</li>
		  		</ul>
	  		</scroll>
  		</div>
  		<div class="loading-container" v-show="!hotlist.length">
  			<loading></loading>
  		</div>
  		<router-view class="detailComponents"></router-view>
  	</div>
</template>

<script>
import {getHotList} from 'api/hotlist'
import {ERR_OK} from 'api/config'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {playlistMinxin} from 'common/js/mixin'
import {mapMutations} from 'vuex' //vuex是对mutataions的封装
export default {
  name: 'yuhua',
  mixins:[playlistMinxin],
  data(){
  	return{
  		hotlist:[],
  		listenScroll:true,
  		probeType:3,
  		num:[0]
  	}
  },
  mounted(){
  	getHotList().then((res)=>{
  		if(res.code==ERR_OK){
  			// console.log(res.data)
  			setTimeout(()=>{
  				// console.log(res.data.topList,'res.data.topList');
  				this.hotlist=res.data.topList;
  			},2000)
  			
  		}else{
  			let msg=confirm('获取排行榜错误,点击确认返回首页');
  			if(msg){
  				this.$router.push('/');
  			}
  		}
  	});
  },
  methods:{
  	handlePlaylist(playlist){
      const bottom=playlist.length>0?'3rem':'';
    	// console.dir(this.$refs.hotlists)
      this.$refs.hotlist.style.bottom=bottom;
      this.num.push(0);

    },
  	selectItem(list){
		this.$router.push({
			path:`/rank/${list.id}`
		});
		this.setHotlist(list);
  	},
    ...mapMutations({
      setHotlist:'SET_HOTLIST'
    })
  },
  watch:{
  	hotlist(){
  		this.num.push(0);
  	}
  },
  components:{Scroll,Loading}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hotlist{
	position: fixed;
	top: 3.3rem;
	bottom: 0rem;
	width: 100%;
	background: #222222;
	z-index: 100;
}
.listview{
	position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    /*background: red;*/
}
.hotlist-list{
	padding:.5rem;
	background: #222222;
}
.hotlist-item{
	height: 4rem;
	overflow: hidden;
	margin-top: .4rem;
	padding: .2rem;
	background:rgba(144,144,144,.1);
	/*background: black;*/
}
.hotlist-item:nth-of-type(1){
	margin-top: 0;
}
.hotlist-item .left-pic{
	float: left;
	width: 4rem;
	height: 4rem;
	border:none;
}
.hotlist-item .right-text{
	padding: .2rem;
	height: 3.6rem;
	overflow: hidden;
	text-align: left;
	font-size: .6rem;
	padding-left: .5rem;
	color: white;
}
.hotlist-item .right-text .title{
	font-weight: bolder;
	height: 1.2rem;
	line-height: 1.2rem;
}
.hotlist-item .right-text .topsongs{
	height: 2.4rem;
}
.hotlist-item .right-text .topsongs .topsongs-item{
	line-height: .8rem;
	font-style: '微软雅黑';
	font-weight: bolder;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.loading-container{
	position: absolute;
	width: 100%;
	top: 50%;
	transform: translateY(-50%);  
	z-index: 1000;
}  
</style>