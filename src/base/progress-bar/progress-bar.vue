<template>
	<!-- 总长度 -->
	<div class="progress-bar">
		<div class="bar-inner" ref="barInner">
			<!-- 走过的长度,进度改变，即改变progress的宽度 -->
			<div class="progress" ref="progressNow">
				<!-- 按钮-当前位置 -->
				<div class="progress-btn-wrapper" @touchstart.prevent="dragStart" @touchmove.prevent="dragMove" @touchend.prevent="dragUp">
					<div class="progress-btn"></div>
				</div>
			</div>
			
		</div>
	</div>
</template>

<script>
export default {
  name: 'progressBar',
  props:{
  	percent:{
  		type:Number,
  		default:0
  	}
  },
  data(){
  	return{
  		dragX:0,
  		dragDis:0,
  		NowPercent:0,
  		isTouch:false
  	}
  },
  methods:{
  	dragStart(e){
  		this.isTouch=true;
  		this.dragX=e.changedTouches[0].pageX;
  	},
  	dragMove(e){
  		if(!this.isTouch){
  			return;
  		}
  		this.dragDis=e.changedTouches[0].pageX-this.dragX;
  		this.dragX=this.dragX+this.dragDis;
  		this.NowPercent=(this.dragX-this.$refs.barInner.getBoundingClientRect().left)/this.$refs.barInner.getBoundingClientRect().width*100;
  		if(this.NowPercent<0){
  			this.NowPercent=0;
  		}else if(this.NowPercent>100){
  			this.NowPercent=100;
  		}
  		this.$emit('changePercent',this.NowPercent);
  	},
  	dragUp(){
  		this.isTouch=false;
  		// this.$emit('finalPercent',this.NowPercent);
  	}
  },
  watch:{
  	percent(newVal){
  		
  		if(newVal<0){
  			newVal=0;
  		}
  		this.$refs.progressNow.style.width=newVal+'%';
  	},
  	dragX(){
  		// this.$refs.progressNow.style.width=newVal+'%';
  	}
  }
}
</script>


<style scoped>
.progress-bar{
	width: 9rem;
	height: .2rem;
	margin:0 .8rem;
	border-radius: 2rem;
	background-color: rgba(0,0,0,.3);
	/*overflow: hidden;*/
	position: relative;
	/*background:red;*/
}
.bar-inner{
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	border-radius: 2rem;
	/*background-color: blue;*/
}
.progress{
	position: absolute;
	left: 0;
	top: 0;
	width: 0%;
	border-radius: 2rem;
	height: 100%;
	background-color:gold;
}
.progress-btn-wrapper{
	position: absolute;
	right: -.4rem;
	top: -.3rem;
	width: .8rem;
	height: .8rem;
	border-radius: 50%;
	background-color: white;
}
.progress-btn{
	position: absolute;
	left: 50%;
	top: 50%;
	margin-left: -.25rem;
	margin-top: -.25rem;
	width: .5rem;
	height: .5rem;
	border-radius: 50%;
	background-color: gold;
}
</style>