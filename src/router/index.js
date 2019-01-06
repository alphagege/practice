import Vue from 'vue'
import Router from 'vue-router'
import iView from 'iview'
import api from '@/api'
import Main from '@/views/Main'
import Overview from '@/views/Overview'
import Login from '@/views/Login'
import Error from '@/views/Error'

Vue.use(Router)

export const loginRouter = {
  path: '/login',
  name: 'login',
  component: Login
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
  path: '/',
  name: 'otherRouter',
  component: Main,
  redirect: 'home',
  children: [
    {path: 'home', title: '首页', name: 'home_index', component: Overview},
  ]
}

const routers = [
  loginRouter,
  otherRouter
];

const router = new Router({
  routes: routers
});

export function resetRouter($router, newRouters) {
  const newRouter = new Router({routes: [loginRouter]});
  $router.matcher = newRouter.matcher;
  $router.addRoutes(newRouters);
}

router.beforeEach((to, from, next) => {
  api.user.getMe().then(res => {
    if (to.name === 'login') {
      next('home');
    }
  });
  iView.LoadingBar.start();
  next();
})

router.afterEach((to) => {
  iView.LoadingBar.finish();
  window.scrollTo(0, 0);
})

export default router;
