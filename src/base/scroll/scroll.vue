<template>
	<div ref="wrapper">
		<slot></slot>
	</div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  props:{
  	probeType:{
  		type:Number,
  		default:1
  	},
  	click:{
  		type:Boolean,
  		default:true
  	},
  	data:{
  		type:Array,
  		default:null
  	},
  	//用于是否监听滚动事件
  	listenScroll:{
  		type:Boolean,
  		default:false
  	}
  },
  mounted(){
  	//要确保DOM渲染，所以要延迟20ms

  	setTimeout(()=>{
      // console.log(this.data,'e');
  		this._initScroll();
  	},20);
  },
  methods:{
  	//滚动初始化
  	_initScroll(){
  		if(!this.$refs.wrapper){
  			return;
  		}
  		this.scroll=new BScroll(this.$refs.wrapper,{
  			probeType:this.probeType,
  			click:this.click,
        scrollY:true,
        momentum:true,
        snapThreshold:.1
  		});
  		
  		if(this.listenScroll){
  			let me=this;
  			this.scroll.on('scroll',(pos)=>{
          //这里的pos就是滚动的距离，是一个对象，{x:...,y:...}分别表示x方向滚动了多少，y方向滚动了多少
  				me.$emit('scroll',pos)
  			})
  		}
  	},
  	enable(){
  		this.scroll&&this.scroll.enable();
  	},
  	disable(){
  		this.scroll&&this.scroll.disable();
  	},
  	refresh(){
  		//刷新，重新获取
  		 this.scroll&&this.scroll.refresh();
       // console.log('我已经refresh了')
  	},
  	//滚动到
  	scrollTo(){
  		this.scroll&&this.scrollTo.apply(this.scroll,arguments);
  	},
  	scrollToElement(){
  		this.scroll&&this.scroll.scrollToElement.apply(this.scroll,arguments);
  	}
  },
  watch:{
  	data(){
  		setTimeout(()=>{
        // console.log(this.data,'watch');
  			this.refresh();
  		},20);
  	}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>


</style>