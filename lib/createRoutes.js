'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _pathToRegexp = require('path-to-regexp');

var _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (routeDefs, options) {
  var routes = {};

  for (var id in routeDefs) {
    var routeDef = routeDefs[id];

    // normalize route definition
    routeDef = routeDef instanceof Object ? routeDef : { path: routeDef };

    if (!routeDef.path) throw new Error('Route \'' + id + '\' should have a path.');

    // create route
    var route = routes[id] = _extends({}, options.defaultRouteValues, routeDef);

    route.keys = [];
    route.regex = (0, _pathToRegexp2.default)(route.path, route.keys);

    // parse route keys
    route.keys = route.keys.length ? route.keys.map(function (key) {
      return key.name;
    }) : null;

    // add resolve function
    route.resolve = _pathToRegexp2.default.compile(route.path);
  }

  return routes;
};