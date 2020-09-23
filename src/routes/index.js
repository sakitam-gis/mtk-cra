import React from 'react';
import loadable from '@loadable/component';
import { history } from '@/models';
import { routerRedux } from 'dva';
import renderRoutes from './renderRoutes';

const Router = routerRedux.ConnectedRouter;

const routes = [
  {
    path: '/',
    component: loadable(() =>
      import(/* webpackChunkName: "layouts" */ '../layout/Main/index'),
    ),
    routes: [
      {
        path: '/index',
        // component: loadable(() => import(/* webpackChunkName: "layouts__index" */ '../layout/Main/index')),
        // exact: true, // 嵌套路由在父级不能用exact
        routes: [
          {
            path: '/index/map',
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'index' */ '../pages/main'
              ),
            ),
          },
        ],
      },
      {
        path: '*',
        redirect: '/index/map',
      },
    ],
  },
  {
    path: '*',
    redirect: '/index/map',
  },
];

class RouterWrapper extends React.Component {
  unListen() {}

  constructor(props) {
    super(props);

    // route change handler
    // eslint-disable-next-line no-unused-vars
    function routeChangeHandler(location, action) {
      // plugins.applyForEach('onRouteChange', {
      //   initialValue: {
      //     routes,
      //     location,
      //     action,
      //   },
      // });
      // console.log(location, action);
    }

    this.unListen = history.listen(routeChangeHandler);
    const isDva =
      history.listen
        .toString()
        .indexOf('callback(history.location, history.action)') > -1;
    if (!isDva) {
      routeChangeHandler(history.location);
    }
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    const routers = renderRoutes({
      routes,
      ...props,
    });

    return <Router history={history}>{routers}</Router>;
  }
}

export { routes };

export default RouterWrapper;
