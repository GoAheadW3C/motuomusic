<template>
  <div id="motuoHeader">
  	<div class="header-wrapper">
  		<div class="leftContent" ref="logo">
        <i class="icon iconfont icon-yinle3 leftIcon" ref="logoIcon"></i><span class="title" v-show="titleshow">METOK</span>  
      </div>
      <div class="search" ref="searchBar">
        <i class="icon iconfont icon-bofang iconSearch"></i>
        <div type="text" placeholder="搜索歌曲、歌手、专辑" class="searchText" @click.stop="gotoSearch">搜索歌曲、歌手、专辑</div>
      </div>
      <i class="icon iconfont icon-chaxun rightIcon" @click="searchShow"></i>
	  </div>
  </div>
</template>

<script>
// import { Header as H } from 'mint-ui'; 


export default {
  name: 'motuoheader',
  data () {
    return {
      titleshow: true,
      searchonOff:false,
      timer:null
    }
  },
  destoryed(){
    clearTimeout(this.timer);
  },
  methods:{
    searchShow(){
      this.searchonOff=!this.searchonOff;
      if(this.searchonOff){
        this.timer=setTimeout(()=>{
          this.searchonOff=false;
        },8000);
      }
    },
    searchBarOpen(){
      this.$refs.searchBar.style.display='block';
      this.titleshow=false;
      this.$refs.logo.style.opacity=0;
      this.$refs.logo.style.width='3rem';
      this.$refs.logo.style.transition=".3s width linear";
        this.$refs.logo.style.opacity=1;
        this.$refs.logo.style.transition=".3s opacity linear";

      this.$refs.searchBar.style.opacity=1;
      this.$refs.searchBar.style.transition=".3s linear";
    },
    searchBarClose(){
      this.$refs.logo.style.opacity=0;
      this.$refs.logo.style.width='16rem';
      this.titleshow=true;

      this.$refs.searchBar.style.opacity=0;
      this.$refs.searchBar.style.transition=".02s linear";


      setTimeout(()=>{
        this.$refs.searchBar.style.display='none';
        this.$refs.logo.style.opacity=1;
        this.$refs.logo.style.transition=".3s opacity linear";
      },20)
    },
    gotoSearch(){
      this.searchonOff=false;
      this.$router.push('/search');
    }
  },
  watch:{
    searchonOff(newVal){
      if(newVal){
        this.searchBarOpen();
      }else{
        clearTimeout(this.timer);
        this.searchBarClose();
      }
    }
  }
  // components:{H}
}
</script>


<style scoped>

#motuoHeader{
  height: 1.8rem;
  /*background: red;*/
  position: fixed;
  background: #222222;
}

.icon{
	color:rgba(254,201,1,1);
	font-size: 1rem;
	font-weight: bolder;
}
.leftContent{
  width: 16rem;
  height: 1.8rem;
  /*background: red;*/
  text-align: center;
}
.leftIcon{
  width: 1.2rem;
  height: 1.8rem;
  overflow: hidden;
  line-height: 1.8rem;
}
.title{
  line-height: 1.8rem;
  font-size: .8rem;
  color: white;
  /*display: none;*/
}
.rightIcon{
  position: absolute;
  top: 0rem;
  right: .7rem;
  width: 1.2rem;
  height: 1.8rem;
  overflow: hidden;
  line-height: 1.8rem;
}
.search{
  /*background: blue;*/
  width: 100%;
  height:1.8rem;
  position: absolute;
  left: 0;
  top:0;
  opacity: 0;
  display: none;
}
.searchText{
  width: 10rem;
  height: 1rem;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -5rem;
  margin-top: -.5rem;
  border-radius: .2rem;
  text-indent: 1.2rem;
  line-height: 1rem;
  font-size: .6rem;
  background: white;
  color: black;
}
.iconSearch{
  position: absolute;
  z-index: 100;
  left: 3.3rem;
  top: 50%;
  width: .6rem;
  height: .6rem;
  margin-top: -.3rem;
  font-size: .6rem;
}
</style>