<template>
	<div class="player" v-show="playlist.length>0">
		<transition name="normal"
			@enter="enter"
			@after-enter="afterEnter"
			@leave="leave"
			@after-leave="afterLeave"
		>
			<div class="normal-player" v-show="fullScreen">
				<div class="background">
		          <img width="100%" height="100%" :src="currentSong.image">
		    </div>
            <div class="topline" refs="topline"></div>
		        <div class="top">
		          <div class="back" @click="goback">
		            <i class="icon iconfont icon-mp-return icon-back"></i>
		          </div>
		          <h1 class="title" v-html="currentSong.name"></h1>
		          <h2 class="subtitle" v-html="currentSong.singer"></h2>
		        </div>
		        <div class="middle" 
			        @touchstart.prevent="middleTouchStart"
			        @touchmove.prevent="middleTouchMove"
			        @touchend.prevent="middleTouchEnd"
		        >
		          <div class="middle-l" ref="middleCd">
		            <div class="cd-wrapper" ref="cdWrapper">
		              <div class="cd" :class="cdRotate">
		                <img class="image" :src="currentSong.image">
		              </div>
		            </div>
		            <div class="playing-lyric-wrapper">
		              <div class="playing-lyric">{{playingLyric}}</div>
		            </div>
		          </div>
		          <!-- <div  style="height:.5rem;background:red;"></div> -->
		          <scroll class="middle-r" ref="lyricList" :data="currentLyric&&currentLyric.lines">
		            <div class="lyric-wrapper">
		              <div v-if="currentLyric">
		                <p ref="lyricLine"
		                   class="text"
		                   :class="{'current':currentLineNum==index}"
		                   v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
		              </div>
		            </div>
		          </scroll>
		        </div>
		        <div class="bottom">
		          <div class="dot-wrapper">
		            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
		            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
		          </div>
		          <div class="progress-wrapper">
		            <span class="time time-l" v-show="formateTime(currentTime).length==5">{{formateTime(currentTime)}}</span>
		            <div class="progress-bar-wrapper">
		              <!-- <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar> -->
		              <progress-bar :percent="percent" @changePercent="changePercent"></progress-bar>
		            </div>
		            <span class="time time-r" v-show="formateTime(currentTime).length==5">{{formateTime(parseInt(currentSong.duration))}}</span>
		          </div>
		          <div class="operators">
		            <div class="icon i-left">
		              <i @click="changeMode" class="icon iconfont modeicon" :class="'icon-'+Modeicon"></i>
		            </div>
		            <div class="icon i-left">
		            	<i @click.stop="prev" class="icon iconfont icon-icon-test "></i>
		              <!-- <i @click="prev" class="icon-prev"></i> -->
		            </div>
		            <div class="icon i-center">
		            	<!-- <i class="icon iconfont icon-zantingtingzhi"></i> -->
		            	<i @click="toggolePlaying" class="icon iconfont" :class="'icon-'+toggleplaybtn"></i>
		              <!-- <i @click="togglePlaying" :class="playIcon"></i> -->
		            </div>
		            <div class="icon i-right">
		            	<i @click.stop="next" class="icon iconfont icon-icon-test3 icon-next"></i>
		              <!-- <i @click="next" class="icon-next"></i> -->
		            </div>
		            <div class="icon i-right">
                <!-- 收藏收藏收藏收藏收藏收藏收藏 -->
                  <i v-if="!isCollection" class="icon iconfont icon-icon21" style="font-size:1.2rem;" @click="toggleSelection"></i>
		            	<i v-if="isCollection" class="icon iconfont icon-shoucang" style="color:red;font-size:1.2rem;" @click="toggleSelection"></i>
		            </div>
		          </div>
		        </div>
			</div>
		</transition>
		<transition name="mini">
			<div class="mini-player" v-show="!fullScreen" @click="toFull">
				<div class="icon">
		          <img width="40" height="40" :src="currentSong.image"  :class="cdRotate">
		        </div>
		        <div class="text">
		          <h2 class="name" v-html="currentSong.name"></h2>
		          <p class="desc" v-html="currentSong.singer"></p>
		        </div>
		        <div class="control">
		          <!-- <progress-circle :radius="radius" :percent="percent">
		            <i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i>
		          </progress-circle> -->
		          <!-- <progress-circle class="icon-mini"></progress-circle> -->
		          <i @click.stop="toggolePlaying" class="icon iconfont icon-mini" :class="'icon-'+toggleplaybtnMini"></i>
		          
		        </div>
		        <div class="control">
		        	<i class="icon iconfont icon-playlist" @click.stop="showPlaylist"></i>
		          <!-- <i class="icon-playlist"></i> -->
		        </div>
			</div>
		</transition>
		<audio ref="audio" :src="currentSong.url" @play="ready" @error="error" @timeupdate="updateTime" @ended="ended"></audio>
		<!-- 
			src发生改变的时候，play()
		 -->
	</div>
