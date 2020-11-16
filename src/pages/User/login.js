import styles from './login.less';
import { Alert, Checkbox, Button, Modal } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import LoginComponents from './components';

const { UserName, Password, Submit } = LoginComponents;

@connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))
class Login extends Component {
  constructor (props, context) {
    super(props, context);
    this.state = {
    };
  }

  componentDidMount() {
  }

  changeAutoLogin = (e) => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  showModel = () => {
    Modal.info({
      title: '请联系系统管理员重置密码',
      content: (
        <div>
          <p>本系统暂时未开放自行重置密码操作，如果确实忘记密码请联系系统管理员进行密码重置。</p>
        </div>
      ),
      okText: '确定',
      onOk() {},
    });
  };

  handleSubmit = (values) => {
    console.log('login')
    const { dispatch, history } = this.props;
    dispatch({
      type: 'map/login',
      payload: {
        ...values,
        password: values.password,
      },
      callback: (flag) => {
        if (flag) {
          history.push('/index/map')
        }
      },
    });
  };

  render() {
    const { submitting } = this.props;
    const { autoLogin } = this.state;
    return (
      <div className={styles.loginMain}>
        <h3 className={styles.loginHeader}>xxxx</h3>
        <LoginComponents
          onSubmit={this.handleSubmit}
          ref={(form) => {
            this.loginForm = form;
          }}
        >
          <UserName
            name="userName"
            placeholder="用户名"
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          />
          <Password
            name="password"
            placeholder="密码"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
            onPressEnter={e => {
              e.preventDefault();
              // eslint-disable-next-line no-unused-expressions
              this.loginForm && this.loginForm.validateFields(this.handleSubmit);
            }}
          />
          <div className={styles.actionWarp}>
            <Checkbox
              style={{
                color: '#fff',
              }}
              checked={autoLogin}
              onChange={this.changeAutoLogin}>
              下次自动登录
            </Checkbox>
            <Button
              style={{
                color: '#fff',
              }}
              type="link"
              ghost className={styles.passwordAction}
              onClick={() => this.showModel()}
            >
              忘记密码
            </Button>
          </div>
          <Submit loading={submitting}>登录</Submit>
        </LoginComponents>
      </div>
    );
  }
}

export default Login;
