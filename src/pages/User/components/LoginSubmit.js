import { Button, Form } from 'antd';
import React from 'react';
import classNames from 'classnames';
import styles from './index.less';

const FormItem = Form.Item;

const LoginSubmit = ({ className, ...rest }) => {
  const clsString = classNames(className, styles.submitButton);
  return (
    <FormItem className={styles.formSubmit}>
      <Button size="large" className={clsString} type="primary" htmlType="submit" {...rest} />
    </FormItem>
  );
};

export default LoginSubmit;
