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
        return {
          ...routerState,
          current: action.payload,
        }
      }

      default: {
        return routerState
      }
    }
  }
}
