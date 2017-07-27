<template>
  <scroll 
  class="listview" 
  :data="data" 
  ref="listview"
  :listenScroll='listenScroll'
  @scroll="scroll"
  :probeType="probeType">
  	<ul>
  		<li v-for="group in data" class="list-group" ref="listGroup">
  			<h2 class="list-group-title">{{group.title}}</h2>
  			<ul>
  				<li @click.stop="selectedItem(item)" v-for="item in group.items" class="list-group-item">
  					<img v-lazy="item.avator" class="avator">
  					<span class="name">{{item.name}}</span>
  				</li>
  			</ul>
  		</li>
  	</ul>
  	<div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove" >
  		<ul>
  			<li v-for="(item,index) in shortcutList" class="item" :data-index="index" :class="{current:currentIndex==index}">{{item}}</li>
  		</ul>
  	</div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import {getData} from 'common/js/dom'

const ANCHOR_HEIGHT=18;

export default {
  name: 'List',
  created(){
  	this.touch={};
  	this.listenScroll=true;
  	this.listHeight=[];
  	this.probeType=3;
  },
  data(){
  	return {
  		scrollY:-1,//用来记录滚动的y轴方向的距离
  		currentIndex:0,//表示当前显示的是哪个li
      offset:-1
  	}
  },
  props:{
  	data:{
  		type:Array,
  		default:[]
  	}
  },
  methods:{
  	onShortcutTouchStart(e){
  		let anchorIndex=getData(e.target,'index');
      // this.currentIndex=anchorIndex;
  		let firstTouch=e.touches[0];
  		this.touch.y1=firstTouch.pageY;
  		this.touch.anchorIndex=anchorIndex;
  		// this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex],0);
      this._scrollTo(anchorIndex);
  	},
  	onShortcutTouchMove(e){
  		let firstTouch = e.touches[0];
  		this.touch.y2=firstTouch.pageY;
  		let delta=(this.touch.y2-this.touch.y1)/ANCHOR_HEIGHT | 0;
  		let anchorIndex=parseInt(this.touch.anchorIndex)+delta;
      // this.currentIndex=anchorIndex;
  		// this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex],0);
      this._scrollTo(anchorIndex);
  	},
    refresh(){
      this.$refs.listview.refresh();
    },
  	scroll(pos){
  		this.scrollY=pos.y;//通过scroll组件传递过来的scroll事件，将接受的pos中的y方向滚动的距离传递给this.scrollY

  	},
    selectedItem(item){
      // console.log('emit')
      this.$emit('select',item);
    },
    _scrollTo(index){//右侧滑到某个去酷开
      if(index===null){
        return;
      }
      if(index<0){
        index=0;
      }else if(index>this.listHeight.length-2){
        index=this.listHeight.length-2;
      }
      // console.log(index);
      this.currentIndex=index;
      // console.log(this.currentIndex);
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index],0);
    },
  	_calculateHeight(){//计算左侧列表每个字母所对应的group的高度，并存到数组中
  		this.listHeight=[];
  		const list=this.$refs.listGroup;
  		let height = 0;
  		this.listHeight.push(height);
  		for(let i=0;i<list.length;i++){
  			let item = list[i];
  			height+=item.clientHeight;//注意：这个是+=，也就是说，比如第三个group的高度，其实是前面三个之和
  			this.listHeight.push(height);
  		}
  	}
  },
  watch:{
  	data(){
  		setTimeout(()=>{
  			this._calculateHeight();
  		},20)
  	},
  	scrollY(newY){
      //newY:滚动的举例
      // 当滚动到顶部，newY>0
      if(newY>0){
        this.currentIndex=0;
        return;
      }
      //在中间部分滚动
  		const listHeight=this.listHeight;
  		for(let i=0;i<listHeight.length-1;i++){
  			let height1=listHeight[i];
  			let height2=listHeight[i+1];
  			if(((-newY)>=height1&& (-newY)<height2)){
  				this.currentIndex=i;
          this.offset=height2-(-newY);
  				return;
  			}
  		}
      //当滚动到底部，且-newY大于最后一个元素的上限
  		this.currentIndex=listHeight.length-2;//
      //为什么要-2，首先 所以比长度小1，又因为listHeight.length比真正的长度多一个，可以打印出来看一下
  	}
  },
  computed:{
  	shortcutList(){
  		return this.data.map((item)=>{
  			return item.title.substr(0,1);
  		})
  	},
    fixedTitle(){
      if(this.scrollY>0){
        return '';
      }
      return this.data[this.currentIndex]?this.data[this.currentIndex].title:'';
    }
  },
  components:{Scroll}
}
</script>

<style scoped>
ul{
	list-style-type: none;
	padding: 0;
	margin:0;
}
.listview{
	position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #222222;
}
 .list-group{
 	padding-bottom: 30px;
 }
.list-group-title{
    height: 1.5rem;
    line-height: 1.5rem;
    padding-left: 1rem;
    font-size: .6rem;
    color: rgba(117,117,117,1);
    background: rgba(51,51,51,1);
}
.list-group-item{
	display: flex;
    align-items: center;
    padding: 1rem 0 0 1.5rem;
}
.avator{
	width: 1.8rem;
    height: 1.8rem;
    border-radius: 50%;
}
.name{
	margin-left: 1rem;
    color: rgba(136,136,136,1);
    font-size: .6rem;
}          
 .list-shortcut{
 	position: absolute;
	z-index: 30;
	right: 0;
	top: 50%;
	transform: translateY(-50%);
	width: 1rem;
	padding: .5rem 0;
	border-radius: .5rem;
	text-align: center;
	background: rgba(24,24,24,1);
	font-family: 'Helvetica';
 }
 .item{
 	padding: 3px;
	line-height: 1;
	color: rgba(123,123,123,1);
	font-size: 12px;
 }
.current{
	color: gold;
}    
/*.title-fixed{
    width: 100%;
    height: 1.5rem;
    line-height: 1.5rem;
    padding-left: 1rem;
    font-size: .6rem;
    color: rgba(117,117,117,1);
    background: rgba(51,51,51,1);
    position: fixed;
    top: 3.3rem;
    z-index: 99;
}   */      
</style>