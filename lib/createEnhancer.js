"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = function (routes, changeRoute, options) {
  return function (createStore) {
    return function (reducer, initialState, enhancer) {
      var history = options.history;

      // create store

      var store = createStore(reducer, initialState, enhancer);

      // subscribe to store changes and update url
      store.subscribe(function () {
        var currentPath = store.getState().route.current.path;

        if (currentPath && currentPath !== history.location.pathname) history.push(currentPath);
      });

      // put current route in store
      store.dispatch(changeRoute.apply(undefined, _toConsumableArray(parsePath(routes, history.location.pathname))));

      // subscribe to url changes and dispatch actions
      history.listen(function (_ref) {
        var pathname = _ref.pathname;

        var currentPath = store.getState().route.current.path;

        if (currentPath !== pathname) {
          store.dispatch(changeRoute.apply(undefined, _toConsumableArray(parsePath(routes, pathname))));
        }
      });

      return _extends({}, store);
    };
  };
};

var parsePath = function parsePath(routes, path) {
  var _loop = function _loop(id) {
    var route = routes[id];
    var match = path.match(route.regex);

    // current route matches
    if (match) {
      var keys = route.keys ? route.keys.reduce(function (keys, key, i) {
        keys[key] = match[i + 1]; // skip first value of match (full match)
        return keys;
      }, {}) : null;

      return {
        v: [id, keys]
      };
    }
  };

  for (var id in routes) {
    var _ret = _loop(id);

    if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
  }

  // no match found
  return [null, null]; // id, keys
};