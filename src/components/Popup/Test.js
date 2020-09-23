import React, { useMemo } from 'react';
import classnames from 'classnames';
import styles from './index.less';

export default function Test(props) {
  const { className } = props;
  const classNames = useMemo(() => classnames('test-popup', className), [className]);

  return (<div className={classNames}>
    <h2 className={styles.title}>{props.label}</h2>
    {props.label}
  </div>);
}
