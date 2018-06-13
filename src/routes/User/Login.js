import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Checkbox, Alert, Icon, message } from 'antd';
import Login from 'components/Login';
import styles from './Login.less';
import fetch from '../../utils/request';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  state = {
    type: 'account',
    status: 'error',
    autoLogin: true,
    message: ''
  };

  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    const { type, status } = this.state;
    if (!err) {
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
          status,
        },
        callback: (res) => {
          if(res && res.code == '-1'){
            if(res.message == '用户名或密码错误') {
              this.setState({
                submitting: false,
                message: res.message,
              });
            }else{
              this.setState({
                message: res && res.message,
              });
            }
              
          }
        }
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  render() {
    const { login } = this.props;
    const { submitting } = this.state;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
          <h3 style={{ color: '#1D66A2', fontSize: 24, fontFamily: 'Helvetica', marginBottom: 24}}>米橙提醒后台管理登录</h3>
          {login.status === 'error' &&
            login.type === 'account' &&
            !submitting &&
            this.renderMessage(this.state.message)}
          <UserName name="userName" placeholder="admin" />
          <Password name="passWord" placeholder="111111" />
          {/* <Tab key="mobile" tab="手机号登录">
            {login.status === 'error' &&
              login.type === 'mobile' &&
              !login.submitting &&
              this.renderMessage('验证码错误')}
            <Mobile name="mobile" />
            <Captcha name="captcha" />
          </Tab> */}
          <div>
            {/* <Checkbox checked={this.state.autoLogin} onChange={this.changeAutoLogin}>
              自动登录
            </Checkbox> */}
            {/* <a style={{ float: 'right' }} href="">
              忘记密码
            </a> */}
          </div>
          <Submit loading={submitting}>登录</Submit>
          {/* <div className={styles.other}>
            其他登录方式
            <Icon className={styles.icon} type="alipay-circle" />
            <Icon className={styles.icon} type="taobao-circle" />
            <Icon className={styles.icon} type="weibo-circle" />
            <Link className={styles.register} to="/user/register">
              注册账户
            </Link>
          </div> */}
        </Login>
      </div>
    );
  }
}
