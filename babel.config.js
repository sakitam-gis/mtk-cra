module.exports = {
  presets: ['react-app'],
  plugins: [
    'lodash',
    'styled-components',
    '@babel/plugin-syntax-dynamic-import',
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
  ],
  env: {
    development: {
      only: ['src'],
      plugins: [
        // @link https://github.com/facebook/react/issues/16604#issuecomment-528663101
        // 'react-refresh/babel',
      ],
    },
    production: {
      only: ['src'],
      plugins: [
        'lodash',
        'transform-react-remove-prop-types',
        '@babel/plugin-transform-react-inline-elements',
        '@babel/plugin-transform-react-constant-elements',
      ],
    },
  },
};
