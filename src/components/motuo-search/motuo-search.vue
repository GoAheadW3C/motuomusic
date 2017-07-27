<template>
  <div id="motuo-search" ref="searchPart">
  	<div class="search-wrapper" ref="searchWrapper">
  		<scroll 
  		ref="listScrolls"
  		class="searchScroll"
  		:data="num"
		:listenScroll='listenScroll'
  		:probeType="probeType"
  		>
  			<div style="width:100%;height100%;">
	  			<div class="searchBar">
	  				<!-- 搜索的icon暂用播放的icon代替 -->
		  			<i class="icon iconfont icon-chaxun iconSearch"></i>
		  			<input 
		  			type="text" 
		  			placeholder="搜索歌曲、歌手、专辑" 
		  			class="searchText"
		  			v-model="searchContent"
		  			ref="inputBox"
		  			>
		  			<i class="icon iconfont icon-quxiao iconCancel" @click="clearText"></i>
		  			<span class="searchCancel" @click.stop="goToHome">取消</span>
	  			</div>
	  			<div class="hotKeys-wrapper" v-show="!isSearch">
	  				<h2 class="title">热门搜索</h2>
	  				<ul class="hotKeys" v-show="hotKeys.length>0">
	  					<li v-for="key in hotKeys" @click.stop="selectHotKet(key)">{{key}}</li>
	  				</ul>
	  			</div>
				<div class="resultList-wrapper" v-show="isSearch">
					<ul class="resultList">
						<li @click.stop="selectItem(result)" class="resultItem" v-for="result in getResultContent"  v-if="(result.songname.indexOf('&#')==-1)&&(result.singer[0].name.indexOf('&#')==-1)">
							<i class="icon iconfont icon-yinle IconResult"></i>
							<div class="resultText">
								<span class="title">{{result.songname}}-{{result.singer[0].name}}</span>
							</div>
						</li>
						<li class="noResult-tip" v-if="!getResultContent.length">网络延迟<br>或暂无搜索结果</li>
					</ul>
				</div>
			</div>
  		</scroll>
  		
  	</div>
  	<div class="noResult-tip" v-if="!hotKeys.length">网络请求错误<br><br>请检查网络</div>
  </div>
</template>