</template>

<script>

import {mapGetters,mapMutations} from 'vuex'
import animations from 'create-keyframe-animation'
import progressBar from 'base/progress-bar/progress-bar'
import progressCircle from 'base/progress-circle/progress-circle'
import shuffle from 'common/js/shuffle'
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/scroll'
import {toggleStorage,STORAGE_SONGS_LIST,STORAGE_RECORD_LIST} from 'common/js/localStorage'

const MAX_RECORDS_COUNT=30;//控制播放记录条数最多存储30条

export default {
  name: 'player',
  props:{
    setTimeClose:{
      type:Boolean,
      default:false
    }
  },
  data(){
  	return{
  		readyPlay:false,
  		currentTime:0,
  		percent:0,
  		currentLineNum:0,
  		currentLyric:[],
  		currentShow:'cd',
  		playingLyric:'',
      isCollection:false,
      isShowPlaylist:false,
      moveDir:'x',
      timer:null
  	}
  },
  created(){
  	this.touch={};
  },
  mounted(){
  	// console.log(this.playlist,'this.playlist')
  	
  },
  methods:{
    showPlaylist(){
      this.isShowPlaylist=!this.isShowPlaylist;
      this.$emit('toShowPlaylist',this.isShowPlaylist);
    },
    //关于播放记录
    //设置播放记录
    //逻辑：
      //获取本地存储的列表，判断是否为null
        //如果为null，直接存入
        //如果不是null，遍历列表，看当前歌曲是否在列表里面
          //如果不在，则unshift到列表中
          //如果再，则删除这个项，并unshift到列表中
    setPlayRecord(){
// console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
      let storage_record_list=toggleStorage(STORAGE_RECORD_LIST);
      
      if(storage_record_list==null){
        // console.log(1);
        toggleStorage(STORAGE_RECORD_LIST,[this.currentSong]);
      }else{
        // console.log(2);
        let isRecord=false;
        let indexNum=-1;
        storage_record_list.forEach((item,index)=>{
          if(item.id==this.currentSong.id){
            isRecord=true;
            indexNum=index;
          }
        });
        if(isRecord){
          storage_record_list.splice(indexNum,1);
        }

        storage_record_list.unshift(this.currentSong);
        //控制条数最多30条
        if(storage_record_list.length>MAX_RECORDS_COUNT){
          storage_record_list.length=MAX_RECORDS_COUNT;
        }
        toggleStorage(STORAGE_RECORD_LIST,storage_record_list);
      }
    },
    //关于收藏
    //开始播放，判断是否已经收藏，若已经收藏，则设置isCollection为true，没收藏，设置为false
    isStartCollection(){
      //取出本地存储的列表，循环遍历是否已经收藏
      let storage_songs_list=toggleStorage(STORAGE_SONGS_LIST);
      if(storage_songs_list==null){
        this.isCollection=false;
        
      }else{
        let isStorage=false;
        storage_songs_list.forEach(item=>{
          if(item.id==this.currentSong.id){
            this.isCollection=true;
            isStorage=true;
          }
        })
        if(!isStorage){
          this.isCollection=false;
        }
        
      }
    },
    //关于收藏
    //点击收藏按钮时，判断！
    //判断歌曲是否收藏，一开始放歌曲的时候判断
    isRightCollection(){
      //取出本地存储的列表，循环遍历是否已经收藏
      let storage_songs_list=toggleStorage(STORAGE_SONGS_LIST);


      if(storage_songs_list===null){
        //没有这个列表，如果isCollection为真，则存储
        if(this.isCollection){
            toggleStorage(STORAGE_SONGS_LIST,[this.currentSong]);
        }
      }else{
        //有存储这个列表，所以需要判断这个列表中是否有这首歌
        let isStorage=false;
        let indexNum=-1;
        storage_songs_list.forEach((item,index)=>{
            if(item.id==this.currentSong.id){
              //已经存在localstorage了,要判断isCollection的真假，如果为真，则不做任何事，如果为假，则删除，并且设置this.isCollection为false,还得把新的存进去
              if(!this.isCollection){
                indexNum=index;
              }
              //用来判断是否存进去了,设为true，表示已经存进去了
              isStorage=true;
            }
        })
        if(isStorage){
            storage_songs_list.splice(indexNum,1);
            if (storage_songs_list.length==0) {
              //移除
              toggleStorage(STORAGE_SONGS_LIST,true);
            }else{
              //重新存一遍
              toggleStorage(STORAGE_SONGS_LIST,storage_songs_list);
            }
            this.isCollection=false;
        }else{
          //之前并没有存进去，现在要判断isCollection的真假，如果为真，则存进去，如果为假，则不存进去
          if(this.isCollection){
            toggleStorage(STORAGE_SONGS_LIST,storage_songs_list.concat(this.currentSong));
          }

        }
      }
      
    },
    //控制收藏还是取消收藏
    toggleSelection(){
      this.isCollection=!this.isCollection;
      // console.log(this.isCollection);
      this.isRightCollection();
    },
  	//控制播放和暂停
  	toggolePlaying(){
  		this.setPlayingState(!this.playing);
  		if(this.currentLyric){
  			this.currentLyric.togglePlay&&this.currentLyric.togglePlay();//歌曲播放时候歌词播放，歌曲停止的时候，歌词停止，用于切换歌词停止与播放的
  		}
  	},
  	//变成mini播放器
  	goback(){
      // location.reload();
      // if(location.href=="http://localhost:8080/#/my"||location.href=="http://localhost:8080/#/my/MyCollection"){
      //   this.$router.push('/my/MyCollection');
      // }else if(location.href=="http://localhost:8080/#/my/MyRecord"){
      //   this.$router.push('/my/MyRecord');
      // }
  		this.setFullScreen(false);
  	},
  	//全屏播放器
  	toFull(){
  		this.setFullScreen(true);
  	},
  	enter(el,done){
  		const {x,y,scale}=this._getPosAndScale();
  		//设置运动帧
  		let animation={
  			0:{
  				transform:`translate3d(${x}px,${y}px,0) scale(${scale})`
  			},
  			// 60:{
  			// 	transform:`translate3d(0,0,0) scale(1.1)`
  			// },
  			100:{
  				transform:`translate3d(0,0,0) scale(1)`
  			}
  		};
  		//注册animation
  		animations.registerAnimation({
  			name:'move',
  			animation,
  			presets:{
  				duration:400,
  				easing:'linear'
  			}
  		});
  		//启动animation,
  		//第一个参数：作用的对象
  		//第二个参数:animation的名称,
  		//第三个是done，有这个，表示做完后会进入afterEner()
  		animations.runAnimation(this.$refs.cdWrapper,'move',done);
  	},
  	afterEnter(){
  		//注销动画
  		animations.unregisterAnimation('move');
  		//清空动画
  		this.$refs.cdWrapper.style.animation='';
  	},
  	leave(el,done){
  		this.$refs.cdWrapper.style.transition='all .4s';
  		//离开目标的位置
  		const {x,y,scale}=this._getPosAndScale();
  		this.$refs.cdWrapper.style.transform=`translate3d(${x}px,${y}px,0) scale(${scale})`;
  		this.$refs.cdWrapper.style.webkitTransform=`translate3d(${x}px,${y}px,0) scale(${scale})`;
  		this.$refs.cdWrapper.addEventListener('transitionend',done);
  	},
  	afterLeave(){
  		this.$refs.cdWrapper.style.transition='';
  		this.$refs.cdWrapper.style.transform='';
  		this.$refs.cdWrapper.style.webkitTransform='';
  	},
  	//计算运动的位置
  	_getPosAndScale(){
  		const targetWidth=40;
  		const paddingLeft=40;
  		const paddingBottom=30;
  		const paddingTop=80;
  		const width=window.innerWidth*.8;
  		const scale=targetWidth/width;
  		const x=-(window.innerWidth/2-paddingLeft);
  		const y=window.innerHeight-paddingTop-width/-paddingBottom;
  		return {
  			x,
  			y,
  			scale
  		}
  	},
  	prev(){
      let lineToThis=this.$refs.lyricLine[0];//滚动到当前行减去5行的位置
      this.$refs.lyricList.scrollToElement(lineToThis,1000);
      this.setPlayRecord();//存储播放记录
  		if(!this.readyPlay){
  			return;
  		}
  		if(this.playlist.length==1){
  			this.loop();
        return;
  		}else{
  			let index=this.currentIndex-1;
	  		if(index<0){
	  			index=this.playlist.length-1;
	  		}
	  		this.setCurrentIndex(index);
	  		this.setPlayingState(true);
  		}
	  	this.readyPlay=false;
  	},
  	next(){
      if(!this.$refs.lyricLine){
        return;
      }
      let lineToThis=this.$refs.lyricLine[0];//滚动到当前行减去5行的位置
      this.$refs.lyricList.scrollToElement(lineToThis,1000);
      this.setPlayRecord();//存储播放记录
  		if(!this.readyPlay){
  			return;
  		}
  		if(this.playlist.length==1){
  			this.loop();
         return;
  		}else{
  			let index=this.currentIndex+1;
	  		if(index==this.playlist.length){
	  			index=0;
	  		}
	  		// console.log(index);
	  		this.setCurrentIndex(index);
  			this.setPlayingState(true);
  		}

  		
  		this.readyPlay=false;
  	},
  	ready(){
      this.isStartCollection();
      // this.$refs.lyricList.scrollToElement(this.$refs.topline,1000);//如果在5行之内就滚动到顶部

  		this.readyPlay=true;
  	},
  	error(){
  		this.readyPlay=true;
  	},
  	updateTime(e){
  		this.currentTime=e.target.currentTime;
  		var val=this.currentTime/this.currentSong.duration*100;
  		this.percent=Math.min(val,100);
  		// if(this.percent==100){
  		// 	e.target.currentTime=this.currentSong.duration;
  		// 	this.next();
  		// }
  	},
  	formateTime(val){
  		val=val|0;
  		let time='';
  		time=this.addZero(val/60|0)+':';
  		time+=this.addZero(val%60);
  		return time;
  	},
  	addZero(val){
  		if(val<10){
  			val='0'+val;
  		}else{
  			val=''+val;
  		}
  		return val;
  	},
  	//改变进度条的百分比
  	changePercent(val){
  		this.percent=Math.min(val,100);
  		let target=this.$refs.audio;
  		target.currentTime=this.currentSong.duration*this.percent/100;
  		this.currentTime=target.currentTime;
  		if(this.currentLyric){
  			this.currentLyric.seek&&this.currentLyric.seek(this.currentSong.duration*this.percent/100*1000);
  		}
  	},
  	//改变播放模式
  	changeMode(){
  		let modeNum=this.mode+1;
  		if(modeNum==3){
  			modeNum=0;
  		}
  		this.setPlayMode(modeNum);
  		let list='';
  		if(modeNum==2){
  			//随机播放
  			list=shuffle(this.sequenceList);
  		}else{
  			//顺序或循环播放
  			list=this.sequenceList;
  		}
      this.setPlayingState(true);
      if(this.currentLyric){
        this.currentLyric.togglePlay&&this.currentLyric.togglePlay();//歌曲播放时候歌词播放，歌曲停止的时候，歌词停止，用于切换歌词停止与播放的
      }
  		this.setPlayList(list);
  		
  		this.keepCurrentIndex(list);
  	},
  	//打乱顺序后，不让当前播放的歌曲的索引改变
  	keepCurrentIndex(list){
  		let item=list[this.currentIndex];
  		list.forEach((item,index)=>{
  			if(item.id==this.currentSong.id){
  				list[this.currentIndex]=this.currentSong;
  				list[index]=item;
  			}
  		})
  	},
  	ended(){
  		if(this.mode==1){
  			//单曲循环播放
  			this.loop();
  			return;
  		}
  		if(this.currentLyric){  			this.currentLyric.seek&&this.currentLyric.seek(0);//把歌词放到一开始
  		}
  		this.currentLineNum=0;
  		this.next();
  	},
  	loop(){
      let lineToThis=this.$refs.lyricLine[0];//滚动到当前行减去5行的位置
      this.$refs.lyricList.scrollToElement(lineToThis,1000);

      // 收藏的操作
      // this.isStartCollection();
      // console.log(this.currentSong,'newSong,oldSong,346');
  		this.$refs.audio.currentTime=0;
		this.$refs.audio.play();


		if(this.currentLyric){
			this.currentLyric.seek&&this.currentLyric.seek(0);//把歌词放到一开始
		}
  	},
  	getLyric(){
        // console.log(this.currentSong,'到这里')
  			this.currentSong.getLyric().then((res)=>{
  				if (this.currentSong.lyric !== res) {
		            return;
		         };
  				//res就是返回的歌词，需要用lyricParse去解析下
  				this.currentLyric=new Lyric(res,this.handleLyric);
  				if(this.playing){
  					this.currentLyric.play();
  				}
  				// console.log(this.currentLyric);
  			}).catch(()=>{
  				this.currentLyric=null;
  				this,playingLyric='';
  				this.currentLineNum=0;
  			});
  	},
  	//回调函数
  	handleLyric({lineNum,txt}){
  		this.currentLineNum=lineNum;
  		if(this.currentLineNum>5){//前面5行是不需要股东的
  			let lineToThis=this.$refs.lyricLine[lineNum-5];//滚动到当前行减去5行的位置
  			this.$refs.lyricList.scrollToElement(lineToThis,1000);//1000表示我每次滚动的时间是1000
  		}else{
  			this.$refs.lyricList.scrollToElement(this.$refs.topline,1000);//如果在5行之内就滚动到顶部
  		}
  		this.playingLyric = txt;
  	},
  	//滑动middle版块，显示cd或者歌词
  	middleTouchStart(e){
  		this.touch.infinited=true;
  		this.touch.startX=e.touches[0].pageX;
  		this.touch.startY=e.touches[0].pageY;
  	},
  	//滑动middle版块，显示cd或者歌词
  	middleTouchMove(e){
  		if(!this.touch.infinited){
  			return;
  		}
  		const deltaX=e.touches[0].pageX-this.touch.startX;
  		const deltaY=e.touches[0].pageY-this.touch.startY;
  		if(Math.abs(deltaY)>Math.abs(deltaX)){
        this.moveDir="y";
  			return;
  		}
  		const left=this.currentShow=='cd'?0:-window.innerWidth;
  		let width=Math.max(-window.innerWidth,left+deltaX);
  		if(width>0){
  			width=0;
  		}
  		this.touch.percent=Math.abs(width/window.innerWidth);
  		this.$refs.lyricList.$el.style['transform']=`translate3d(${width}px,0,0)`;
  		this.$refs.lyricList.$el.style['webkitTransform']=`translate3d(${width}px,0,0)`;
  		this.$refs.lyricList.$el.style['transition']='0s';
  		this.$refs.lyricList.$el.style['webkitTransition']='0s';
  		this.$refs.middleCd.style.opacity=1-this.touch.percent;
  		this.$refs.middleCd.style['transition']='0s opacity';
  		this.$refs.middleCd.style['webkitTransition']='0s opacity';
  	},
  	//滑动middle版块，显示cd或者歌词
  	middleTouchEnd(e){
      if(this.moveDir=="y"){
        this.moveDir="x";
        return;
      }
  		let backDis;
  		if(this.currentShow=='cd'){
  			if(this.touch.percent>=0.1){
  				backDis=-window.innerWidth;
  				this.currentShow='lyric';
  				this.$refs.middleCd.style.opacity=0;
	  		}else{
	  			backDis=0;
	  		}
  		}else{
  			if(this.touch.percent<=0.9){
  				backDis=0;
  				this.currentShow='cd';
  				this.$refs.middleCd.style.opacity=1;
	  		}else{
	  			backDis=-window.innerWidth;
	  		}
  		}

  		this.$refs.lyricList.$el.style['transform']=`translate3d(${backDis}px,0,0)`;
  		this.$refs.lyricList.$el.style['webkitTransform']=`translate3d(${backDis}px,0,0)`;
  		this.$refs.lyricList.$el.style['transition']='.4s transform';
  		this.$refs.lyricList.$el.style['webkitTransition']='.4s webkitTransform';
  		this.$refs.middleCd.style['transition']='.3s opacity';
  		this.$refs.middleCd.style['webkitTransition']='.3s opacity';
  		
  	},
  	...mapMutations({
  		setFullScreen:'SET_FULL_SCREEN',
  		setPlayingState:'SET_PLAYING_STATE',
  		setCurrentIndex:'SET_CURRENT_INDEX',
  		setPlayMode:'SET_PLAY_MODE',
  		setPlayList:'SET_PLAYLIST'
  	})
  },
  watch:{
    setTimeClose(){
      const audio=this.$refs.audio;
      this.toggolePlaying()
    },
  	currentSong(newSong,oldSong){
      // console.log(this.currentIndex);
      if(this.currentIndex==-1){
        return;
      }
      // console.log('zoule');
      this.setPlayRecord();//存储播放记录
  		if(newSong.id===oldSong.id){
  			return;
  		}
      // 收藏的操作
      // this.isStartCollection();
      // console.log(this.currentSong,'newSong,oldSong,455');
  		if(this.currentLyric){
  			this.currentLyric.stop&&this.currentLyric.stop();
  			// this.$refs.lyricList.scrollToElement(this.$refs.topline,1000);
  		}
      clearTimeout(this.timer);
  		this.timer=setTimeout(()=>{
  			this.$refs.audio.play();
  			this.getLyric();
  		},1000);//需要加载完
  	},
  	playing(newVal){

  		this.$nextTick(()=>{
  			const audio=this.$refs.audio;
	  		if(newVal){
	  			audio.play();
	  			// console.log('play');
	  			// this.setOldList(this.playlist);
	  			// this.toggleplaybtn='zantingtingzhi';
	  		}else{
	  			audio.pause();
	  			// console.log('pause')
	  			// this.toggleplaybtn='bofang';
	  		}
  		});//需要加载完
  	}
  },
  computed:{
  	cdRotate(){
  		return this.playing?'play':'play pause';
  	},
  	toggleplaybtn(){
  		return this.playing?'icon-test1':'icon-test2';
  	},
  	toggleplaybtnMini(){
  		return this.playing?'icon-test1':'icon-test2';
  	},
  	Modeicon(){
  		if(this.mode==0){
  			//顺序播放
        // return 'yinleshunxubofang';
  			return 'shunxubofang';
  		}else if(this.mode==1){
  			//单曲循环播放
        // return 'xunhuanbofang';
  			return 'danquxunhuan';
  		}else if(this.mode==2){
  			//随机播放
        // return 'iconfontsuijibofang0101';
  			return 'suijibofang';
  		}
  	},
  	...mapGetters([
  		'fullScreen',
  		'playlist',
  		'currentSong',
  		'playing',
  		'currentIndex',
  		'mode',
  		'sequenceList'
  	])
  },
  components:{progressBar,progressCircle,Scroll}
}
</script>

