class Store {
  constructor(options) {
    this.store = window.localStorage;
    this.prefix = options.prefix || 'fms-vis-';
  }

  set(key, value, fn) {
    try {
      value = JSON.stringify(value);
    } catch (e) {
      // value = value
    }

    this.store.setItem(this.prefix + key, value);

    fn && fn();
  }

  // eslint-disable-next-line no-unused-vars
  get(key, fn) {
    if (!key) {
      throw new Error('没有找到key。');
    }
    if (typeof key === 'object') {
      throw new Error('key不能是一个对象。');
    }
    let value = this.store.getItem(this.prefix + key);
    if (value !== null) {
      try {
        value = JSON.parse(value);
      } catch (e) {
        // value = value
      }
    }

    return value;
  }

  remove(key) {
    this.store.removeItem(this.prefix + key);
  }
}

export default (options = {}) => new Store(options);
