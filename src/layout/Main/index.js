import styles from './index.less';
import classnames from 'classnames';
import { Button, Tooltip } from 'antd';
import React from 'react';
import { connect } from 'dva';
import { LogoutOutlined } from '@ant-design/icons';

const ButtonGroup = Button.Group;

function renderButton (props) {
  // with you button action
 return <ButtonGroup>
   <Button type="primary">Map</Button>
   {
     props?.userData?.userType === '1' && (
       <>
         <Button type="primary">Settings</Button>
         <Button type="primary">Analysis</Button>
       </>
     )
   }
 </ButtonGroup>;
}

const MainLayout = props => {
  const {
    children,
    history,
    globalHistory,
  } = props;
  console.log('[main-layout]: ', globalHistory);

  const logout = function() {
    history.push('/user/login')
  }

  return (
    <>
      <header className={styles.header}>
        {
          renderButton(props)
        }
        <Tooltip title="Logout" className={styles.logout}>
          <Button type="primary" shape="circle" icon={<LogoutOutlined />} onClick={logout} />
        </Tooltip>
      </header>
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
  userData: map.userData,
}))(MainLayout);