<script>
import {getHotKeys,getSearchWords} from 'api/search'
import {ERR_OK} from 'api/config'
import Scroll from 'base/scroll/scroll'
// import {getLyric} from 'api/lyric'
import {createSong} from 'common/js/song'
import {mapActions,mapGetters,mapMutations} from 'vuex'
import {toggleStorage,STORAGE_PLAY_LIST} from 'common/js/localStorage'
import {playlistMinxin} from 'common/js/mixin'
export default {
  name: 'motuosearch',
  mixins:[playlistMinxin],
  data () {
    return {
      num:[0],
      listenScroll:true,
      probeType:3,
      isSearch: false,
      searchContent:'',
      hotKeys:[],
      getResultContent:[]//搜索到的结果
    }
  },
  mounted(){
  	this._getHotKeys();
  },

  methods:{
  	handlePlaylist(playlist){
      const bottom=playlist.length>0?'3rem':'0';
      // console.log(this.$refs)
      this.$refs.searchWrapper.style.bottom=bottom;
      this.$refs.listScrolls.refresh();

    },
  	selectItem(song){
  		// if(this.isAdd){
  		// 	//添加给播放列表即可
  		// 		//先获取playlist，然后加上这首歌，在提交palylist
  		// 		let list=toggleStorage(STORAGE_PLAY_LIST);
  		// 		let flag=false;
  		// 		list.forEach((item,index)=>{
  		// 			if(item.id==song.id){
  		// 				flag=true;
  		// 				alert('已存在，请添加另外歌曲');
  		// 			}
  		// 		})
  		// 		if(!flag){
  		// 			list=list.concat(song);
  		// 			// list=this._normalizeSongs(list);
	  	// 			this.setPlayList(list);

	  			

	  	// 		//层级降低至100
	  	// 			this.$refs.searchPart.style.zIndex=100;

	  	// 		//发送给父级，让其打开playlist版块
	  	// 			this.$emit('openPlayListPart');
	  	// 		//添加完了发送请求将isAdd改成false
	  	// 			// this.setAddSong(false);
	  	// 		//关闭搜索页面
  		// 			this.$router.push('/');
  		// 		}
  		// 	flag=false;
  		// 	return;
  		// };
  		let songlist=[];
  		songlist.push(song);
  		songlist=this._normalizeSongs(songlist);
  		this.loopPlay({
  			list:songlist,
  			index:0
  		})
  	},
  	_normalizeSongs(list){
      let ret=[];
      list.forEach((item)=>{
        let musicData=item;
        if(musicData.songid&&musicData.albummid){
          ret.push(createSong(musicData));
        }
      });
      return ret;
    },
  	goToHome(){
  		this.searchContent='';
  		this.$router.back();
  	},
  	clearText(){
  		this.searchContent='';
  	},
  	selectHotKet(hotKetWord){
  		this.searchContent=hotKetWord;
  	},
  	_getHotKeys(){
  		getHotKeys().then(res=>{
  			if(res.code==ERR_OK){
  				this.hotKeys=res.data.hotkey.map((item)=>{
  					return item.k;
  				}).slice(0,10);
  			}else{

  			}
  		})
  	},
  	_getSearchWords(searchWord,page){
  		getSearchWords(searchWord,page).then(res=>{
  			if(res.code==ERR_OK){
  				this.getResultContent=res.data.song.list;
  				// setTimeout(()=>{
  				// 	this.$refs.listScrolls.refresh();
  				// },20)
  			}
  		})
  	},
  	...mapMutations({
  		setPlayList:'SET_PLAYLIST',
  		setAddSong:'SET_ADD_SONG'
  	}),
  	...mapActions([
      'loopPlay'
    ])
  },
  watch:{
  	hotKeys(newVal){
  		if(newVal.length>0){
  			this.num.push(0);
  		}
  	},
  	getResultContent(newVal){
  		if(newVal.length>0){
  			this.num.push(0);
  		}
  		
  	},
  	searchContent(newVal){
  		if(newVal==''){
  			this.isSearch=false;
  		}else{
  			this.isSearch=true;
  		};
  		this._getSearchWords(newVal,1);
  	}
  },
  computed:{
  	...mapGetters([
  		'isAdd',
  		'playlist'
  	])
  },
  components:{Scroll}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#motuo-search,.search-wrapper{
	position: fixed;
	top: 0;
	bottom: 0;
	width: 100%;
	background: #222222;
	z-index: 100;
	color:white;
}
.searchScroll{
	position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #222222;
    /*background: red;*/
}
.searchBar{
	width: 14.4rem;
	height: 2rem;
	position: relative;
	padding: .8rem;
}
.iconSearch{
	position: absolute;
	width: 1.2rem;
	height: 1.2rem;
	z-index: 100;
	left: .8rem;
	top: 1.2rem;
	text-align: center;
	line-height: 1.4rem;
	color: black;
	/*color: */
}
.iconCancel{
	position: absolute;
	width: 1.2rem;
	height: 1.2rem;
	z-index: 100;
	right: 2.7rem;
	top: 1.2rem;
	text-align: center;
	line-height: 1.4rem;
	color: black;
}
.searchText{
	width: 12.5rem;
	height: 1.2rem;
	padding-right: 1.2rem;
	box-sizing: border-box;
	position: absolute;
	top: 50%;
	left: 50%;
	margin-left: -7.2rem;
	margin-top: -.6rem;
	border-radius: .2rem;
	text-indent: 1.5rem;
	background: rgba(60,60,60,1);
	font-size: .6rem;
	color: rgba(110,110,110,1);
	outline: none;
}
.searchCancel{
	width: 2rem;
	height: 1.2rem;
	color: rgba(110,110,110,1);
	text-align: center;
	font-size: .6rem;
	line-height: 1.3rem;
	position: absolute;
	right: .5rem;
	top: 50%;
	margin-top: -.6rem;
	letter-spacing: .1rem;
}
.hotKeys-wrapper{
	width: 14.4rem;
	padding: 0 .8rem;
	/*background: red;*/
}
.hotKeys-wrapper .title{
	height: 1.2rem;
	line-height: 1.2rem;
	font-size: .6rem;
	font-weight: bolder;
	color:rgba(110,110,110,1);
}
.hotKeys-wrapper .hotKeys{
	width: 14.4rem;
}
.hotKeys-wrapper .hotKeys li{
	display: inline-block;
	height: 1.2rem;
	line-height: 1.2rem;
	font-size: .6rem;
	color:rgba(210,210,210,.3);
	padding: .1rem .5rem 0 .5rem;
	background-color:rgba(110,110,110,.3);
	border-radius: .18rem;
	margin: .3rem .3rem 0;
}
.resultList-wrapper{
	width: 14.4rem;
	padding: 0 .8rem;
}
.resultList-wrapper .resultList{
	width: 100%;
}
.resultList-wrapper .resultItem{
	width: 100%;
	height: 1.2rem;
	color: rgba(110,110,110,1);
	margin-top: .4rem;
}
.resultList-wrapper .resultItem .IconResult{
	float: left;
	width: 1.2rem;
	height: 1.2rem;
	line-height: 1.2rem;
}
.resultList-wrapper .resultItem .resultText{
	float: left;
	height: 1.2rem;
	line-height: 1.2rem;
	
}
.resultList-wrapper .resultItem .resultText .title{
	float: left;
	font-size: .7rem;
	width: 13rem;
	overflow: hidden;
	text-overflow:ellipsis;
	white-space: nowrap;

}
.noResult-tip{
	text-align: center;
	font-size: .6rem;
	color:rgba(210,210,210,.3);
	height: 16rem;
	line-height: 16rem;
}
</style>