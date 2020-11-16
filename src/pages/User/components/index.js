import { Form } from 'antd';
import React from 'react';
import classNames from 'classnames';
import LoginContext from './LoginContext';
import LoginItem from './LoginItem';
import styles from './index.less';

import LoginSubmit from './LoginSubmit';
const Login = (props) => {
  const { className } = props;

  React.Children.forEach(
    props.children,
    (child) => {
      if (!child) {
        // return;
      }
    },
  );
  return (
    <LoginContext.Provider>
      <div className={classNames(className, styles.form)}>
        <Form
          form={props.from}
          onFinish={(values) => {
            if (props.onSubmit) {
              props.onSubmit(values);
            }
          }}
        >
          {props.children}
        </Form>
      </div>
    </LoginContext.Provider>
  );
};

Login.Submit = LoginSubmit;

Login.UserName = LoginItem.UserName;
Login.Password = LoginItem.Password;
Login.Captcha = LoginItem.Captcha;

export default Login;
