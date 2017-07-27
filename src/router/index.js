import Vue from 'vue'
import Router from 'vue-router'
// import Recommend from '@/components/motuo-recommend/motuo-recommend'
// import Search from '@/components/motuo-search/motuo-search'
// import Singer from '@/components/motuo-singer/motuo-singer'
// import SingerDetail from '@/components/motuo-singer-detail/motuo-singerdetail'
// import Hotlist from '@/components/motuo-hotlist/motuo-hotlist'
// import HotlistDetail from '@/components/motuo-hotlist-detail/motuo-hotlistdetail'
// import Mv from '@/components/motuo-mv/motuo-mv'
// import My from '@/components/motuo-my/motuo-my'
// import MyCollection from '@/components/motuo-my-collection/motuo-myCollection'
// import MyRecord from '@/components/motuo-my-record/motuo-myRecord'
// import MySetting from '@/components/motuo-my-setting/motuo-mySetting'

const Recommend =(resolve)=>{
  import('@/components/motuo-recommend/motuo-recommend').then((res)=>{
    resolve(res);
  })
}

const Search =(resolve)=>{
  import('@/components/motuo-search/motuo-search').then((res)=>{
    resolve(res);
  })
}

const Singer =(resolve)=>{
  import('@/components/motuo-singer/motuo-singer').then((res)=>{
    resolve(res);
  })
}

const SingerDetail =(resolve)=>{
  import('@/components/motuo-singer-detail/motuo-singerdetail').then((res)=>{
    resolve(res);
  })
}
const Hotlist =(resolve)=>{
  import('@/components/motuo-hotlist/motuo-hotlist').then((res)=>{
    resolve(res);
  })
}
const HotlistDetail =(resolve)=>{
  import('@/components/motuo-hotlist-detail/motuo-hotlistdetail').then((res)=>{
    resolve(res);
  })
}
const Mv =(resolve)=>{
  import('@/components/motuo-mv/motuo-mv').then((res)=>{
    resolve(res);
  })
}
const My =(resolve)=>{
  import('@/components/motuo-my/motuo-my').then((res)=>{
    resolve(res);
  })
}
const MyCollection =(resolve)=>{
  import('@/components/motuo-my-collection/motuo-myCollection').then((res)=>{
    resolve(res);
  })
}
const MyRecord =(resolve)=>{
  import('@/components/motuo-my-record/motuo-myRecord').then((res)=>{
    resolve(res);
  })
}
const MySetting =(resolve)=>{
  import('@/components/motuo-my-setting/motuo-mySetting').then((res)=>{
    resolve(res);
  })
}

Vue.use(Router)

let R=new Router({
  routes: [
    {
      path: '/',
      redirect:'/Recommend'
    },
    {
      path: '/Rank',
      name: 'Rank',
      component: Hotlist,
      children:[
        {
          path:':id',
          name:'HotlistDetail',
          component:HotlistDetail
        }
      ]
    },
    {
      path: '/Recommend',
      name: 'Recommend',
      component: Recommend
    },
    {
      path: '/my',
      name: 'My',
      component: My,
      children:[
        {
          path:'',
          name:'MyCollection',
          component:MyCollection
        },
        {
          path:'MyCollection',
          name:'MyCollection',
          component:MyCollection
        },
        {
          path:'MyRecord',
          name:'MyRecord',
          component:MyRecord
        },
        {
          path:'MySetting',
          name:'MySetting',
          component:MySetting
        }
      ]
    },
    {
      path: '/Search',
      name: 'Search',
      component: Search
    },
    {
      path: '/Mv',
      name: 'Mv',
      component: Mv
    },
    {
      path: '/Singer',
      name: 'Singer',
      component: Singer,
      children:[
        {
          path:':id',
          name:'SingerDetail',
          component:SingerDetail
        }
      ]
    }
  ]
})


// R.beforeEach( (to, from, next) => {
//     console.log(to.path,'to');
//     console.log(from,'from');
//     console.log(this.a.app);
//     next();
// } );

export default R;