<style scoped>
.topline{
  width: 100%;
  height:2px;
  /*background: red;*/
  position: fixed;
  top: 4.3rem;
  left: 0;
}
.player .normal-player{
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 150;
	background: #222222;

}
.player .normal-player .background{
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	z-index: -1;
	opacity: 0.6;
	filter: blur(1rem);
}
.player .normal-player .top{
	position: relative;
	margin-bottom: 1.25rem;
}
.player .normal-player .top .back{
	position:absolute;
	top: 0;
	left: .3rem;
	z-index: 50;
}
.player .normal-player .top .back .icon-back{
	display: block;
	padding: .45rem;
	font-size: .8rem;
	color: #ffca00;
	transform: rotate(-90deg);
}
.player .normal-player .top .title{
	width: 70%;
	margin: 0 auto;
	line-height: 2rem;
	text-align: center;
	font-size: .8rem;
	color: white;
}   
.player .normal-player .top .subtitle{
	line-height: 1rem;
	text-align: center;
	font-size: .6rem;
	color: rgba(255,255,255,.5);
} 
.player .normal-player .middle{
	position: fixed;
	width: 100%;
	top: 4rem;
	bottom: 8.5rem;
	white-space: nowrap;
	font-size: 0;
}
.player .normal-player .middle .middle-l{
	display: inline-block;
	vertical-align: top;
	position: relative;
	width: 100%;
	height: 0;
	padding-top: 80%;
} 
.player .normal-player .middle .middle-l .cd-wrapper{
	position: absolute;
	left: 10%;
	top: 0;
	width: 80%;
	height: 100%;
}
.player .normal-player .middle .middle-l .cd-wrapper .cd{
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	border: .5rem solid rgba(255, 255, 255, 0.1);
	border-radius: 50%;
}
.player .normal-player .middle .middle-l .cd-wrapper .play{
	-weibkit-animation: rotate 20s linear infinite;
	animation: rotate 20s linear infinite;
}
.player .normal-player .middle .middle-l .cd-wrapper .pause{
	-weibkit-animation-play-state: paused;
	animation-play-state: paused;
}
.player .normal-player .middle .middle-l .cd-wrapper .image{
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	border-radius: 50%;
}
.playing-lyric-wrapper{
	width: 80%;
	margin: 1.5rem auto 0 auto;
	overflow: hidden;
	text-align: center;
}
.playing-lyric-wrapper .playing-lyric{
	height: 1rem;
	line-height: 1rem;
	font-size: .6rem;
	color: orange;
}
.middle-r{
	display: inline-block;
	vertical-align: top;
	width: 100%;
	height: 100%;
	overflow: hidden;
}
.middle-r .lyric-wrapper{
	width: 80%;
	margin: 0 auto;
	overflow: hidden;
	text-align: center;
}
.middle-r .lyric-wrapper .text{
	line-height: 1.6rem;
	color: hsla(0,0%,100%,.5);
	font-size: .6rem;
}
.middle-r .lyric-wrapper .current{
	color: white;
}
.bottom{
	position: absolute;
	bottom: 1rem;
	width: 100%;
}
.bottom .dot-wrapper{
	text-align: center;
	font-size: 0;
}
.dot-wrapper .dot{
	display: inline-block;
	vertical-align: middle;
	margin: 0 .2rem;
	width: .4rem;
	height: .4rem;
	border-radius: 50%;
	background: rgba(255,255,255,.5);
}
.dot-wrapper .active{
	width: 1rem;
	border-radius: .25rem;
	background: orange;
}
.progress-wrapper{
	display: flex;
	align-items: center;
	width: 80%;
	margin: 0rem auto;
	padding: .5rem 0;
}
.progress-wrapper .time{
	color: #ffca00;
	font-size: .6rem;
	flex: 0 0 1.5rem;
	line-height: 1.5rem;
	width: 1.5rem;
}
.progress-wrapper .time-l{
	text-align: left;
}
.progress-wrapper .time-r{
	text-align: right;
}
.progress-wrapper .c{
	flex:1;
}
.operators{
	display: flex;
	align-items: center;
}
.operators .icon{
	flex: 1;
	color: #ffca00;
}
.operators .disable{
	color: blue;
}
.operators .icon i{
	font-size: 1.5rem;
}
.operators .i-left{
	text-align: right;
}
.operators .i-center{
	padding: 0 1rem;
	text-align: center;
}           
.operators .i-center i{
	font-size: 2rem;
}          
.operators .i-right{
	text-align: left;
} 

