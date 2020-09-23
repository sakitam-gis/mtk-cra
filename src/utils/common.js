import isNaN from 'lodash/isNaN';

let _isSafari = null;
/**
 * Returns true when run in WebKit derived browsers.
 * This is used as a workaround for a memory leak in Safari caused by using Transferable objects to
 * transfer data between WebWorkers and the main thread.
 * https://github.com/mapbox/mapbox-gl-js/issues/8771
 *
 * This should be removed once the underlying Safari issue is fixed.
 *
 * @private
 * @param scope {WindowOrWorkerGlobalScope} Since this function is used both on the main thread and WebWorker context,
 *      let the calling scope pass in the global scope object.
 * @returns {boolean}
 */
export function isSafari(scope) {
  if (_isSafari == null) {
    const userAgent = scope.navigator ? scope.navigator.userAgent : null;
    _isSafari = !!scope.safari ||
      !!(userAgent && (/\b(iPad|iPhone|iPod)\b/.test(userAgent) || (!!userAgent.match('Safari') && !userAgent.match('Chrome'))));
  }
  return _isSafari;
}

export function isWorker() {
  // eslint-disable-next-line no-restricted-globals
  return typeof WorkerGlobalScope !== 'undefined' && typeof self !== 'undefined' &&
    // eslint-disable-next-line no-restricted-globals,no-undef
    self instanceof WorkerGlobalScope;
}

export function bindAll(fns, context) {
  fns.forEach((fn) => {
    if (!context[fn]) { return; }
    context[fn] = context[fn].bind(context);
  });
}

// eslint-disable-next-line consistent-return
export function asyncAll(array, fn, callback) {
  if (!array.length) { return callback(null, []); }
  let remaining = array.length;
  const results = new Array(array.length);
  let error = null;
  array.forEach((item, i) => {
    fn(item, (err, result) => {
      if (err) error = err;
      results[i] = result; // https://github.com/facebook/flow/issues/2123
      if (--remaining === 0) callback(error, results);
    });
  });
}

/**
 * 检测 localStorage 是否超出容量
 * @param clear [为 `true` 时当容量不足时自动清空]
 * @returns {boolean}
 */
export function checkLocalStorage(clear) {
  try {
    localStorage.setItem('checklocalstorage', String(1));
    localStorage.removeItem('checklocalstorage');
    return true;
  } catch (e) {
    // eslint-disable-next-line no-unused-expressions
    clear && localStorage.clear();
    return false;
  }
}

/**
 * 解析require.context
 * @param context
 * @param def [是否默认导出]
 * @param ignore [忽略文件]
 * @returns {Array}
 */
export function getContext(context, def = true, ignore) {
  const children = [];
  context.keys().forEach((key) => {
    if (key !== ignore) {
      const arr = def ? context(key).default : context(key);
      if (arr) {
        children.push(arr);
      }
    }
  });
  return children;
}

/**
 * 添加字体图标样式(统一管理)
 * @param key
 */
export function addIconfontLink(key) {
  if (key && !document.head.querySelector(`link[href="//at.alicdn.com/t/${key}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `//at.alicdn.com/t/${key}`;
    document.head.appendChild(link);
  }
}

/**
 * 生成随机字符串
 * @returns {*}
 */
export function uuid(noBit = false) {
  function b(a) {
    // eslint-disable-next-line no-mixed-operators,no-bitwise
    return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -[1e3] + -4e3 + -8e3 + -1e11).replace(/[018]/g, b);
  }
  return noBit ? b().replace(/-/g, '') : b();
}

/**
 * 缓存一个标识
 * @param obj
 * @returns {*}
 */
export function stamp (obj) {
  const key = '_event_id_';
  obj[key] = obj[key] || (uuid());
  return obj[key];
}

export function omit(obj, fields) {
  const shallowCopy = {
    ...obj,
  };
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < fields.length; i++) {
    const key = fields[i];
    delete shallowCopy[key];
  }
  return shallowCopy;
}

export function calcMinMax(array) {
  let min = Infinity;
  let max = Infinity;
  // @from: https://stackoverflow.com/questions/13544476/how-to-find-max-and-min-in-array-using-minimum-comparisons
  for (let i = 0; i < array.length; i++) {
    const val = array[i];

    if (min === Infinity) {
      min = val;
    } else if (max === Infinity) {
      max = val;
      // update min max
      // 1. Pick 2 elements(a, b), compare them. (say a > b)
      min = Math.min(min, max);
      max = Math.max(min, max);
    } else {
      // 2. Update min by comparing (min, b)
      // 3. Update max by comparing (max, a)
      min = Math.min(val, min);
      max = Math.max(val, max);
    }
  }
  return [min, max];
}

