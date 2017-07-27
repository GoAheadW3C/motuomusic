<template>
  <div id="motuo-nav">
  		<div class="nav-item-link" :class="{'active':lightfont.recommend}" @click.stop="changelight('recommend')"><span :class="{'activespan':lightfont.recommend}">首页</span></div>
  		<div class="nav-item-link" :class="{'active':lightfont.singer}" @click.stop="changelight('singer')"><span :class="{'activespan':lightfont.singer}">歌手</span></div>
  		<div class="nav-item-link" :class="{'active':lightfont.rank}" @click.stop="changelight('rank')"><span :class="{'activespan':lightfont.rank}">排行</span></div>
  		<div class="nav-item-link" :class="{'active':lightfont.my}" @click.stop="changelight('my')"><span :class="{'activespan':lightfont.my}">我的</span></div>
  </div>
</template>

<script>
import GetPath from 'common/js/getPath'
import {mapMutations} from 'vuex'
import {toggleStorage,STORAGE_SONGS_LIST} from 'common/js/localStorage'
export default {
  name: 'motuonav',
  data () {
    return {
      lightfont: {
      	recommend:true,
      	singer:false,
      	rank:false,
      	my:false
      }
    }
  },
  created(){
    // console.log(GetPath());
    // this.changelight(GetPath());
    if(GetPath().main==GetPath().whole){
        this.changelight(GetPath().main);
      }
  },
  updated(){
    window.addEventListener('hashchange',()=>{
      
      if(GetPath().main==GetPath().whole){
        this.changelight(GetPath().main);
      }
      
    });
  },
  methods:{
  	changelight(target){
  		for(var attr in this.lightfont){
  			this.lightfont[attr]=false;
  		}
  		this.lightfont[target]=true;
      this.$router.push('/'+target);
  	},
    ...mapMutations({
      setCollection:'SET_COLLECTION'
    })
  },
  computed:{
    getThisPath(){
       return this.$store.getters.thisPath;
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#motuo-nav{
	height: 1.5rem;
	background-color: #222222;
	color: white;
	display: flex;
}
.nav-item-link{
	flex: 1;
	float: left;
	text-align: center;
  color:#c0c0c0;
  font-size:.6rem;
  line-height: 1.5rem;
}
.active{
	color:gold;
	font-weight: bold;
}
.activespan{
  border-bottom: 1px solid gold;
}
</style>