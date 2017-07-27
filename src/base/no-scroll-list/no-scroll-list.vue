<template>
  <div id="no-scroll-list">
  	<div class="randomPlay" v-if="showRandomBtn"@click.stop="randPlay" >
  		<i class="icon iconfont icon-iconfontsuijibofang0101 icon-play"></i>
  		<span class="text">随机播放{{listName}}列表</span>
  	</div>
  	<ul class="list">
  		<li class="listItem" v-for="(song,index) in songs">
  			<i class="icon iconfont icon-yinle iconItem"></i>
	  		<span class="title" @click.stop="selectIt(song,index)">{{song.songname||song.name}}-{{typeof song.singer =='object'?song.singer[0].name:song.singer}}</span>
	  		<span class="clear" @click.stop.prevent="clearIt(song,index)">clear</span>
  		</li>
  		<li v-if="!songs.length" class="tip" @click.stop="gotoSearch">
  			尚无歌曲，点击 <i class="icon iconfont icon-chaxun"></i> 搜索添加
  		</li>
  	</ul>
  </div>
</template>

<script>
import {toggleStorage,STORAGE_SONGS_LIST,STORAGE_RECORD_LIST} from 'common/js/localStorage'
import {mapActions,mapGetters,mapMutations} from 'vuex'
export default {
  name: 'noscrolllist',
  props:{
  	songs:{
  		type:Array,
  		default:[]
  	},
  	listName:{
  		type:String,
  		default:''
  	},
    showRandomBtn:{
      tyoe:Boolean,
      default:true
    }
  },
  data () {
    return {
      i: 0
    }
  },
  methods:{
    randPlay(){
      this.randomPlay({
        list:this.songs
      })
    },
  	selectIt(song,index){
  		// console.log('删除删除啊');
  		this.selectPlay({
	        list:this.songs,
	        index:index
	      });
  	},
  	gotoSearch(){
  		this.$router.push('/Search')
  	},
  	clearIt(song,index){
      // if(index+1==this.songs.length){
      //   this.i++;
      // }
      if(index==this.songs.length){
        return;
      }

      if(this.listName!=''){
          let storageListName=null;
          if(this.listName=='收藏'){
            storageListName=STORAGE_SONGS_LIST;
          }else if(this.listName=='记录'){
            storageListName=STORAGE_RECORD_LIST;
          }

          //去除localstorage对应列表，然后删除选中项，并且重新存入
          let storageList=toggleStorage(storageListName);
          if(storageList!=null){
            if(storageList.length==1){
              toggleStorage(storageListName,true)
            }else{
              let indexNum=-1;
              storageList.forEach((item,index)=>{
                if(item.id==song.id){
                  indexNum=index;
                }
              })
              storageList.splice(indexNum,1);
              toggleStorage(storageListName,storageList);
            }
          }
          
          




console.log('前')
          //告知父级已经清除，让其刷新操作
          if(this.listName=='收藏'){
            console.log('是是是是是是所所所所所所所所')
            this.$emit('haveCleardCollection');
          }else if(this.listName=='记录'){
            storageListName=STORAGE_RECORD_LIST;
            this.$emit('haveCleardRecord');
          }
        }else{
          let deleteNum=null;
          if (this.songs.length>2) {
            this.songs.forEach((item,index)=>{
              if(item.id==song.id){
                // console.log('我不是一首歌')
                deleteNum=index;
              }
            });
            let songs=this.songs.slice();
            songs.splice(deleteNum,1);
            this.setPlayList(songs);
            this.setSequenceList(songs);
          }else if(this.songs.length==2){
            if(this.songs[0].id==song.id){
              this.setPlayList([this.songs[1]]);
              this.setSequenceList([this.songs[1]]);
            }else{
              this.setPlayList([this.songs[0]]);
              this.setSequenceList([this.songs[0]]);
            }
          }else{
            this.setPlayList([]);
            this.setSequenceList([]);
          }
          
        }
  		
  		
  	},
    ...mapMutations({
      setPlayList:'SET_PLAYLIST',
      setSequenceList:'SET_SEQUENCE_LIST'
    }),
  	...mapActions([
      'selectPlay',
      'randomPlay'
    ])	
  },
  watch:{
  	songs:{
  		handler:function(newVal,oldVal){
  			this.$emit('songsChange')
  		},
  		deep:true
  	}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#no-scroll-list{
	color: white;
}
.randomPlay{
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
.randomPlay .icon-play{
	display: inline-block;
	vertical-align: middle;
	margin-right: .3rem;
	font-size: .7rem;
	vertical-align: middle;
}
.randomPlay .text{
	display: inline-block;
	vertical-align: middle;
	font-size: .6rem;
}
.list{
	margin-top: .5rem;
}
.list .tip{
	height: 6rem;
	/*background: red;*/
	font-size: .6rem;
	text-align: center;
	line-height: 6rem;
}
.list .listItem{
	width: 100%;
	text-align: left;
	height: 1.2rem;
	/*background: red;*/
	line-height: 1.2rem;
	font-size: .6rem;
	margin-top: .2rem;
}
.list .listItem .iconItem{
	width: 1.2rem;
	height: 1.2rem;
	line-height: 1.2rem;
	vertical-align: middle;
	float: left;
	/*background: blue;*/
	text-align: center;
}
.list .title{
	width: 9.5rem;
	height: 1.2rem;
	vertical-align: middle;
	float: left;
	overflow: hidden;
	text-overflow:ellipsis;
	white-space: nowrap;
}
.list .clear{
	height: .8rem;
	line-height: .8rem;
	vertical-align: middle;
	float: right;
	margin-right: .1rem;
	background: rgba(255,255,255,.2);
	color: gold;
	padding:.1rem 0.5rem;
	margin-top: .1rem;
	border-radius: .5rem;
}
</style>