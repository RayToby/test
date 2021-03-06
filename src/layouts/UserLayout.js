import React, { Fragment } from 'react';
import { Link, Redirect, Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Icon, Layout } from 'antd';
import GlobalFooter from '../components/GlobalFooter';
import styles from './UserLayout.less';
import logo from '../assets/big_logo.png';
import { getRoutes } from '../utils/utils';

const { Sider, Content } = Layout;
const links = [
  {
    key: 'help',
    title: '帮助',
    href: '',
  },
  {
    key: 'privacy',
    title: '隐私',
    href: '',
  },
  {
    key: 'terms',
    title: '条款',
    href: '',
  },
];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2018 米橙提醒
  </Fragment>
);

class UserLayout extends React.PureComponent {
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '米橙提醒后台管理系统';
    if (routerData[pathname] && routerData[pathname].name) {
      // title = `${routerData[pathname].name} - Ant Design Pro`;
      title = '米橙提醒后台管理系统';
    }
    return title;
  }
  render() {
    const { routerData, match } = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.content}>
            {/* <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <img alt="logo" className={styles.logo} src={logo} />
                  <span className={styles.title}>Ant Design</span>
                </Link>
              </div>
              <div className={styles.desc}>Ant Design 是西湖区最具影响力的 Web 设计规范</div>
            </div> */}
              
                <div className={styles.logo1} key="logo">
                  <Link to="/" style={{justifyContent:'center'}}>
                    <img src={logo} alt="logo"/>
                    <h1>米橙提醒</h1>
                  </Link>
                </div>
             
                <Switch>
                  {getRoutes(match.path, routerData).map(item => (
                    <Route
                      key={item.key}
                      path={item.path}
                      component={item.component}
                      exact={item.exact}
                    />
                  ))}
                  <Redirect exact from="/user" to="/user/login" className={styles.login}/>
                </Switch>
             
          </div>
          {/* <GlobalFooter links={links} copyright={copyright} /> */}
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
