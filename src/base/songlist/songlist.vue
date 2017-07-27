<template>
  <div class="song-list">
    <ul>
      <li @click="selectItem(song,index)" v-for="(song,index) in songs" class="item">
      	<div class="content">
      		<h2 class="name">{{song.name}}</h2>
      		<p class="desc">{{getDesc(song)}}</p>
      	</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'songlist',
  props:{
  	songs:{
  		type:Array,
  		default:[]
  	}
  },
  methods:{
  	getDesc(song){
  		return `${song.singer} - ${song.album}`
  	},
    selectItem(item,index){
      this.$emit('select',item,index)
    }
  }
}
</script>


<style scoped>
.song-list .item{
	display: flex;
	align-items: center;
	box-sizing: border-box;
	height: 3.2rem;
	font-size: .6rem;
}
.rank{
	flex: 0 0 1.25rem;
	width: 1.25rem;
	margin-right: 1.5rem;
	text-align: center;
}
.rank .icon{
	display: inline-block;
	width: 1.25rem;
	height: 1.2rem;
	background-size: 1.25rem 1.2rem;
}
.rank .text{
  color: gold;
  font-size: .8rem;
}
.content{
  flex: 1;
  line-height: 20px;
  overflow: hidden;

}    
.content .name{
  color: white;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.content .desc{
  margin-top: 4px;
  color: white;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.name {
    margin-left: 0rem;
    color: rgba(136,136,136,1);
    font-size: .6rem;
}
          
          
</style>