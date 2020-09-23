const fs = require('fs');
const path = require('path');
const stripeComments = require('strip-css-comments');

function trim(str) {
  if (!str) {
    return '';
  }
  return str.replace(/^\s+|\s+$/g, '');
}

function getContent(file) {
  let themeContent = fs.readFileSync(file, 'utf-8');
  themeContent = stripeComments(themeContent);
  const variables = {};
  themeContent.split('\n').forEach((item) => {
    if (trim(item).indexOf('//') === 0 || trim(item).indexOf('/*') === 0) {
      return;
    }

    // has comments
    if (item.indexOf('//') > 0) {
      item = trim(item.slice(0, item.indexOf('//')));
    }
    if (item.indexOf('/*') > 0) {
      item = trim(item.slice(0, item.indexOf('/*')));
    }

    const _pair = item.split(':');

    if (_pair.length < 2) {
      if (!/@import/.test(_pair[0])) {
        return;
      }
      const partFile = _pair[0]
        .replace(/;/g, '')
        .replace('@import', '')
        .replace(/'/g, '')
        .replace(/"/g, '')
        .replace(/\s+/g, '')
        .trim();
      const partPath = path.resolve(path.dirname(file), partFile);
      const partVariables = getContent(partPath);
      for (const i in partVariables) {
        variables[i] = partVariables[i];
      }
    } else {
      let key = _pair[0].replace('\r', '').replace('@', '');
      if (!key) return;
      key = key.trim();
      if (!/^[A-Za-z0-9_-]*$/.test(key)) {
        console.log(`[vux-loader] 疑似不合法命名，将被忽略：${key}`);
        return;
      }
      const value = _pair[1].replace(';', '').replace('\r', '').replace(/^\s+|\s+$/g, '');
      variables[key] = value;
    }
  });
  return variables;
}


module.exports = function getLessVariables(theme) {
  return getContent(theme);
};
