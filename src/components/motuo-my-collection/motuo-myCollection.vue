<template>
  <div id="motuo-myCollection" ref="collectionWrapper">
  	<no-scroll-list
	:songs="collectionList"
	:listName="listName"
  :data="num"
	@songsChange="getSongsChange"
	@haveCleardCollection="haveCleardCollection"
  	></no-scroll-list>
  </div>
</template>

<script>
import NoScrollList from 'base/no-scroll-list/no-scroll-list'

export default {
  name: 'mycollection',
  props:{
  	collectionList:{
  		type:Array,
  		default:[]
  	}
  },
  data(){
  	return {
  		num:[0],
  		listName:'收藏'
  	}
  },
  created(){
    
  },
  methods:{
  	getSongsChange(){
  		this.$emit('hasChange');
  	},
  	haveCleardCollection(){
      console.log('ssd')
  		this.$emit('haveCleardCollectionOne');
  	}
  },
  components:{NoScrollList}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#motuo-myCollection{
	/*background: red;*/
	color: white;
}
</style>