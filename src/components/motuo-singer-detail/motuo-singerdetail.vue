<template>
  <transition name="slide">
      <songlist
      :songs='songs'
      :title='title'
      :bgimage='bgimage'></songlist>
  </transition>
</template>

<script>
import Songlist from '@/components/motuo-songlist/motuo-songlist'
import {mapGetters} from 'vuex'
import {getSingerDetail} from 'api/singer'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'

export default {
  name: 'singerdetail',
  data(){
    return {
      songs:[]
    }
  },
  created(){
    // console.log('crested');
  	this._getSingerDetail();
  },
  methods:{
  	_getSingerDetail(){
  		getSingerDetail(this.singer.id).then(res=>{
  			// console.log(res);
  			if(res.code==ERR_OK){
  				this.songs=this._normalizeSongs(res.data.list);
          // console.log(this.songs,'this.songs');
  			}
  		});
  	},
    _normalizeSongs(list){
      let ret=[];
      list.forEach((item)=>{
        let {musicData}=item;
        if(musicData.songid&&musicData.albummid){
          ret.push(createSong(musicData));
        }
      });
      return ret;
    }
  },
  computed:{
    title(){
      // console.log(this.singer);
      return this.singer.name;
    },
    bgimage(){
      return this.singer.avator;
    },
  	...mapGetters([
  			'singer'
  		])
  },
  components:{Songlist}
}
</script>


<style>

.slide-enter-active,.slide-leave-active{
	transition:all .3s;
}
.slide-enter,.slide-leave-to{
	transform:translate3d(100%,0,0);
}
</style>