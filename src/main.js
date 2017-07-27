// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCookie from 'vue-cookie'
import Fonts from './assets/font/iconfont.css'
import VueLazyload from 'vue-lazyload'

//引入字体文件
import 'common/fonts/iconfont.css';
//引入样式重置文件
import 'common/css/reset.css';

Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: require('common/images/xuelianhua.png'),
  attempt: 1
})
// import css from 'file.css'
// import style from './file.css'

Vue.use(VueAxios, axios);
Vue.use(VueCookie)
Vue.use(MintUI)

import attachFastClick from 'fastclick'

attachFastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
