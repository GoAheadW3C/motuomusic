<template>
  <div id="motuo-recommend" ref="recommend">
  	<scroll 
  	ref="scroll" 
  	class="recommend-content" 
  	:data='recommendList'
  	>
		<div class="wrapper">
	  		<div v-if="recommendStatic.length"  class="slider-wrapper">
				<slider>
			  		<div v-for="item in recommendStatic">
			  			<a :href="item.linkUrl">
			  				<img @load="loadImg" class="needsclick" :src="item.picUrl">
			  			</a>
			  		</div>
			  	</slider>
	  		</div>
	  		<div class="recommond-nav">
				<span class="item" @click.stop="toDetailPage('singer')">
					<i class="navIcon icon iconfont icon-iconfontttpodicon2"></i>
					<span class="title">歌手</span>
				</span>
				<span class="item" @click.stop="toDetailPage('rank')">
					<i class="navIcon icon iconfont icon-paihang"></i>
					<span class="title">排行</span>
				</span>
				<span class="item" @click.stop="toDetailPage('playlist')">
					<i class="navIcon icon iconfont icon-liebiao"></i>
					<span class="title">歌单</span>
				</span>
				<span class="item" @click.stop="toDetailPage('collection')">
					<i class="navIcon icon iconfont icon-icon21"></i>
					<span class="title">收藏</span>
				</span>
				<span class="item" @click.stop="toDetailPage('drive')">
					<i class="navIcon icon iconfont icon-zhinengjiashi"></i>
					<span class="title">驾驶</span>
				</span>
				<span class="item" @click.stop="toDetailPage('setTime')">
					<i class="navIcon icon iconfont icon-dingshiguanji-"></i>
					<span class="title">定时</span>
				</span>
			</div>
			<div class="recommond-list">
				
				<h1 class="list-title">每日为你推荐•12首</h1>
				<h3 class="partTitle">中文金曲</h3>
				<ul class="list-detail" ref="ullist">
					
					<li class="item" v-for="(song,index) in songsChinese" @click.stop="select(song,index,'C')">
						<img class="img" :src="song.image">
						<div class="title">{{song.name}}</div>
					</li>
				</ul>
				<br>
				<h3 class="partTitle">英文热歌</h3>
				<ul class="list-detail" ref="ullist">
					<li class="item" v-for="(song,index) in songsEnglish" @click.stop="select(song,index,'E')">
						<img class="img" :src="song.image">
						<div class="title">{{song.name}}</div>
					</li>
					<!-- <li class="item-content" v-for="(item,index) in recommendList">
						<span class="left">
							<div class="index">{{index+1}}</div>
							<div class="incre">
							<span v-if="(item.old_count-item.in_count>0)&&(item.old_count!=0)"><span style="color:#6cff00;">↑</span>{{item.old_count-item.in_count}}
							</span>
							<span v-if="(item.old_count-item.in_count<0)&&(item.old_count!=0)"><span style="color:#bbbbbb;">↓</span>{{item.old_count-item.in_count}}
							</span>
							<span v-if="item.old_count==0">
								<span style="color:red;">New</span>
								
							</span>
							
							</div>
						</span>
						<span class="right">
							<div class="name">{{item.data.songname}}</div>
							<div class="desc">{{item.data.singer[0].name}} - {{item.data.albumname}} {{item.data.albumdesc}}</div>
						</span>
					</li> -->
				</ul>
			</div>
		</div>
		<div class="loading" v-show="!songsChinese.length||!songsEnglish.length">
			<loading></loading>
		</div>
  	</scroll>
  </div>
</template>

