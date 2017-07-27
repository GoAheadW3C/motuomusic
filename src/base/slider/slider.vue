<template>
  <div class="slider" ref="slider">
  	<div class="slider-group" ref="sliderGroup">
  		<slot></slot>
  	</div>
  	<div class="dots">
  		<span class="dot" v-for="(item,index) in dots" :class="{active:currentPageIndex==index}"></span>
  	</div>
  </div>
</template>

<script>

import BScroll from 'better-scroll'
import {addClass} from 'common/js/dom'

export default {
  name: 'Slider',
  props:{
  	loop:{
  		type:Boolean,
  		default:true
  	},
  	autoPlay:{
  		type:Boolean,
  		default:true
  	},
  	interval:{
  		type:Number,
  		default:4000
  	}
  },
  data () {
    return {
      dots: [],
      currentPageIndex:0
    }
  },
  mounted(){
    this._setSliderWidth();
  	setTimeout(()=>{
  		// this._setSliderWidth();
  		this._initDots();
  		this._initSlider();

  		if(this.autoPlay){
  			this._play();
  		}
  	},20);

  	window.addEventListener('resize',()=>{
      // console.log(1);
  		if(!this.slider){
  			return;
  		}
  		this._setSliderWidth(true);
  		this.slider.refresh();
  	})

  },
  destroyed(){
  	clearTimeout(this.timer);
  },
  methods:{
  	_setSliderWidth(isResize){
  		//获取有多少个子元素
  		//this.$refs.sliderGroup相当于document.querySelector(".sliderGroup")获取这个dom节点
  		//所以获得它的子元素就是this.$refs.sliderGroup.children相当于document.querySelector(".sliderGroup").children

  		this.children=this.$refs.sliderGroup.children;
  		let width=0;
  		let sliderWidth=this.$refs.slider.clientWidth;
  		for(let i=0;i<this.children.length;i++){
  			let child=this.children[i];
  			addClass(child,'slider-item');
  			child.style.width=sliderWidth+'px';
  			width+=sliderWidth;
  		}

  		if(this.loop&&!isResize){
  			width+=2*sliderWidth;
  		}
  		this.$refs.sliderGroup.style.width=width+'px';
  		// console.log(width);

  	},
  	_initDots(){
      //让这个dots数组的长度为this.children的长度
  		this.dots=new Array(this.children.length);
  	},
  	_initSlider(){
  		this.slider=new BScroll(this.$refs.slider,{
  			scrollX:true,
  			scrollY:false,
  			momentum:false,//惯性
  			snap:true,//该属性是给 slider 组件使用的，普通的列表滚动不需要配置
  			snapLoop:this.loop,//是否可以无缝循环轮播
  			snapThreshold:.3,//用手指滑动时页面可切换的阈值，大于这个阈值可以滑动的下一页
  			snapSpeed:400//轮播图切换的动画时间
  		});

  		this.slider.on('scrollEnd',()=>{
  			let pageIndex=this.slider.getCurrentPage().pageX;
  			if(this.loop){
  				pageIndex-=1;
  			}
  			this.currentPageIndex=pageIndex;

  			if(this.autoPlay){
  				clearTimeout(this.timer);
  				this._play();
  			}
  		})
  	},
  	_play(){
  		let pageIndex=this.currentPageIndex+1;
  		if(this.loop){
  			pageIndex+=1;
  		}
  		this.timer=setTimeout(()=>{
  			this.slider.goToPage(pageIndex,0,400);
  		},this.interval)
  	}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.slider{
  width: 100%;
	min-height: 1px;
}
.slider .slider-group{
	position: relative;
  	overflow: hidden;
  	white-space: nowrap;
}
.slider .slider-group .slider-item{
	float: left;
    box-sizing: border-box;
    overflow: hidden;
    text-align: center;
}
.slider .slider-group .slider-item a{
  display: block;
  width: 100%;
  overflow: hidden;
  text-decoration: none;
 }
.slider .slider-group .slider-item img{
  display: block;
  width: 100%;
}
.dots{
  position: absolute;
  right: 0;
  left: 0;
  bottom: 12px;
  text-align: center;
  font-size: 0;
}
.dots .dot{
  display: inline-block;
  margin: 0 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(240,240,240,.6);
}
.dots .dot.active{
	width: 20px;
    border-radius: 5px;
    background: rgba(254,201,1,1);
}
        




/*<div class="slider" ref="slider">
	<div class="slider-group" ref="sliderGroup">
		<slot>
			
		</slot>
	</div>
	<div class="dots">
		
	</div>
</div>*/
</style> 