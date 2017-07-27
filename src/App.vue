<template>
  <div id="app">
    <motuo-header class="headerCom"></motuo-header>
    <motuo-nav class="navCom"></motuo-nav>
    <keep-alive>
    	<router-view @toShowPlaylist="toShowPlaylist"></router-view>
    </keep-alive>
	<player :setTimeClose="isclose" @toShowPlaylist="toShowPlaylist"></player>
	<modal 
		v-if="isShowModal.isShow" 
		class="modalLayout"
	>
		<div v-if="isShowModal.data=='clear'" class="modalContent">
			<h2 class="title">请选择要清除的选项</h2>
			<ul class="list">
				<li>
					<span class="item">清除本地收藏</span>
					<i v-if="!clear.clearCollection" class="icon iconfont icon-kaiguan111 onOff" style="color: white;" @click.stop="toggleCollectionItem"></i>
					<i v-if="clear.clearCollection" class="icon icon iconfont icon-kaiguan11 onOff" style="color: gold;" @click.stop="toggleCollectionItem"></i>
				</li>
				<li>
					<span class="item">清除本地记录</span>
					<i v-if="!clear.clearRecord" class="icon iconfont icon-kaiguan111 onOff" style="color: white;" @click.stop="toggleRecordItem"></i>
					<i v-if="clear.clearRecord" class="icon icon iconfont icon-kaiguan11 onOff" style="color: gold;" @click.stop="toggleRecordItem"></i>
				</li>
			</ul>
			<div class="bottomBtn">
				<span @click.stop="sure('clear')">确定</span><span @click.stop="cancel('clear')">取消</span>
			</div>
		</div>

		<div v-if="isShowModal.data=='about'" class="modalContent modalContentAbout">
			<h2 class="title">关于我</h2>
			<div class="list">
				<span style="color:gold;">作者:</span> 壮壮<br>
				<span style="color:gold;">籍贯:</span> 浙江杭州<br>
				<span style="color:gold;">简述:</span> 本人为前端开发工程师，不敢大话自己是一位能手，乃前端界的小学生一枚，还需虚心向各位界内朋友请教学习，目前正向各大企业求职，如有对眼之意，请点击“<a href="sms:13586934578" style="color:red;">邀约面试</a>”抛出尊贵的橄榄枝，鄙人定当作揖致谢。本作品仅做面试之用，无商用之途，版权归本人所有。<br>
				<span style="color:gold;">微信:</span> 809742006
			</div>
			<div class="bottomBtn">
				<span @click.stop="sure('clear')"><a href="sms:13586934578">邀约面试</a></span><span @click.stop="cancel">取消</span>
			</div>
		</div>

		<div v-if="isShowModal.data=='timeClose'" class="modalContent modalContentTimeClose">
			<h2 class="title">定时关闭</h2>
			<ul class="list">
				<li @click.stop="showThisDui(0)">
					<span class="item">不开启</span>
					<span class="right" v-show="showRight==0">√</span>
				</li>
				<li @click.stop="showThisDui(1)">
					<span class="item">10分钟后</span>
					<span class="right" v-show="showRight==1">√</span>
				</li>
				<li @click.stop="showThisDui(2)">
					<span class="item">20分钟后</span>
					<span class="right" v-show="showRight==2">√</span>
				</li>
				<li @click.stop="showThisDui(3)">
					<span class="item">30分钟后</span>
					<span class="right" v-show="showRight==3">√</span>
				</li>
				<li @click.stop="showThisDui(4)">
					<span class="item">60分钟后</span>
					<span class="right" v-show="showRight==4">√</span>
				</li>
				<li @click.stop="showThisDui(5)">
					<span class="item">90分钟后</span>
					<span class="right" v-show="showRight==5">√</span>
				</li>
				<li style="color:gold;">
					<span class="item">倒计时：</span>
					<span class="right">{{restTime}}</span>
				</li>
			</ul>
			<div class="bottomBtn">
				<span @click.stop="surSetTime">确定</span><span @click.stop="cancelSetTime">关闭</span>
			</div>
		</div>

		<div v-if="isShowModal.data=='drive'" class="modalContentDrive" ref="drivebox">
			<div class="background">
		          <img width="100%" height="100%" :src="currentSong.image">
		    </div>
			<div class="headerBar">
				<i class="icon iconfont icon-quxiao rightIcon" @click.stop="cancel('drive')"></i>
			</div>
			<div class="content" v-if="!showTips">
				<h2 class="title">
				{{currentSong.name}}<br>
				<span class="singer">{{currentSong.singer}}</span>
				</h2>
				<i @click.stop="prev" class="icon iconfont icon-icon-test leftIcon"></i>
				<i @click="toggolePlaying" class="icon iconfont middleIcon" :class="'icon-'+toggleplaybtn"></i>
				<i class="icon iconfont icon-icon-test3 rightIcon" @click.stop="next"></i>
			</div>
			<div class="content" v-if="showTips">
				<h2 class="tip">暂无歌曲<br>请检查本地记录或本地收藏<br>两者至少有其一不为空</h2>
			</div>
			<div class="bottom">
				<h4><i class="icon iconfont icon-zhinengjiashi"></i>驾驶模式</h4>
				<i class="icon iconfont icon-guanyu right" @click.stop="rotateScreen"></i>
			</div>
		</div>

	</modal>
	<play-list class="playlistPart" ref="playlistCom"></play-list>
  </div>
