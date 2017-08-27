'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createBrowserHistory = require('history/createBrowserHistory');

var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);

var _createRoutes = require('./createRoutes.js');

var _createRoutes2 = _interopRequireDefault(_createRoutes);

var _createReducer = require('./createReducer.js');

var _createReducer2 = _interopRequireDefault(_createReducer);

var _createEnhancer = require('./createEnhancer.js');

var _createEnhancer2 = _interopRequireDefault(_createEnhancer);

var _createLink = require('./createLink.js');

var _createLink2 = _interopRequireDefault(_createLink);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var defaults = {
  history: (0, _createBrowserHistory2.default)(),
  CHANGE_ROUTE: '@@ROUTER/CHANGE_ROUTE',
  defaultRouteValues: {}
};

exports.default = function (routeDefs, options) {
  options = _extends({}, defaults, options);

  var routes = (0, _createRoutes2.default)(routeDefs, options);

  var changeRoute = function changeRoute(id) {
    var inputKeys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var redirect = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    // NOTE: router does not implement any kind of redirect functionality,
    // param there so other packages can implement it using this action creator
    // redirect should be null or an object with changeRoute arguments (id, keys, redirect)
    var route = routes[id];

    var payload = _extends({}, options.defaultRouteValues, {
      id: null,
      keys: null,
      path: options.history.location.pathname, // should override if a route matches
      redirect: redirect
    });

    if (route) {
      var keys = route.keys,
          path = route.path,
          regex = route.regex,
          resolve = route.resolve,
          customs = _objectWithoutProperties(route, ['keys', 'path', 'regex', 'resolve']);

      // override custom route property defaults with provided values


      Object.assign(payload, customs);

      payload.id = id;
      if (route.keys) payload.keys = route.keys.reduce(function (keys, key) {
        return (keys[key] = inputKeys[key]) && keys;
      }, {});
      payload.path = route.resolve(inputKeys);
    }

    return {
      type: options.CHANGE_ROUTE,
      payload: payload
    };
  };

  return {
    routes: routes,
    changeRoute: changeRoute,
    routerReducer: (0, _createReducer2.default)(routes, options),
    routerEnhancer: (0, _createEnhancer2.default)(routes, changeRoute, options),
    link: (0, _createLink2.default)(routes, changeRoute, options)
  };
};