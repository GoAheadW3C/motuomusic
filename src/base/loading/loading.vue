<template>
  	<div class="loading">
  		<img width="24" height="24" src="./loading.gif" alt="loading">
  		<p class="desc">{{title}}</p>
  	</div>
</template>

<script>
export default {
  name: 'loading',
  props:{
  	title:{
  		type:String,
  		default:'loading'
  	}
  }
  
}
</script>


<style>
.loading{
	width: 100%;
	text-align: center;
}
.desc{
	line-height: 20px;
	font-size: .6rem;
	color: rgba(255,255,255,.5);
	margin: 0
}

</style>