import styles from './index.less';
import React from 'react';
import { connect } from 'dva';

const UserLayout = props => {
  const {
    children,
  } = props;

  return (
    <>
      <div className={styles.layout}>
        {children}
      </div>
    </>
  );
};

export default connect()(UserLayout);
