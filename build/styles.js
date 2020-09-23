const path = require('path');
const slash = require('slash2');
const loaderUtils = require('loader-utils');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const getLessVariables = require('./utils/get-less-var');
const paths = require('./paths');

const resolve = _path => path.resolve(__dirname, '../', _path);

/* eslint-disable */
const loaders = {
  'style-loader': (options) => ({
    loader: 'style-loader',
    options: {
      injectType: options.injectType || 'styleTag',
      attributes: 'attributes' in options ? options.attributes : {},
      // localIdentName: options.localIdentName || '[name]_[local]_[hash:base64:5]',
    },
  }),
  'css-loader': (options) => ({
    loader: 'css-loader',
    options: {
      importLoaders: options.importLoaders || 2,
      sourceMap: 'sourceMap' in options ? options.sourceMap : false,
      modules: 'modules' in options ? options.modules : false,
      // localIdentName: options.localIdentName || '[name]_[local]_[hash:base64:5]',
    },
  }),
  'scss-loader': (options) => ({
    loader: 'sass-loader',
    options: {
      sourceMap: 'sourceMap' in options ? options.sourceMap : false,
    },
  }),
  'sass-loader': (options) => ({
    loader: 'sass-loader',
    options: {
      sourceMap: 'sourceMap' in options ? options.sourceMap : false,
      sassOptions: {
        indentedSyntax: true,
      },
    },
  }),
  'less-loader': (options) => ({
    loader: 'less-loader',
    options: {
      javascriptEnabled: true,
      globalVars: 'globalVars' in options ? options.globalVars : {},
      modifyVars: 'modifyVars' in options ? options.modifyVars : getLessVariables(resolve('src/styles/theme.less')),
      sourceMap: 'sourceMap' in options ? options.sourceMap : false,
    },
  }),
  'postcss-loader': (options) => ({
    loader: 'postcss-loader',
    options: {
      sourceMap: 'sourceMap' in options ? options.sourceMap : false,
    },
  }),
  'style-resources-loader': (options) => ({
    loader: 'style-resources-loader',
    options: {
      patterns: 'patterns' in options ? options.patterns : [],
    },
  }),
  'stylus-loader': (options) => ({
    loader: 'stylus-loader',
    options: {
      sourceMap: 'sourceMap' in options ? options.sourceMap : false,
      preferPathResolver: 'preferPathResolver' in options ? options.preferPathResolver : 'webpack',
    },
  }),
  'extract': ({ publicPath }) => ({
    loader: MiniCssExtractPlugin.loader,
    options: paths.publicUrlOrPath.startsWith('.') ? { publicPath: '../../' } : {},
  }),
};

const cssRules = (options) => {
  const cssArray = [];

  if (options.extract) {
    // cssArray.unshift(loaders.extract(options));
    cssArray.push(loaders.extract(options));
  }

  if (options.addStyleSheet) {
    cssArray.push(loaders['style-loader'](options));
  }

  cssArray.push(loaders['css-loader'](options));

  if (options.usePostCSS) {
    cssArray.push(loaders['postcss-loader'](options));
  }

  if (options.useLess) {
    cssArray.push(loaders['less-loader'](options));
  }

  if (options.useSass) {
    cssArray.push(loaders['sass-loader'](options));
  }

  if (options.useScss) {
    cssArray.push(loaders['scss-loader'](options));
  }

  if (options.useStylus) {
    cssArray.push(loaders['stylus-loader'](options));
  }

  if (options.useStyleResources) {
    cssArray.push(loaders['style-resources-loader'](options));
  }

  return cssArray;
};

const cssOneOf = (options = {}) => {
  const oneOf = [];

  if (options.modules) {
    oneOf.push(
      {
        resourceQuery: /module/,
        use: cssRules(options),
      },
      {
        test: /\.module\.\w+$/,
        use: cssRules(options),
      },
    );
  }

  oneOf.push({
    use: cssRules(options),
  });

  return oneOf;
};

const getStyleRules = (options) => {
  return [
    // css
    {
      test: /\.css$/,
      oneOf: cssOneOf(options),
      // Don't consider CSS imports dead code even if the
      // containing package claims to have no side effects.
      // Remove this when webpack adds a warning or an error for this.
      // See https://github.com/webpack/webpack/issues/6571
      // sideEffects: 'sideEffects' in options ? options.sideEffects : true,
    },
    // postcss
    {
      test: /\.p(ost)?css$/,
      oneOf: cssOneOf(options),
      // sideEffects: 'sideEffects' in options ? options.sideEffects : true,
    },
    // scss
    // {
    //   test: /\.scss$/,
    //   oneOf: cssOneOf({
    //     ...options,
    //     useScss: true,
    //     usePostCSS: true,
    //   }),
    // },
    // sass
    // {
    //   test: /\.sass$/,
    //   oneOf: cssOneOf({
    //     ...options,
    //     useSass: true,
    //     usePostCSS: true,
    //   }),
    // },
    // less
    {
      test: /\.less$/,
      oneOf: cssOneOf({
        ...options,
        useLess: true,
        useStyleResources: false,
      }),
      // sideEffects: 'sideEffects' in options ? options.sideEffects : true,
    },
    // stylus
    // {
    //   test: /\.styl(us)?$/,
    //   oneOf: cssOneOf({
    //     ...options,
    //     useStylus: true,
    //     // useStyleResources: false,
    //     usePostCSS: true,
    //   }),
    // },
  ];
};

/* eslint-enable */

const modules = {
  mode: 'local',
  localIdentName: '[path][name]__[local]--[hash:base64:5]',
  getLocalIdent: (context, localIdentName, localName, options) => {
    if (
      context.resourcePath.includes('node_modules') ||
      context.resourcePath.includes('global.less')
    ) {
      return localName;
    }

    const match = context.resourcePath.match(/src(.*)/);

    if (match && match[1]) {
      const antdProPath = match[1].replace('.less', '');
      const arr = slash(antdProPath)
        .split('/')
        .map((a) => a.replace(/([A-Z])/g, '-$1'))
        .map((a) => a.toLowerCase());
      const fileNameOrFolder = context.resourcePath.match(
        /index\.module\.(css|scss|sass)$/
      )
        ? '[folder]'
        : '[name]';

      const hash = loaderUtils.getHashDigest(
        path.posix.relative(context.rootContext, context.resourcePath) + localName,
        'md5',
        'base64',
        6
      );
      // Use loaderUtils to find the file or folder name
      const className = loaderUtils.interpolateName(
        context,
        fileNameOrFolder + '_' + localName + '__' + hash,
        options
      );
      // remove the .module that appears in every classname when based on the file.
      return className.replace('.module_', '_');
    }

    return localName;
  },
  context: path.resolve(__dirname, 'src'),
  hashPrefix: 'hash',
};

module.exports = {
  modules,
  getStyleRules,
};