export function indexFor (m, min, max, colorScale) {
  return Math.max(0, Math.min((colorScale.length - 1),
    Math.round((m - min) / (max - min) * (colorScale.length - 1))));
}

const pi = Math.PI / 180;

export function toRadian(d) {
  return d * pi;
}

export function toDegree(r) {
  return r / pi;
}

export function wrap(n, min, max) {
  if (n === max || n === min) {
    return n;
  }
  const d = max - min;
  const w = ((n - min) % d + d) % d + min;
  return w;
}

export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

export function closeLoading(loading) {
  loading && loading();
}

export function createMarkerDom(innerHTML) {
  const el = document.createElement('div');

  el.innerHTML = `${innerHTML}`;

  return el.firstChild;
}

/**
 * load image by url
 * @param src
 * @returns {Promise<Image>}
 */
export function loadImage (src) {
  return new Promise(((resolve, reject) => {
    if (!src) {
      reject(new Event('url is null'));
    }
    const image = new Image();

    image.crossOrigin = 'anonymous';

    image.onload = () => {
      resolve(image);
    };
    image.onerror = reject;

    image.src = src;

    if (image.complete) {
      resolve(image);
    }
  }));
}

function getSearch (url) {
  const strArr = url.split('?');
  if (strArr.length === 0) {
    return '';
  }
  return strArr[strArr.length - 1];
}

/**
 * 获取查询参数
 * TODO: 需要兼容hash和history模式
 * @param name
 * @returns {string}
 */
export function getQueryString(name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
  // eslint-disable-next-line no-restricted-globals
  const r = location.search.substr(1).match(reg) || getSearch(location.hash.substr(1)).match(reg);
  if (r !== null) return unescape(r[2]);
  return '';
}

export function isValid(val) {
  return val !== null && val !== undefined && !isNaN(val) && val !== Infinity;
}

export function lerp(a, b, x) {
  return a + x * (b - a);
}

export function modulo(a, b) {
  const r = a % b;
  return r * b < 0 ? r + b : r;
}

export function padNumber(number, width, optPrecision) {
  const numberString = optPrecision !== undefined ? number.toFixed(optPrecision) : `${  number}`;
  let decimal = numberString.indexOf('.');
  decimal = decimal === -1 ? numberString.length : decimal;
  return decimal > width ? numberString : new Array(1 + width - decimal).join('0') + numberString;
}

export function degreesToStringHDMS(hemispheres, degrees, optFractionDigits) {
  const normalizedDegrees = modulo(degrees + 180, 360) - 180;
  const x = Math.abs(3600 * normalizedDegrees);
  const dflPrecision = optFractionDigits || 0;
  const precision = 10 ** dflPrecision;
  let deg = Math.floor(x / 3600);
  let min = Math.floor((x - deg * 3600) / 60);
  let sec = x - (deg * 3600) - (min * 60);
  sec = Math.ceil(sec * precision) / precision;
  if (sec >= 60) {
    sec = 0;
    min += 1;
  }
  if (min >= 60) {
    min = 0;
    deg += 1;
  }
  return `${deg  }\u00b0 ${  padNumber(min, 2)  }\u2032 ${
    padNumber(sec, 2, dflPrecision)  }\u2033${
    normalizedDegrees === 0 ? '' : ` ${  hemispheres.charAt(normalizedDegrees < 0 ? 1 : 0)}`}`;
}

export function toStringHDMS(coordinate, optFractionDigits) {
  if (coordinate) {
    return `${degreesToStringHDMS('NS', coordinate[1], optFractionDigits)  } ${
      degreesToStringHDMS('EW', coordinate[0], optFractionDigits)}`;
  }
  return '';
}

/**
 * Decimal adjustment of a number.
 *
 * @param {String}  type  The type of adjustment.
 * @param {Number}  value The number.
 * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
 * @returns {Number}      The adjusted value.
 */
function decimalAdjust(type, value, exp) {
  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0) {
    // @ts-ignore
    return Math[type](value);
  }
  value = +value;
  exp = +exp;
  // If the value is not a number or the exp is not an integer...
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  }
  // Shift
  value = value.toString().split('e');
  value = Math[type](+(`${value[0]}e${value[1] ? (+value[1] - exp) : -exp}`));
  // Shift back
  value = value.toString().split('e');
  return +(`${value[0]}e${value[1] ? (+value[1] + exp) : exp}`);
}

export function round10(value, exp) {
  return decimalAdjust('round', value, exp);
}

export function floor10(value, exp) {
  return decimalAdjust('floor', value, exp);
}

export function ceil10(value, exp) {
  return decimalAdjust('ceil', value, exp);
}

export function checkZero(val) {
  return val === 0;
}
