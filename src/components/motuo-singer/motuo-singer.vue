<template>
  <div id="motuo-singer" ref="singer">
  	<list :data="singerList" @select="selectSinger" ref="list"></list>
    <router-view></router-view>
  </div>
</template>

<script>
import {getSingerList} from 'api/singer'
import Singer from 'common/js/singer'
import List from 'base/list/list'
import {mapMutations} from 'vuex' //vuex是对mutataions的封装
import {playlistMinxin} from 'common/js/mixin'
const HOT_NAME="热门";
const HOT_SINGER_LEN=10;
export default {
  name: 'motuosinger',
  mixins:[playlistMinxin],
  data () {
    return {
      singerList: []
    }
  },
  created(){
  	this._getSingerList();
  },
  methods:{
    handlePlaylist(playlist){
      const bottom=playlist.length>0?'3rem':'';
      this.$refs.singer.style.bottom=bottom;
      // this.$refs.singer.refresh();
      this.$refs.list.refresh();
    },
    selectSinger(Singer){
      this.$router.push({
        path:`/singer/${Singer.id}`
      });
      this.setSinger(Singer);
      //就相当于store.commit('SET_SINGER',Singer)
      //看最后的函数中的setSinger,其实this.setSinger就是SET_SINGER
    },
  	_getSingerList(){
  		getSingerList().then((res)=>{
  			// this.singerList=res.data.list;
  			this.singerList=this._normalizeSinger(res.data.list)
  		}).catch(e=>{
  			console.log(e);
  		});
  	},
  	_normalizeSinger(list){
  		let map={
  			hot:{
  				title:HOT_NAME,
  				items:[]
  			}
  		}
  		list.forEach((item,index)=>{
  			if(index<HOT_SINGER_LEN){
  				map.hot.items.push(new Singer({
  					id:item.Fsinger_mid,//歌手MID
  					name:item.Fsinger_name//歌手名字
  				}));
  			};
  			const key = item.Findex;
  			if(!map[key]){
  				//如果没有这个key
  				map[key]={
  					title:key,
  					items:[]
  				}
  			}
  			map[key].items.push(new Singer({
				id:item.Fsinger_mid,//歌手MID
				name:item.Fsinger_name//歌手名字
			}));

  		})
  		//按照首字母进行排序(热门要单独列出来)
  		let hot=[];
  		let ret=[];
  		for(let key in map){
  			let val = map[key];
  			if(val.title.match(/[a-zA-Z]/)){
  				ret.push(val);
  			}else if(val.title === HOT_NAME){
  				hot.push(val);
  			}
  		};
  		//排序
  		ret.sort((a,b)=>{
  			return a.title.toUpperCase().charCodeAt(0)-b.title.toUpperCase().charCodeAt(0);
  		})
  		//将hot和ret拼接，并返回
  		return hot.concat(ret);
  	},
    ...mapMutations({
      setSinger:'SET_SINGER'
    })
  },
  components:{List}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#motuo-singer{
	position: fixed;
	top:3.3rem;
	bottom: 0rem;
	width: 100%;
  z-index: 100;
}

</style>