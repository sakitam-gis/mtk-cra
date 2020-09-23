import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    font-family: "微软雅黑", 'Avenir', Helvetica, Arial, sans-serif;
    font-size: 14px;
  }

  * {
    box-sizing: border-box;
  }

  ul {
    list-style: none;
  }

  ul, li {
    margin: 0;
    padding: 0;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
  }

  :focus {
    outline: none;
  }

  a {
    text-decoration: none;
    color: #2a2a2a;
  }

  body.fontLoaded {
    font-family: sans-serif, 'Open Sans', 'Helvetica Neue', Helvetica, Arial;
  }

  #app {
    min-height: 100%;
    min-width: 100%;
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
    font-family: PingFangSC-Regular,PingFang SC,Avenir,Helvetica,Arial,sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 12px;
    color: #3a3a3a;
  }

  /* scrollbar */
  ::-webkit-scrollbar-thumb {
    background-color: #999;
    outline: none;
    border: 1px solid #999;
  }

  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  ::-webkit-scrollbar-track-piece {
    background-color: #f3f3f3;
    -webkit-border-radius: 0;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #018EE8;
    border-color: #018EE8;
  }
`;

export default GlobalStyle;
