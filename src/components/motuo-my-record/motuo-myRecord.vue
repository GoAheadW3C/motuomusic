<template>
  <div id="motuo-myRecord">
    <no-scroll-list
  :songs="recordList"
  :listName="listName"
  @haveCleardRecord="haveCleardRecord"
    ></no-scroll-list>
  </div>
</template>

<script>
import NoScrollList from 'base/no-scroll-list/no-scroll-list'
export default {
  name: 'myrecord',
  props:{
    recordList:{
      type:Array,
      default:[]
    }
  },
  data(){
    return {
      // songs:[],
      listName:'记录'
    }
  },
  created(){
    
  },
  methods:{
    haveCleardRecord(){
      this.$emit('haveCleardRecordOne');
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