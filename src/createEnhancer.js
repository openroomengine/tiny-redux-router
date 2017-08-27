export default (routes, changeRoute, options) => (createStore) => (reducer, initialState, enhancer) => {
  const {history} = options

  // create store
  const store = createStore(reducer, initialState, enhancer)

  // subscribe to store changes and update url
  store.subscribe(() => {
    const currentPath = store.getState().route.current.path

    if (currentPath && currentPath !== history.location.pathname) history.push(currentPath)
  })

  // put current route in store
  store.dispatch(changeRoute(
    ...parsePath(routes, history.location.pathname)
  ))

  // subscribe to url changes and dispatch actions
  history.listen(({pathname}) => {
    const currentPath = store.getState().route.current.path

    if (currentPath !== pathname) {
      store.dispatch(changeRoute(
        ...parsePath(routes, pathname),
      ))
    }
  })

  return {...store}
}

const parsePath = (routes, path) => {
  for (const id in routes) {
    const route = routes[id]
    const match = path.match(route.regex)

    // current route matches
    if (match) {
      const keys = route.keys
        ? route.keys.reduce((keys, key, i) => {
          keys[key] = match[i + 1] // skip first value of match (full match)
          return keys
        }, {})
        : null

      return [id, keys]
    }
  }

  // no match found
  return [null, null] // id, keys
}