.icon-favorite{
	color: red;
}   
.normal-enter-active,.normal-leave-active{
	transition: all 0.4s;
}   
.normal-enter-active .top,.normal-enter-active .bottom,.normal-leave-active .top,.normal-leave-active .bottom{
	transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
}
.normal-enter,.normal-leave-to{
	opacity: 0;
}
.normal-enter .top,.normal-leave-to .top{
	transform: translate3d(0, -5rem, 0);
}
.normal-enter .bottom,.normal-leave-to .bottom{
	transform: translate3d(0, 5rem, 0);
}
.mini-player{
	display: flex;
	align-items: center;
	position: fixed;
	left: 0;
	bottom: 0;
	z-index: 180;
	width: 100%;
	height: 3rem;
	background: #333333;
}
.mini-enter-active,.mini-leave-active{
	transition: all 0.4s;
}
.mini-enter,.mini-leave-to{
	opacity: 0;
}
.mini-player .icon{
	flex: 0 0 2rem;
	width: 2rem;
	padding: 0 .5rem 0 1rem;
}
.mini-player .icon img{
	border-radius: 50%;
}
.mini-player .icon .play{
	animation: rotate 10s linear infinite;
}
.mini-player .icon .pause{
	animation-play-state: paused;
}
.mini-player .text{
	display: flex;
	flex-direction: column;
	justify-content: center;
	flex: 1;
	line-height: 1rem;
	overflow: hidden;
}
.mini-player .text .name{
	margin-bottom: .1rem;
	font-size: .6rem;
	color: #ffca00;
}
.mini-player .text .desc{
	font-size: .6rem;
	color: #ffca00;
}
.mini-player .control{
	flex: 0 0 1.5rem;

	/*width: 1.5rem;
	padding: 0 .5rem;
	margin-right: 1rem;*/
  margin-top: .3rem;
  color:#ffca00;
  /*background: red;*/
}
.mini-player .control .icon-zantingtingzhi,.mini-player .control  .icon-bofang, .icon-playlist{
	font-size: 1.5rem;
	color: #ffca00;

}

.icon-mini{
	font-size: 1.6rem;
	position: absolute;
	right: 2rem;
	top: .5rem;
  color:#ffca00;
  margin-top: .3rem;
}
.modeicon{
	font-weight: 200;
}


.icon-icon-test2{
  /*width: 2rem!important;*/
  /*text-align: center!important;*/
}
.icon-playlist{
  width: 1rem!important;
  text-align: center!important;
  margin-right: .3rem;
}

.mini-player .icon{
  padding:0;
}
@-webkit-keyframes rotate{
	0%{
      transform: rotate(0);
	}
    100%{
      transform: rotate(360deg);
    }
}  
@keyframes rotate{
	0%{
      transform: rotate(0);
	}
    100%{
      transform: rotate(360deg);
    }
}
  
</style>