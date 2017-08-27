import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

const createLink = (routes, changeRoute, options) => (Child) => {
  // LINK
  const mapStateToProps = ({route}, {id, keys, matchRoute}) => ({
    active: matchRoute
      ? route.current.id === id
      : route.current.id === id && compareKeys(route.current.keys, keys),
  })

  const mapDispatchToProps = (dispatch, {id, keys, redirect}) => ({
    changeRoute: () => dispatch(changeRoute(id, keys, redirect)),
  })

  @connect(mapStateToProps, mapDispatchToProps)
  // hoc adds navigation functionality to Child's onClick
  class Link extends React.Component {
    constructor (props) {
      super(props)

      this.handleClick = this.handleClick.bind(this)
      this.nativeRefCallback = this.nativeRefCallback.bind(this)
    }

    handleClick (e) {
      const {changeRoute, linkProps} = this.props
      const {onClick} = linkProps

      // prevent refresh
      e.preventDefault()

      // change route
      changeRoute()

      // remove focus
      this.nativeRef && this.nativeRef.blur()

      // enable extending
      if (onClick) onClick(e)
    }

    nativeRefCallback (elem) {
      const {nativeRef} = this.props

      // store ref
      this.nativeRef = elem

      // enable extending
      if (nativeRef) nativeRef(elem)
    }

    render () {
      const {children, active, linkProps} = this.props

      return (
        <Child
          {...linkProps}
          active={active}
          onClick={this.handleClick}
          nativeRef={this.nativeRefCallback}
        >
          {children}
        </Child>
      )
    }

    static propTypes = {
      children: PropTypes.node.isRequired,
      linkProps: PropTypes.object.isRequired,
      changeRoute: PropTypes.func.isRequired,
      active: PropTypes.bool.isRequired,
      nativeRef: PropTypes.func,
    }
  }

  // MAPLINKPROPS
  // hoc for Link renames and groups props
  const MapLinkProps = ({to, redirect, matchRoute, children, nativeRef, ...linkProps}) => {
    // route id
    const id = to

    // route
    const route = routes[id]

    // route keys
    const keys = route.keys
      ? route.keys.reduce((keys, key, i) => {
        if (linkProps[key]) {
          keys[key] = linkProps[key]
        } else if (!route.regex.keys[i].optional) {
          console.error(`Key '${key}' is not defined for route '${id}'.`)
        }
        delete linkProps[key]
        return keys
      }, {})
      : null

    // href
    linkProps.href = route.resolve(keys)

    return (
      <Link
        id={id}
        keys={keys}
        redirect={redirect}
        linkProps={linkProps}
        matchRoute={matchRoute}
        nativeRef={nativeRef}
      >
        {children}
      </Link>
    )
  }

  MapLinkProps.propTypes = {
    children: PropTypes.node.isRequired,
    to: PropTypes.oneOf(Object.keys(routes)).isRequired,
    matchRoute: PropTypes.bool,
    nativeRef: PropTypes.func,
    redirect: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        id: PropTypes.oneOf(Object.keys(routes)).isRequired,
        keys: PropTypes.objectOf(PropTypes.string),
        // redirect, but no one is ever going to next it
      }),
    ]),
  }

  return MapLinkProps
}

const compareKeys = (a, b) => {
  // handle null
  if (!a || !b) return !a && !b

  const aKeys = Object.keys(a).filter((key) => a[key])
  const bKeys = Object.keys(b).filter((key) => b[key])

  // different amount of props, keys can't match
  if (aKeys.length !== bKeys.length) return false

  // find if there's key:value pairs that only appear in one object
  const largest = aKeys.length > bKeys.length ? aKeys : bKeys
  const rest = largest.filter((key) => a[key] !== b[key])

  // no keys in rest: key objects are the same
  return !rest.length
}

export default createLink