</template>

<script>

window.addEventListener('hashchange',()=>{
	console.log('hashchange',this)
})


import MotuoHeader from '@/components/motuo-header/motuo-header'
import MotuoNav from '@/components/motuo-nav/motuo-nav'
import Player from '@/components/motuo-player/motuo-player'
import Modal from 'base/modal-box/modal-box'
import {mapGetters,mapMutations,mapActions} from 'vuex'
import {toggleStorage,STORAGE_SONGS_LIST,STORAGE_RECORD_LIST} from 'common/js/localStorage'
import PlayList from 'base/playlist/playlist'
export default {
  name: 'app',
  data(){
  	return{
  		showTips:false,
  		screenDir:false,//false表示竖屏，true表示横屏
  		setCountDownTimer:null,//倒计时的定时器
  		setTimer:null,//定时关闭的定时器
  		isclose:false,//是否关闭播放
  		restTime:'00:00:00',//倒计时时间，显示在页面
  		countDownVal:0,//倒计时毫秒数
  		showRight:0,//关机的对勾对应的选项
  		clear:{
  			clearCollection:false,
  			clearRecord:false
  		}
  	}
  },
  methods:{
  	// openPlayListPart(){

  	// 	this.toShowPlaylist();
  	// 	// this.setAddSong(false);
  	// },
  	toShowPlaylist(){
  		this.$refs.playlistCom.$el.style.bottom="0";
  		this.$refs.playlistCom.$el.style.transition=".3s bottom";
  		this.$refs.playlistCom.$el.style.zIndex="9999";
  	},
  	prev(){
  		if(this.playlist.length==1){
  			this.loop();
  		}else{
  			let index=this.currentIndex-1;
	  		if(index<0){
	  			index=this.playlist.length-1;
	  		}
	  		this.setCurrentIndex(index);
	  		this.setPlayingState(true);
  		}
  	},
  	next(){
  		if(this.playlist.length==1){
  			this.loop();
  		}else{
  			let index=this.currentIndex+1;
	  		if(index==this.playlist.length){
	  			index=0;
	  		}
	  		this.setCurrentIndex(index);
  			this.setPlayingState(true);
  		}
  	},
  	//控制播放和暂停
  	toggolePlaying(){
  		this.setPlayingState(!this.playing);
  	},
  	//旋转屏幕
  	rotateScreen(){
  		this.screenDir=!this.screenDir;
  		
  		let width=0;
  		let height=0;
  		height=this.$refs.drivebox.clientWidth;
  		width=this.$refs.drivebox.clientHeight;
  		this.$refs.drivebox.style.transformOrigin="left top";

  		if(this.screenDir){
  			this.$refs.drivebox.style.transform=`translateX(${height}px) rotate(90deg)`;
  			this.$refs.drivebox.style.webkitTransform=`translateX(${height}px) rotate(90deg)`;
  		}else{
  			this.$refs.drivebox.style.transform=`rotate(0deg)`;
  			this.$refs.drivebox.style.webkitTransform=`rotate(0deg)`;
  		}
  		
  		this.$refs.drivebox.style.transition=`.25s`;
  		this.$refs.drivebox.style.webkitTransition=`.25s`;
  		this.$refs.drivebox.style.width=width+'px';
  		this.$refs.drivebox.style.height=height+'px';
  		
  	},
  	showThisDui(num){
  		//不管num是几，我都要先清楚定时器，然后如果num不是0，那我再设置
  		clearTimeout(this.setTimer);
  		clearInterval(this.setCountDownTimer);
  		this.isclose=false;
  		this.showRight=num;
  		let interval=null;
  		if(this.showRight==1||this.showRight==2||this.showRight==3){
			interval=this.showRight*10*60*1000;
		}else if(this.showRight==4){
			interval=60*60*1000;
		}else if(this.showRight==5){
			interval=90*60*1000;
		}
  		this.restTime=this.formateTime(interval/1000);
  	},
  	surSetTime(){
  		let interval=null;
  		if(this.showRight<6&&this.showRight>0){
  			if(this.showRight==1||this.showRight==2||this.showRight==3){
  				interval=this.showRight*10*60*1000;
  			}else if(this.showRight==4){
  				interval=60*60*1000;
  			}else if(this.showRight==5){
  				interval=90*60*1000;
  			}
  			this.setTimer=setTimeout(()=>{
  				//发送emit事务
  				this.isclose=true;
  				clearTimeout(this.setTimer);
  				this.showRight=0;
	  		},interval);
  		}
  		this.countDownVal=interval;
  		this.countDown();//启动倒计时
  		this.closeModal();
  	},
  	countDown(){//倒计时函数，用于定时关闭
  		clearInterval(this.setCountDownTimer);
  		this.setCountDownTimer=setInterval(()=>{
  			this.countDownVal-=1000;
  			if(this.countDownVal<=0){
  				this.countDownVal=0;
  				this.showRight=0;
  				clearInterval(this.setCountDownTimer);
  			}
  			this.restTime=this.formateTime(this.countDownVal/1000);
  		},1000);
  	},
  	cancelSetTime(){
  		this.closeModal();
  		clearTimeout(this.setTimer);
  		this.isclose=false;
  	},
  	toggleRecordItem(){
  		this.clear.clearRecord=!this.clear.clearRecord;
  	},
  	toggleCollectionItem(){
  		this.clear.clearCollection=!this.clear.clearCollection;
  	},
  	sure(target){
  		if(target=='clear'){
  			//表示我点击的确定是清除的版块
  				//清楚完了我还得告诉它我清楚完了！
  			if(this.clear.clearCollection){
  				toggleStorage(STORAGE_SONGS_LIST,true);
  			}
  			if(this.clear.clearRecord){
  				toggleStorage(STORAGE_RECORD_LIST,true);
  			}	
  		}
  		this.closeModal();
  		this.reset(target);
  	},
  	cancel(target){

  		if(target=='drive'){
  			this.setPlayingState(false);
  			// this.setFullScreen(false);
  			this.setPlayList([]);
  			this.setCurrentIndex(-1);
  			this.setSequenceList([]);
  			this.rotateScreen();
  		}
  		
  		this.reset(target);
  		this.closeModal();

  	},
  	reset(target){
  		if(this[target]){
  			for(var attr in this[target]){
	  			this[target][attr]=false;
	  		}
  		}
  		
  	},
  	closeModal(){
  		this.setModalVal({
  			isShow:false,
			data:''
  		})
  	},
  	formateTime(val){
  		val=val|0;
  		let time='';
  		time=this.addZero(val/3600|0)+':';
  		time+=this.addZero(val%3600/60|0)+':';
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
  	//数组去重，去掉每首歌id一样的歌曲，只保留一样的一首就可以
  	removeRepeat(targetArray){
  		let newArr=[targetArray[0]];
  		let flag=false;
  		targetArray.forEach((item,index)=>{
  			newArr.forEach(song=>{
  				if(item.id==song.id){
  					flag=true;
  				}
  			})
  			if(!flag){
  				newArr.push(item);
  			}else{
  				flag=false;
  			}
  		})
  		return  newArr;
  	},
  	...mapMutations({
  		setModalVal:'SET_MODAL_VAL',
  		setFullScreen:'SET_FULL_SCREEN',
  		setPlayingState:'SET_PLAYING_STATE',
  		setCurrentIndex:'SET_CURRENT_INDEX',
  		setPlayMode:'SET_PLAY_MODE',
  		setPlayList:'SET_PLAYLIST',
  		setSequenceList:'SET_SEQUENCE_LIST',
  		setAddSong:'SET_ADD_SONG'
  	}),
  	...mapActions([
      'selectPlay'
    ])
  },
  watch:{
  	isShowModal(newVal){
  		if(newVal.data=='drive'&&newVal.isShow){
  			//获取本地歌曲
  			// toggleStorage,STORAGE_SONGS_LIST,STORAGE_RECORD_LIST
  			let collectionSongs=null;
  			if(toggleStorage(STORAGE_SONGS_LIST)==null){
  				collectionSongs=[];
  			}else{
  				collectionSongs=toggleStorage(STORAGE_SONGS_LIST);
  			}
  			let recordSongs=null;
  			if(toggleStorage(STORAGE_RECORD_LIST)==null){
  				recordSongs=[];
  			}else{
  				recordSongs=toggleStorage(STORAGE_RECORD_LIST);
  			}
  			let songs=collectionSongs.concat(recordSongs);
  			// console.log(songs,'songs');
  			if(!songs.length){
  				//提示无歌曲，本地记录或本地收藏两者至少有其一不能为空
  				this.showTips=true;
  				return;
  			}else{
  				this.showTips=false;
  			}
  			songs=this.removeRepeat(songs);
  			//打开了车载播放器，并且要
  				//派发selectPlay事件，更新播放列表
  				//开始播放歌曲

			this.selectPlay({
				list:songs,
				index:0
			});
  		}else{
  			//停止播放歌曲
  		}
  	}
  },
  computed:{
  	toggleplaybtn(){
  		return this.playing?'icon-test1':'icon-test2';
  	},
  	...mapGetters([
  		'isShowModal',
  		'fullScreen',
  		'playlist',
  		'currentSong',
  		'playing',
  		'currentIndex',
  		'mode',
  		'sequenceList'
  	])
  },
  components:{MotuoHeader,MotuoNav,Player,Modal,PlayList}
}
</script>

<style>
#app{
	background-color: #222222;
}
.headerCom{
	position: fixed;
	width: 100%;
	height: 1.8rem;
	z-index: 100;
}
.navCom{
	position: fixed;
	top: 1.8rem;
	width: 100%;
	height: 1.5rem;
	z-index: 100;
}
.modalContent{
	position: absolute;
	left: 50%;
	top: 50%;
	margin-left: -5rem;
	margin-top: -3rem;
	width: 10rem;
	height: 6rem;
	min-height: 6rem;
	background: #222222;
	color: white;
	border: 2px solid gold;
	border-radius: .2rem;
	font-size: .6rem;
}
.modalContent .title{
	color:gold;
	height: 1.2rem;
	line-height: 1.2rem;
	font-size: .65rem;
	margin-top: .3rem;
}
.modalContent .list{
	width: 80%;
	height: 2.4rem;
	padding: 0 10%;
	color: white;
	text-align: left;
	margin-top: .5rem;
	/*background: blue;*/
}
.modalContent .list li{
	height: 1.2rem;
}
.modalContent .list .item{
	float: left;
	vertical-align: middle;
}
.modalContent .list .onOff{
	float: right;
	font-size: 1.2rem;
	margin-top: -0.275rem;

}
.modalContent .bottomBtn{
	height: 1.2rem;
	width: 100%;
	background-color: red;
	position: absolute;
	left: 0;
	bottom: 0;

}
.modalContent .bottomBtn span{
	float: left;
	width: 50%;
	height: 100%;
	background: #222222;
	border: 2px solid gold;
	box-sizing: border-box;
	text-align: center;
	line-height: 1.2rem;
}
.modalContent .bottomBtn span:nth-of-type(1){
	border-right-width: 1px;
	border-left-width: 0px;
	border-bottom-width: 0px;
}
.modalContent .bottomBtn span:nth-of-type(2){
	border-left-width: 1px;
	border-right-width: 0px;
	border-bottom-width: 0px;
}
.modalContent .bottomBtn span a{
	text-decoration: none;
	color: white;
}


