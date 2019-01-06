//api集合
import api from '@/api' 

import {otherRouter, resetRouter} from '@/router'
import * as types from '../mutations-type'

function constructRoute(menu) {
  let dynamicComponent;
  let {openMode, menuId, menuPath} = menu;
  try {
    if (openMode === 'in_self' || openMode === 'in_blank') {
      dynamicComponent = require(`@/views/${menuPath.slice(1)}`).default;
    } else if (openMode === 'out_self') {
      dynamicComponent = {template: `<iframe style="padding: 0px" src="http://${menuPath}"></iframe>`}
    }
  } catch (e) {
    dynamicComponent = require('@/views/Error').default
  }
  return {
    path: openMode === 'in_blank' ? menuPath : menuPath.slice(1),
    name: menuId,
    component: dynamicComponent
  };
}
const blankRouter = [] //把当前组件单独一个页面打开的数组

function transformRouter(menus) {
  let menuList = []

  menus.forEach((menu) => {
    if (menu.children.length > 0) {
      menu.children = transformRouter(menu.children);
    } else {
      let route = constructRoute(menu);
      if (menu.openMode == 'in_self' || menu.openMode === 'out_self') {
        otherRouter.children.push(route);
        console.log(otherRouter)
      } else if (menu.openMode === 'in_blank') {
        blankRouter.push(route);
      }
    }
    menu.expand = true;
    menuList.push(menu);
  });
  return menuList;
};

function generateBreadcrumb(parentMenu, menus, name, paths = []) {
  if (parentMenu) {
    paths.push(parentMenu);
  }
  let flag = menus.some(menu => {
    if (menu.menuId === name) {
      paths.push(menu);
      return paths;
    }
    return menu.menuId === name;
  })
  if (!flag && parentMenu && parentMenu.menuId !== 'home_index') {
    paths.pop();
  } else {
    menus.forEach(menu => {
      if (menu.children.length > 0) {
        generateBreadcrumb(menu, menu.children, name, paths);
      }
    })
  }
  return paths;
}

export default {
  state: {
    menuList: [],
    allMenus: [],
    currentRoute: '',
    breadcrumbs: []
  },
  getters: {
    menuList: state => state.menuList,
    breadcrumbs: state => state.breadcrumbs,
    allMenus: state => state.allMenus
  },
  mutations: {
    updateMenuList(state, menuList) {
      state.menuList = menuList;
    },
    addMenu(state, menu) {
      if (!menu.rootId) {
        state.menuList.push(menu);
      } else {
        state.menuList.map(_menu => {
          if (_menu.id === menu.rootId) {
            _menu.children.push(menu);
          }
        })
      }
    },
    setCurrentRoute(state, route) {
      state.currentRoute = route;
    },
    setBreadcrumbs(state, breadcrumbs) {
      state.breadcrumbs = breadcrumbs;
    },
    setAllMenus(state, menus) {
      state.allMenus = menus;
    }
  },
  actions: {
    async initMenus({commit, state}, vm) {
      let resUser = await api.user.getMe();
      // 调用了name为getMe的接口 /user/me
      // console.log(resUser)
      if (resUser.status === 200) {
        // 通过上面这个getMe接口返回的一个id在掉一个接口 
        // /user-accounts/{id}/granted-menus 
        // getGrantMenus这个方法替换｛｝用的
        let res = await api.user.getGrantMenus({
          pathParams: {
            id: resUser.data.id
          }
        });
        if (res.status === 200) {
          let menuList = transformRouter(res.data);
          this.dispatch('initBreadcrumbs', state.currentRoute);
          resetRouter(vm.$router, [otherRouter, ...blankRouter]);
          commit('updateMenuList', menuList); 
        } else {
          throw new Error('get server menu error.')
        }
      }
    },
    initBreadcrumbs({commit, state}, currentRoute) {
      commit('setCurrentRoute', currentRoute);
      let breadcrumbs = generateBreadcrumb({menuPath: '/home', menuName: '首页', menuId: 'home_index'}, state.menuList, state.currentRoute); 
      commit('setBreadcrumbs', breadcrumbs);
    },
    async fetchAllMenus({commit, state}) {
      let res = await api.menu.getMenus();
      if (res.status === 200) {
        commit('setAllMenus', res.data);
      }
    }
  }
}
