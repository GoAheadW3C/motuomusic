<template>
  <div id="motuo-hotlistdetail">
  	<transition name="slide">
      <songlist
		:songs='songs'
		:bgimage="bgImage"
		:title="title"
      ></songlist>
  </transition>
  </div>
</template>

<script>
import Songlist from '@/components/motuo-songlist/motuo-songlist'
import {getHotlistDetail} from 'api/hotlist'
import {ERR_OK} from 'api/config'
import {mapGetters} from 'vuex'
import {createSong} from 'common/js/song'
export default {
  name: 'yuhua',
  data(){
  	return {
  		songs:[]
  	}
  },
  mounted(){
  	this._getHotlistDetail();//获取歌曲列表
  },
  methods:{
  	_getHotlistDetail(){
  		if (!this.hotitem.id) {
	      this.$router.push('/rank');
	      return;
	    }
	  	getHotlistDetail(this.hotitem.id).then(res=>{
	  		if(res.code==ERR_OK){
	  			this.songs=this._normalizeSongs(res.songlist);
	  		}else{
	  			this.songs=[];
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
	}
  },
  computed:{
	title() {
		return this.hotitem.topTitle;
	},
	bgImage() {
		if (this.songs.length) {
			return this.songs[0].image;
		}
		return '';
	},
  	...mapGetters([
  		'hotitem'
  	])
  },
  components:{Songlist}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#motuo-hotlistdetail{
	position: fixed;
	top: 0;
	bottom: 0;
	width: 100%;
	background: red;
	z-index: 1002;
}

</style>