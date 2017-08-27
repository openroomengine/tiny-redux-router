import pathRegex from 'path-to-regexp'

export default (routeDefs, options) => {
  const routes = {}

  for (const id in routeDefs) {
    let routeDef = routeDefs[id]

    // normalize route definition
    routeDef = routeDef instanceof Object ? routeDef : {path: routeDef}

    if (!routeDef.path) throw new Error(`Route '${id}' should have a path.`)

    // create route
    const route = routes[id] = {
      ...options.defaultRouteValues,
      ...routeDef,
    }

    route.keys = []
    route.regex = pathRegex(route.path, route.keys)

    // parse route keys
    route.keys = route.keys.length
      ? route.keys.map((key) => key.name)
      : null

    // add resolve function
    route.resolve = pathRegex.compile(route.path)
  }

  return routes
}