<script>
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {ERR_OK} from 'api/config'
import {getRecommend,getRecommendList} from 'api/recommend'
import {playlistMinxin} from 'common/js/mixin'
import {getHotlistDetail} from 'api/hotlist'
import {createSong} from 'common/js/song'
import {mapActions,mapMutations} from 'vuex'
export default {
  name: 'motuorecommend',
  mixins:[playlistMinxin],
  data () {
    return {
    	recommendStatic:[],
    	recommendList:[],
    	songsChinese:[],
    	songsEnglish:[]
    }
  },
  created(){
  	this._getRecommend();
  	this._getRecommendList();
  },
  mounted(){
  	this._getHotlistDetailChinese(5);//获取歌曲列表,5为id
  	this._getHotlistDetailEnglish(3);//获取歌曲列表,3为id
  },
  methods:{
  	toDetailPage(pageName){
  		switch(pageName){
  			case 'singer':
  				this.$router.push('/singer');
  				break;
  			case 'rank':
  				this.$router.push('/rank');
  			break;
  			case 'playlist':
  				this.$emit('toShowPlaylist');
  			break;
  			case 'collection':
  				this.$router.push('/my/MyCollection');
  			break;
  			case 'drive':
  				this.setModalVal({
					isShow:true,
					data:'drive'
				});
  			break;
  			case 'setTime':
  				this.setModalVal({
					isShow:true,
					data:'timeClose'
				});
  			break;
  		}
  	},
	select(item,index,letter){
		if(letter=='C'){
			this.selectPlay({
				list:this.songsChinese,
				index:index
			});
		}else if(letter=='E'){
			this.selectPlay({
				list:this.songsEnglish,
				index:index
			});
		}
		
	},
  	_getHotlistDetailChinese(id){
	  	getHotlistDetail(id).then(res=>{
	  		if(res.code==ERR_OK){
	  			this.songsChinese=this._normalizeSongs(res.songlist).slice(0,6);
	  			// console.log(this.songs);
	  		}else{
	  			this.songsChinese=[];
	  		}
	  	})
  	},
  	_getHotlistDetailEnglish(id){
	  	getHotlistDetail(id).then(res=>{
	  		if(res.code==ERR_OK){
	  			this.songsEnglish=this._normalizeSongs(res.songlist).slice(0,6);
	  			// console.log(this.songs);
	  		}else{
	  			this.songsEnglish=[];
	  		}
	  	})
  	},
  	_normalizeSongs(list) {
	    let ret = [];
	    list.forEach((item) => {
	      const musicData = item.data;
	      if (musicData.songid && musicData.albummid) {
	        ret.push(createSong(musicData));
	      }
	    });
	    return ret;
	},
  	handlePlaylist(playlist){
      const bottom=playlist.length>0?'3rem':'';
      this.$refs.recommend.style.bottom=bottom;

      this.$refs.scroll.refresh();

    },
  	loadImg(){//判断已经有一家加载完毕，那这样高度就占据了
  		if(!this.checkLoaded){
  			this.$refs.scroll.refresh();
  			this.checkLoaded=true;
  		}
  	},
  	_getRecommend(){
  		getRecommend().then(res=>{
  			if(res.code===ERR_OK){
  				this.recommendStatic=res.data.slider;
  			}
  			
  		});
  	},
  	_getRecommendList(){
  		getRecommendList().then((res)=>{
  			if(res.code==ERR_OK){
  				this.recommendList=res.songlist.slice(0,30);
  			}
  		});
  	},
  	...mapMutations({
      setModalVal:'SET_MODAL_VAL'
    }),
  	...mapActions([
      'selectPlay'
    ])
  },
  components:{Slider,Scroll,Loading}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#motuo-recommend{
	/*position: absolute;
    width: 100%;
    top: 3.3rem;*/
    position: fixed;
    width: 100%;
    top: 2.4rem;
    bottom: 0rem;
}
.recommend-content{
	 /*height: 100%;
     overflow: hidden;*/
     position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #222222;

}
.slider-wrapper{
	 position: relative;
     width: 100%;
     overflow: hidden;
     margin-top: 1rem;
}
.recommond-list{
	width: 100%;
	background-color: #222222;
}
.recommond-list .list-title{
	margin:0;
	text-align: center;
	font-size: .9rem;
	line-height: 3rem;
	height: 2.5rem;
	font-weight: 300;
	color:rgba(254,201,1,1);
}
.list-content{
	width: 100%;
	margin:0;
	padding: 0;
	list-style: none;
}
.item-content {
	width: 100%;
	height: 3rem;
	margin-bottom: .5rem;
	/*background-color: red;*/
	color: white;
	padding: .4rem 0 .35rem;
	box-sizing: border-box;
}
.item-content .left{
	float: left;
	width: 2rem;
	height: 2.2rem;
	margin-left: .5rem;
	/*background-color: yellow;*/
	text-align: center;
	box-sizing: border-box;
}
.item-content .left .index{
	height: 50%;
	font-size: 1rem;
	line-height: 1.8rem;
}
.item-content .left .incre{
	height: 50%;
	font-size: .6rem;
	line-height: 1.8rem;
	color:rgba(255,255,255,.2);
}
.item-content .right{
	float: left;
	width: 12.5rem;
	height: 2.6rem;
	border-bottom: 1px solid rgba(230,230,230,.1);
	margin-left: .5rem;
	box-sizing: border-box;
	/*background-color: blue;*/
	overflow: hidden;
}
.item-content .right .name{
	height: 1.3rem;
	font-size:.85rem;
	line-height: 1.3rem;
	text-shadow: rgba(214,158,0,.4) 1px 1px 0px;
	color:white;
}
.item-content .right .desc{
	height: 1.3rem;
	font-size:.7rem;
	line-height: 1.3rem;
	color:rgba(205,205,205,.5);
	overflow: hidden;
	text-overflow:ellipsis;
	white-space: nowrap;
}
.loading{
	position: absolute;
	width: 100%;
	top: 50%;
	margin-top: -12px;
}
.recommond-nav{
	width: 100%;
	height: 4rem;
	/*background: red;*/
	margin-top: .5rem;
}
.recommond-nav .item{
	float: left;
	width: 33.33%;
	height: 2rem;
	line-height: 2rem;
	font-size: .6rem;
	text-align: center;
	/*vertical-align: middle;*/
	/*background: red;*/
}
.recommond-nav .item .navIcon{
	color: gold;
}
.recommond-nav .item .title{
	vertical-align: top;
	color: rgba(255,255,255,.8);
}
.list-detail{
	width: 16rem;
	/*background: red;*/
	height: 12rem;
}
.list-detail .item{
	width: 5.3rem;
	height: 6.3rem;
	float: left;
	text-align: center;
}
.list-detail .item:nth-of-type(3n-1){
	margin: 0 .05rem;
}
.list-detail .item .img{
	float: left;
	width: 5.3rem;
	height: 5.3rem;
	/*background: blue;*/
}
.list-detail .item .title{
	padding: 0 .2rem;
	font-size: .6rem;
	line-height: 1rem;
	text-align: left;
	overflow: hidden;
	text-overflow:ellipsis;
	white-space: nowrap;
	color: rgba(255,255,255,.8);
}
.partTitle{
	font-size: .6rem;
	height: 1rem;
	line-height: 1rem;
	padding: 0 .2rem;
	color: rgba(255,255,255,.8);
}
.wrapper{
	padding-bottom: 2rem;
}
</style>