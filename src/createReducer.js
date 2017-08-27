export default (routes, options) => {
  const initial = {
    current: {
      ...options.defaultRouteValues,
      id: null,
      keys: null,
      path: null,
      redirect: null,
    },
  }

  return (routerState = initial, action) => {
    switch (action.type) {
      case options.CHANGE_ROUTE: {
        const {id, keys, path, redirect, ...customs} = action.payload

        return {
          ...routerState,
          current: {
            ...routerState.current,
            ...customs,
            id,
            keys,
            path,
            redirect,
          },
        }
      }

      default: {
        return routerState
      }
    }
  }
}
