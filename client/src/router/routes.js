
import authenticationPages from './authentication'
import dashboardPages from './dashboard'
import categories from './assets/categories'
import LayoutShowcase from './layouts/showcase'

const routes = [
  {
    path: '/',
    caseSensitive: true,
    pathToRegexOptions: { strict: true, sensitive: true },
    component: () => import('layouts/Authentication'),
    // component: () => import('pages/landing'),
    meta: { requiresAuth: false },
    children: authenticationPages
  },

  {
    path: '/Panel',
    caseSensitive: true,
    pathToRegexOptions: { strict: true, sensitive: true },
    component: () => import('layouts/Dashboard'),
    meta: { requiresAuth: true },
    children: dashboardPages
  }
]

function lazyLoad (path, meta) {
  return {
    path,
    // caseSensitive: true,
    // pathToRegexOptions: { strict: true, sensitive: true },
    meta: { requiresAuth: true },
    component: () => import('pages/showcase/' + path)
  }
}

const showcase = {
  path: '/showcase',
  component: LayoutShowcase,
  children: [
    {
      path: '',
      meta: {
        title: 'Quasar Showcase',
        hash: '/showcase',
        icon: 'layers',
        backRoute: '/'
      },
      component: () => import('pages/showcase/index')
    }
  ]
}

categories.forEach(category => {
  if (category.extract) {
    return
  }
  category.features.forEach(feature => {
    let path = category.hash + '/' + feature.hash

    if (!feature.tabs) {
      showcase.children.push(lazyLoad(path, feature))
      return
    }

    feature.tabs.forEach(tab => {
      let subpath = path + '/' + tab.hash
      showcase.children.push(lazyLoad(subpath, {
        title: tab.title,
        hash: '/' + path,
        iframeTabs: feature.iframeTabs,
        icon: feature.icon,
        tabs: feature.tabs
      }))
    })

    routes.push({
      path: '/showcase/' + path,
      redirect: '/showcase/' + path + '/' + feature.tabs[0].hash
    })
  })
})

routes.push(showcase)
routes.push({
  path: '/showcase/layout-demo',
  component: () => import('layouts/layout-demo'),
  children: [
    {path: 'play-with-layout', component: () => import('pages/layout-demo/play-with-layout')},
    {path: 'drawer-panels', component: () => import('pages/layout-demo/drawer-panels')},
    {path: 'page-sticky', component: () => import('pages/layout-demo/page-sticky')},
    {path: 'floating-action-button', component: () => import('pages/layout-demo/floating-action-button')}
  ]
})
routes.push(
  { // Always leave this as last one
    name: 'pages.errors.e404',
    path: '*',
    component: () => import('pages/404')
  }
)

export default routes
