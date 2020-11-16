import React from 'react';
import {
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

// TODO: custom Switch
// 1. keep alive
function render({
  route,
  opts,
  props,
}) {
  const routes = renderRoutes({
    ...opts,
    routes: route.routes || [],
  });
  const { component: Component, wrappers } = route;
  if (Component) {
    const defaultPageInitialProps = opts.isServer
      ? {}
      : window.g_initialProps;
    const newProps = {
      ...props,
      ...opts.extraProps,
      ...(opts.pageInitialProps || defaultPageInitialProps),
      route,
    };

    let ret = <Component {...newProps}>{routes}</Component>;

    // route.wrappers
    if (wrappers) {
      let len = wrappers.length - 1;
      while (len >= 0) {
        ret = React.createElement(wrappers[len], newProps, ret);
        len -= 1;
      }
    }

    return ret;
  }
  return routes;
}

function getRouteElement({ route, index, opts }) {
  const routeProps = {
    key: route.key || index,
    exact: route.exact,
    strict: route.strict,
    sensitive: route.sensitive,
    path: route.path,
  };

  if (route.redirect) {
    return <Redirect {...routeProps} from={route.path} to={route.redirect} />;
  }

  return (
    <Route
      {...routeProps}
      render={(props) => render({ route, opts, props })}
    />
  );
}

export default function renderRoutes(opts) {
  return opts.routes ? (
    <Switch>
      {opts.routes.map((route, index) =>
        getRouteElement({
          route,
          index,
          opts,
        }),
      )}
    </Switch>
  ) : null;
}
