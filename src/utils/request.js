import Request, { extend } from 'umi-request';
import { notification } from 'antd';

const { token, cancel } = Request.CancelToken.source();

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '参数异常。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  402: '鉴权信息缺失。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求过多过快导致请求资源被限。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

// eslint-disable-next-line no-unused-vars
const dataMessage = {
  200: '成功',
  400: '参数异常',
  401: '权限异常',
  407: '权限异常',
  408: '权限异常',
  402: '鉴权信息缺失',
  403: '鉴权信息错误',
  404: '空数据',
  405: '请求过多过快导致请求资源被限',
  500: '服务器异常'
};

export const httpPending = {};
const removeHttpPending = (config, isRemove = false) => {
  if (!config || !config.url) {
    return false;
  }
  const key = config.url;
  let val = '';
  if ('data' in config) {
    val = typeof config.data === 'object' ? JSON.stringify(config.data) : config.data;
  }
  if ('params' in config) {
    val += typeof config.params === 'object' ? JSON.stringify(config.params) : config.params;
  }

  if (val && httpPending[key] === val) {
    if (isRemove) {
      delete httpPending[key];
    } else {
      cancel();
      console.warn(`[${key}]: repeated http request`);
    }
    return true;
  }
  httpPending[key] = val;
  return false;
};

/**
 * 异常处理程序
 */
const errorHandler = (error) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      // duration: 0,
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      // duration: 0,
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }

  removeHttpPending({
    url: response?.url,
  }, true);

  return response;
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  prefix: window.prefix || '',
  errorHandler, // 默认错误处理
  credentials: 'same-origin', // 默认请求是否带上cookie
  // ’useCache‘ The GET request would be cache in ttl milliseconds when 'useCache' is true.
  // The cache key would be 'url + params + method'.
  useCache: false, // default

  // 'ttl' cache duration（milliseconds），0 is infinity
  ttl: 60000,
  validateCache: (url, options) => options.method.toLowerCase() === 'get',
});

request.interceptors.request.use((url, options) => {
  // 防止重复提交
  if (removeHttpPending({
    url,
  }, false)) {
    options.cancelToken = token;
  }

  return {
    url,
    options,
  };
});

request.interceptors.response.use(response => {
  removeHttpPending({
    url: response?.url,
  });
  return response;
});

export default request;
