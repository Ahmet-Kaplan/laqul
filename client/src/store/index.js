import Vue from 'vue'
import Vuex from 'vuex'

import app from './app'
import session from './session'
import showcase from './showcase'
import layoutDemo from './layoutDemo'

Vue.use(Vuex)

const Store = new Vuex.Store({
  modules: {
    app,
    session,
    showcase,
    layoutDemo
  }
})

if (process.env.DEV && module.hot) {
  module.hot.accept(['./showcase'], () => {
    const newShowcase = require('./showcase').default
    Store.hotUpdate({ modules: { showcase: newShowcase } })
  })
  module.hot.accept(['./layoutDemo'], () => {
    const newLayoutDemo = require('./layoutDemo').default
    Store.hotUpdate({ modules: { layoutDemo: newLayoutDemo } })
  })
}

export default Store
