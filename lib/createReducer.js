"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

exports.default = function (routes, options) {
  var initial = {
    current: _extends({}, options.defaultRouteValues, {
      id: null,
      keys: null,
      path: null,
      redirect: null
    })
  };

  return function () {
    var routerState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initial;
    var action = arguments[1];

    switch (action.type) {
      case options.CHANGE_ROUTE:
        {
          var _action$payload = action.payload,
              id = _action$payload.id,
              keys = _action$payload.keys,
              path = _action$payload.path,
              redirect = _action$payload.redirect,
              customs = _objectWithoutProperties(_action$payload, ["id", "keys", "path", "redirect"]);

          return _extends({}, routerState, {
            current: _extends({}, routerState.current, customs, {
              id: id,
              keys: keys,
              path: path,
              redirect: redirect
            })
          });
        }

      default:
        {
          return routerState;
        }
    }
  };
};