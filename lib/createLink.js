'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = require('react-redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var createLink = function createLink(routes, _changeRoute, options) {
  return function (Child) {
    var _dec, _class;

    // LINK
    var mapStateToProps = function mapStateToProps(_ref, _ref2) {
      var route = _ref.route;
      var id = _ref2.id,
          keys = _ref2.keys,
          matchRoute = _ref2.matchRoute;
      return {
        active: matchRoute ? route.current.id === id : route.current.id === id && compareKeys(route.current.keys, keys)
      };
    };

    var mapDispatchToProps = function mapDispatchToProps(dispatch, _ref3) {
      var id = _ref3.id,
          keys = _ref3.keys,
          redirect = _ref3.redirect;
      return {
        changeRoute: function changeRoute() {
          return dispatch(_changeRoute(id, keys, redirect));
        }
      };
    };

    // hoc adds navigation functionality to Child's onClick
    var Link = (_dec = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), _dec(_class = function (_React$Component) {
      _inherits(Link, _React$Component);

      function Link(props) {
        _classCallCheck(this, Link);

        var _this = _possibleConstructorReturn(this, (Link.__proto__ || Object.getPrototypeOf(Link)).call(this, props));

        _this.handleClick = _this.handleClick.bind(_this);
        _this.nativeRefCallback = _this.nativeRefCallback.bind(_this);
        return _this;
      }

      _createClass(Link, [{
        key: 'handleClick',
        value: function handleClick(e) {
          var _props = this.props,
              changeRoute = _props.changeRoute,
              linkProps = _props.linkProps;
          var onClick = linkProps.onClick;

          // prevent refresh

          e.preventDefault();

          // change route
          changeRoute();

          // remove focus
          this.nativeRef && this.nativeRef.blur();

          // enable extending
          if (onClick) onClick(e);
        }
      }, {
        key: 'nativeRefCallback',
        value: function nativeRefCallback(elem) {
          var nativeRef = this.props.nativeRef;

          // store ref

          this.nativeRef = elem;

          // enable extending
          if (nativeRef) nativeRef(elem);
        }
      }, {
        key: 'render',
        value: function render() {
          var _props2 = this.props,
              children = _props2.children,
              active = _props2.active,
              linkProps = _props2.linkProps;


          return _react2.default.createElement(
            Child,
            _extends({}, linkProps, {
              active: active,
              onClick: this.handleClick,
              nativeRef: this.nativeRefCallback
            }),
            children
          );
        }
      }]);

      return Link;
    }(_react2.default.Component)) || _class);

    // MAPLINKPROPS
    // hoc for Link renames and groups props

    var MapLinkProps = function MapLinkProps(_ref4) {
      var to = _ref4.to,
          redirect = _ref4.redirect,
          matchRoute = _ref4.matchRoute,
          children = _ref4.children,
          nativeRef = _ref4.nativeRef,
          linkProps = _objectWithoutProperties(_ref4, ['to', 'redirect', 'matchRoute', 'children', 'nativeRef']);

      // route id
      var id = to;

      // route
      var route = routes[id];

      // route keys
      var keys = route.keys ? route.keys.reduce(function (keys, key, i) {
        if (linkProps[key]) {
          keys[key] = linkProps[key];
        } else if (!route.regex.keys[i].optional) {
          console.error('Key \'' + key + '\' is not defined for route \'' + id + '\'.');
        }
        delete linkProps[key];
        return keys;
      }, {}) : null;

      // href
      linkProps.href = route.resolve(keys);

      return _react2.default.createElement(
        Link,
        {
          id: id,
          keys: keys,
          redirect: redirect,
          linkProps: linkProps,
          matchRoute: matchRoute,
          nativeRef: nativeRef
        },
        children
      );
    };

    return MapLinkProps;
  };
};

var compareKeys = function compareKeys(a, b) {
  // handle null
  if (!a || !b) return !a && !b;

  var aKeys = Object.keys(a).filter(function (key) {
    return a[key];
  });
  var bKeys = Object.keys(b).filter(function (key) {
    return b[key];
  });

  // different amount of props, keys can't match
  if (aKeys.length !== bKeys.length) return false;

  // find if there's key:value pairs that only appear in one object
  var largest = aKeys.length > bKeys.length ? aKeys : bKeys;
  var rest = largest.filter(function (key) {
    return a[key] !== b[key];
  });

  // no keys in rest: key objects are the same
  return !rest.length;
};

exports.default = createLink;