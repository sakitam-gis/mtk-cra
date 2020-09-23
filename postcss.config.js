module.exports = {
  plugins: {
    'postcss-import': {
      resolve(id) {
        if (id.charAt(0) === '~') {
          console.log(id);
          return id.substr(1);
        }
        return id;
      },
    },
    'postcss-url': {},
    'postcss-flexbugs-fixes': {},
    'autoprefixer': {}, // eslint-disable-line
    'postcss-preset-env': {
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
    },
    'postcss-normalize': {}
  },
};
