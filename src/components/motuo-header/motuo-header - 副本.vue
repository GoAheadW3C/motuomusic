<template>
  <div id="motuoHeader">
  	<mt-header title="METOK MUSIC">
  		<i class="icon iconfont icon-yinle3" slot="left"></i>
	  </mt-header>
  </div>
</template>

<script>
import { Header as H } from 'mint-ui'; 
export default {
  name: 'motuoheader',
  data () {
    return {
      msg: 'yuhua'
    }
  },
  components:{H}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mint-header{
	background-color: #222222;
	color:rgba(254,201,1,1);
	text-align: left;
  height: 1.8rem;
  border:none;
}
.icon{
	color:rgba(254,201,1,1);
	font-size: 1rem;
	font-weight: bolder;
	margin-left: 5.1rem;
  margin-right: .3rem;
}
</style>