.modalContentAbout{
	margin-left: -6rem;
	margin-top: -8rem;
	width: 12rem;
	height: 16rem;
}
.modalContentAbout .list{
	font-size: .6rem;
	line-height: 1rem;
}


.modalContentTimeClose{
	width: 10rem;
	height: 12rem;
	margin-left: -5rem;
	margin-top: -6rem;
}
.modalContentTimeClose .right{
	float: right;
}

.modalContentDrive{
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background: #222222;
	/*transform: rotate(90deg);*/
}
.modalContentDrive .headerBar{
	height: 8%;
	/*background: red;*/
}
.modalContentDrive .headerBar .rightIcon{
	float: right;
	width: 2rem;
	height: 100%;
	/*background: blue;*/
	text-align: center;
	line-height: 2;
	font-size: 1.3rem;
	color: white;
}
.modalContentDrive .content{
	width: 100%;
	height: 92%;
	/*background: red;*/
	color: rgba(255,255,255,.9);

}
.modalContentDrive .content .tip{
	position: absolute;
	top: 35%;
	width: 100%;
	text-align: center;
	line-height: 2;
}
.modalContentDrive .content .leftIcon{
	position: absolute;
	left: 0;
	top: 55%;
	width: 4rem;
	height: 13%;
	/*background: blue;*/
	font-size: 3.5rem;
	line-height: 1.14;
}
.modalContentDrive .content .middleIcon{
	position: absolute;
	left: 50%;
	top: 55%;
	margin-left: -2rem;
	width: 4rem;
	height: 13%;
	/*background: blue;*/
	font-size: 3.5rem;
	line-height: 1.14;
}
.modalContentDrive .content .rightIcon{
	position: absolute;
	right: 0;
	top: 55%;
	width: 4rem;
	height: 13%;
	/*background: blue;*/
	font-size: 3.5rem;
	line-height: 1.14;
}
.modalContentDrive .bottom{
	position: absolute;
	bottom: .5rem;
	width: 100%;
	height: .6rem;
	/*background: red;*/
	color: rgba(80,80,80,.8);
}
.modalContentDrive .bottom h4{
	position: absolute;
	bottom: 0;
	left: 50%;
	margin-left: -2rem;
	width: 4rem;
	/*background-color: blue;*/
	font-size: .6rem;
	line-height: .6rem;
}
.modalContentDrive .bottom .right{
	position: absolute;
	right: .5rem;
	top: 0rem;
	font-size: .6rem;
	line-height: .6rem;
}
.modalContentDrive .content .title{
	position: absolute;
	left: 10%;
	top: 25%;
	width: 80%;
	color: white;
	height: 2rem;
	font-size: 1.2rem;
	line-height: 2rem;
	font-weight: 200;
}
.modalContentDrive .content .singer{
	font-weight: 100;
	color: rgba(255,255,255,.7);
	font-size: .9rem;
	line-height: 2rem;
}
.modalContentDrive .background{
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	z-index: -1;
	opacity: 0.6;
	filter: blur(1rem);
}
.playlistPart{

}
</style>
