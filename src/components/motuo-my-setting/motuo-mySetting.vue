<template>
  <div class="motuo-mySetting">
  	<div class="localSetting">
  		<i class="icon iconfont icon-shezhi icon-play"></i>
  		<span class="text">本地设置</span>
  	</div>
  	<ul class="settingList">
  		<!-- <li class="settingItem">
  			<i class="icon iconfont icon-portal-icon-huanfu"></i>
  			<span class="title">换肤设置</span>
  			<i class="icon iconfont icon-you right"></i>
  		</li>
  		<li class="settingItem">
  			<i class="icon iconfont icon-yejianmoshi"></i>
  			<span class="title">夜间模式</span>
  			<i v-if="true" class="icon iconfont icon-kaiguan111 right onOff"></i>
  			<i v-if="false" class="icon iconfont icon-kaiguan11 right onOff"></i>
  		</li> -->
  		<li class="settingItem" @click.stop="setTimeClose">
  			<i class="icon iconfont icon-dingshiguanji-"></i>
  			<span class="title">定时关闭</span>
  			<i class="icon iconfont icon-you right"></i>
  		</li>
  		<!-- <li class="settingItem">
  			<i class="icon iconfont icon-icon-test4"></i>
  			<span class="title">音乐闹钟</span>
  			<i class="icon iconfont icon-you right"></i>
  		</li> -->
  		<li class="settingItem" @click.stop="drive">
  			<i class="icon iconfont icon-zhinengjiashi"></i>
  			<span class="title">驾驶模式</span>
  			<i class="icon iconfont icon-you right"></i>
  		</li>
  		<li class="settingItem" @click.stop="about">
  			<i class="icon iconfont icon-guanyu"></i>
  			<span class="title">关于</span>
  			<i class="icon iconfont icon-you right"></i>
  		</li>
  		<li class="settingItem" @click.stop="showClear">
  			<i class="icon iconfont icon-qingchu"></i>
  			<span class="title">清除内容</span>
  			<i class="icon iconfont icon-you right"></i>
  		</li>
  	</ul>
  	<!-- <div class="reser-wrapper">
  		<span class="reset">恢复默认</span>
  	</div> -->
  	
  </div>
</template>

<script>
import {mapMutations} from 'vuex'
export default {
  name: 'mysetting',
  created(){
  	
  },
  methods:{
  	showClear(){
		this.setModalVal({
			isShow:true,
			data:'clear'
		});
  	},
  	about(){
  		this.setModalVal({
			isShow:true,
			data:'about'
		});
  	},
  	setTimeClose(){
  		this.setModalVal({
			isShow:true,
			data:'timeClose'
		});
  	},
  	drive(){
  		this.setModalVal({
			isShow:true,
			data:'drive'
		});
  	},
  	...mapMutations({
      setModalVal:'SET_MODAL_VAL'
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.localSetting{
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
.localSetting .icon-play{
	display: inline-block;
	vertical-align: middle;
	margin-right: .3rem;
	font-size: .7rem;
	vertical-align: middle;
}
.localSetting .text{
	display: inline-block;
	vertical-align: middle;
	font-size: .6rem;
}
.settingList{
	width: 100%;
	color: white;
	/*background: red;*/
	margin-top: .5rem;
}
.settingList .settingItem{
	width: 100%;
	height: 1.2rem;
	margin-top: .2rem;
	/*background: red;*/
}
.settingList .settingItem .icon{
	line-height: 1.2rem;
	float: left;
	font-size: .6rem;
}
.settingList .settingItem .title{
	line-height: 1.2rem;
	float: left;
	margin-left: .2rem;
	font-size: .7rem;
}
.settingList .settingItem .right{
	line-height: 1.2rem;
	float: right;
	margin-left: .2rem;
	font-size: .6rem;
	color: rgba(255,255,255,.5);
}
.onOff{
	font-size: 1.5rem!important;
	color: gold!important;
}
.reser-wrapper{
	width: 100%;
	/*background: blue;*/
	text-align: center;
	margin: .5rem 0;
}
.reset{
	display: inline-block;
	width: 12rem;
	height: 1.2rem;
	background: rgba(212,59,51,1);
	color: white;
	text-align: center;
	line-height: 1.2rem;
	font-size: .6rem;
	border-radius: .2rem;
}
</style>