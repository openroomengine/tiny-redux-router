import createHistory from 'history/createBrowserHistory'

import createRoutes from './createRoutes.js'
import createReducer from './createReducer.js'
import createEnhancer from './createEnhancer.js'
import createLink from './createLink.js'

const defaults = {
  history: createHistory(),
  CHANGE_ROUTE: '@@ROUTER/CHANGE_ROUTE',
  defaultRouteValues: {},
}

export default (routeDefs, options) => {
  options = {...defaults, ...options}

  const routes = createRoutes(routeDefs, options)

  const changeRoute = (id, inputKeys = null, redirect = null) => {
    // NOTE: router does not implement any kind of redirect functionality,
    // param there so other packages can implement it using this action creator
    // redirect should be null or an object with changeRoute arguments (id, keys, redirect)
    const route = routes[id]

    const payload = {
      ...options.defaultRouteValues,
      id: null,
      keys: null,
      path: options.history.location.pathname, // should override if a route matches
      redirect,
    }

    if (route) {
      const {keys, path, regex, resolve, ...customs} = route

      // override custom route property defaults with provided values
      Object.assign(payload, customs)

      payload.id = id
      if (route.keys) payload.keys = route.keys.reduce((keys, key) => (keys[key] = inputKeys[key]) && keys, {})
      payload.path = route.resolve(inputKeys)
    }

    return {
      type: options.CHANGE_ROUTE,
      payload,
    }
  }

  return {
    routes,
    changeRoute,
    routerReducer: createReducer(routes, options),
    routerEnhancer: createEnhancer(routes, changeRoute, options),
    link: createLink(routes, changeRoute, options),
  }
}
