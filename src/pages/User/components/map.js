import { LockTwoTone, UserOutlined } from '@ant-design/icons';
import React from 'react';
import styles from './index.less';

export default {
  UserName: {
    props: {
      size: 'large',
      id: 'userName',
      prefix: (
        <UserOutlined
          style={{
            color: '#1890ff',
          }}
          className={styles.prefixIcon}
        />
      ),
      placeholder: '请输入账号',
    },
    rules: [
      {
        required: true,
        message: '请输入账号!',
      },
    ],
  },
  Password: {
    props: {
      size: 'large',
      prefix: <LockTwoTone className={styles.prefixIcon} />,
      type: 'password',
      id: 'password',
      placeholder: '请输入密码',
    },
    rules: [
      {
        required: true,
        message: '请输入密码!',
      },
    ],
  },
};
