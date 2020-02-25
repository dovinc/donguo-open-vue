import { constantRoutes } from '@/router'

import { isURL } from '@/utils/validate'

/* Layout */
import Layout from '@/layout'
/**
 * 通过配置文件确定是否懒加载，用于vue-router.addRoutes动态加载后端路由（菜单Menu）:
 * 生产环境prod 懒加载require
 * 开发环境dev  非懒加载import
 */
const _import = require('@/_import/_import_' + process.env.VUE_APP_LOADING_MODE)

// /**
//  * Use meta.role to determine if the current user has permission
//  * @param roles
//  * @param route
//  */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }

// /**
//  * Filter asynchronous routing tables by recursion
//  * @param routes asyncRoutes
//  * @param roles
//  */
// export function filterAsyncRoutes(routes, roles) {
//   const res = []

//   routes.forEach(route => {
//     const tmp = { ...route }
//     if (hasPermission(roles, tmp)) {
//       if (tmp.children) {
//         tmp.children = filterAsyncRoutes(tmp.children, roles)
//       }
//       res.push(tmp)
//     }
//   })

//   return res
// }

const state = {
  permissions: [],
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  },
  SET_MENU_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, menuList) {
    return new Promise(resolve => {
      const childrenRoutes = []
      getAsyncRoutes(menuList, childrenRoutes)
      // 404 page must be placed at the end !!!
      var dynamicRoutes = [{
        path: '/dynamic',
        component: Layout
      }]
      dynamicRoutes[0].children = childrenRoutes
      dynamicRoutes.push({ path: '*', redirect: '/404', hidden: true })
      commit('SET_MENU_ROUTES', childrenRoutes)
      resolve(dynamicRoutes)
    })
  },
  setPermissions({ commit }, permissions) {
    return new Promise(resolve => {
    // 临时将权限设置 放在此处
      commit('SET_PERMISSIONS', permissions)
      resolve(permissions)
    })
  }
}

/**
 * 获取异步Menu（路由）
 * @param {*} menuList 菜单列表 后端获取或mock
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function getAsyncRoutes(menuList = [], routes = []) {
  for (var i = 0; i < menuList.length; i++) {
    // 当前循环中的menu
    const currentMenu = menuList[i]
    if (!menuList[i].url || !/\S/.test(menuList[i].url)) {
      currentMenu.url = ''
    }
    currentMenu.url = currentMenu.url.replace(/^\//, '')
    var route = {
      path: '/' + currentMenu.path,
      component: _import('dir-route-fix/index'),
      name: currentMenu.path,
      // redirect: 'noRedirect',
      meta: {
        menuId: currentMenu.menuId,
        title: currentMenu.name,
        icon: currentMenu.icon || '',
        isDynamic: true,
        isTab: true,
        iframeUrl: ''
      }
    }
    // url以http[s]://开头, 通过iframe展示
    if (isURL(currentMenu.url)) {
      route['path'] = `i-${currentMenu.menuId}`
      route['name'] = `i-${currentMenu.menuId}`
      route['meta']['iframeUrl'] = currentMenu.url
    } else {
      try {
        if (currentMenu.url && currentMenu.url !== '') {
          const component = _import(`${currentMenu.url}`)
          route['component'] = component
        } else {
          route['redirect'] = 'noRedirect'
        }
      } catch (e) {
        console.log('err:' + e)
      }
    }
    if (currentMenu.menuList && currentMenu.menuList.length >= 1) {
      // 拥有子路由，则递归调用
      const childrenRoutes = []
      getAsyncRoutes(currentMenu.menuList, childrenRoutes)
      route.children = childrenRoutes
    }
    routes.push(route)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
