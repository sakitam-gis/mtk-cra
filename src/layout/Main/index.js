import styles from './index.less';
import classnames from 'classnames';
import React from 'react';
import { connect } from 'dva';

const MainLayout = props => {
  const {
    children,
    // history,
    globalHistory,
  } = props;
  console.log('[main-layout]: ', globalHistory);

  return (
    <>
      <header className={styles.header}>header</header>
      <div
        className={classnames(styles.layout)}
      >
        <div className={styles.content}>
          {children}
        </div>
      </div>
      <footer className={styles.footer}>sakitam-gis@2020</footer>
    </>
  );
};

export default connect(({ map }) => ({
  globalHistory: map.globalHistory,
}))(MainLayout);
