import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
 Form,
 Card,
 Icon,
 Input,
 Row,
 Col,
 Button,
 message,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
const FormItem = Form.Item;
const sexArr = ['女','男'];
const stateArr = ['正常', '禁用'];
const _osType = ['','Android','iOS'];
const _platformType = ['','米橙提醒','米橙浏览器'];
// In the fifth row, other columns are merged into first column
// by setting it's colSpan to be 0
@connect(({ userList, loading }) => ({
  userList,
  loading: loading.models.userList,
}))
@Form.create()
export default class UserEdit extends PureComponent {
  constructor(props) {
    super(props);
    const prevParams = props && props.location.params;
    this.state = {
      weixinOpenId: prevParams && prevParams.extendJson && JSON.parse(prevParams.extendJson).openid || '',
      mobile: prevParams && prevParams.mobile || '',
      nickName: prevParams && prevParams.nickName || '',
      regTime: prevParams && prevParams.regTime || '',
      osType: prevParams && prevParams.osType || '',
      platformType: prevParams && prevParams.platformType || '',
      _state: prevParams && String(prevParams.state) || '',  //将0钻成字符串
      area: prevParams && prevParams.area || '',
      birthday: prevParams && prevParams.birthday || '',
      headPicUrl: prevParams && prevParams.headPicUrl || '',
      sex: prevParams && String(prevParams.sex) || '',
      id: prevParams && prevParams.id || '',
      uploading: false,
      unBinding: false,
      unBindWeixin: false,
      seconds: 10,
    };
  }

  componentDidMount() {

  }
  
  _goBack = () => {
    this.props.dispatch( routerRedux.goBack());
  }
  //绑定手机
  bindMobile = () => {
    this.setState({uploading: true});
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.props.dispatch({
        type: 'userList/bindMobile',
        payload: {
          id: this.state.id,//10069,//
          mobile: fieldsValue.mobile,
          // checkcode: fieldsValue.checkcode,
        },
        callback: (res) => {
          if(res && res.code == '0'){
            this.setState({
              mobile: fieldsValue.mobile,
              uploading: false,
            });
            message.success('绑定成功');
          }else{
            this.setState({uploading: false});
            message.error(res && res.message || '服务器错误');
          }
        },
      });
    });
  }

  //解除手机绑定
  unbindTel = () => {
      this.setState({unBinding: true});
      this.props.dispatch({
        type: 'userList/unBindMobile',
        payload: {
          id: this.state.id,//10069,
        },
        callback: (res) => {
          if(res && res.code == '0'){
            this.setState({
              mobile: false,
              unBinding: false,
            });
            message.success('解绑成功');
          }else{
            this.setState({unBinding: false});
            message.error(res && res.message || '服务器错误')
          }
        },
      });
  }
//微信解绑
  unbindWeixin = () => {
    this.setState({unBindWeixin: true});
      this.props.dispatch({
        type: 'userList/unBindByWeiXin',
        payload: {
          id: this.state.id,//10069,
        },
        callback: (res) => {
          if(res && res.code == '0'){
            this.setState({
              unBindWeixin: false,
              winxinOpenID: false,
            });
            message.success('解绑成功');
          }else{
            this.setState({unBindWeixin: false});
            message.error(res && res.message || '服务器错误')
          }
        },
      });
  }
  //获取验证码
  getIdentifyingCode = () => {
    if(!this.state.inputTel) return;
    this.timer = setInterval(() => {  
      this.setState({  
        seconds: (this.state.seconds - 1),  
      },() => {
        if (this.state.seconds == 0) {
            clearInterval(this.timer);
            this.setState({
              seconds: 10,
            });
        }
      });  
    }, 1000);  
    this.props.dispatch({
      type: 'userList/sendCheckcode',
      payload: {
        mobile: this.state.inputTel,
      },
      callback: (res) => {
        if(res && res.code == '0'){
          // message.success('服务器错误')
        }else{
          message.error(res && res.message || '服务器错误')
        }
      }
    });
  }

  validatecontactWay = (rule, value, callback) => {
    const tel = /^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57]|17[0-9])[0-9]{8}$/;
    if( !value) {
      callback('手机号不能为空');
      this.setState({
        inputTel: '',
      });
      return;
    }else if( !tel.test(value) ) {
      callback('手机号格式不对');
      this.setState({
        inputTel: '',
      });
      return;
    }else{
      callback();
      this.setState({
        inputTel: value,
      });
    }
  }

  render() {
    const {unBindWeixin, unBinding, uploading, mobile, nickName, regTime, osType, platformType, _state, area, birthday, weixinOpenId, headPicUrl, sex } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5},
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12, offset: 1 },
      },
    };
    let { getFieldDecorator } = this.props.form;
    const title = <p><a href="javascript:void(0)" style={{marginRight:20,color:'rgba(0, 0, 0, 0.85)'}} onClick={() =>this._goBack()}><Icon type="left" style={{marginRight:5}}/>返回</a>编辑</p>;
    return (
      <PageHeaderLayout title={title}>
        <div>
              <Card bordered={false}>
                <div className={styles.tableList}>
                    <Form >
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='用户手机'>
                              {mobile ?
                                <p>{mobile}<Button type="primary" onClick={() => this.unbindTel()} style={{marginLeft:20}} loading={unBinding}>解除绑定</Button></p>
                                :
                                <div>
                                  {getFieldDecorator('mobile', {
                                    // onChange: this.validatecontactWay,
                                    rules: [{ 
                                      required: true, 
                                      // message: '请输入手机号',
                                      validator: this.validatecontactWay,
                                    }],
                                    // normalize: this.normalizeAll,
                                    // validateTrigger: 'onBlur',
                                  })(<div  style={{display: 'flex',flexDirection:'row'}} >
                                        <Input placeholder="请输入手机号" />
                                        {/* <Button type="primary" disabled={this.state.seconds == 10 ? false : true} style={{marginLeft:10}} onClick={() => this.getIdentifyingCode()}>{this.state.seconds == 10 ? '发送验证码' : this.state.seconds+'s' }</Button> */}
                                      </div>)}
                                </div>
                              }
                            </FormItem>
                          </Col>
                      </Row>
                      {/* {
                        mobile 
                        ?
                        null
                        :
                        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                          <Col md={12} sm={24}>
                              <FormItem {...formItemLayout} label='手机验证码'>
                                  {getFieldDecorator('checkcode', {
                                    rules: [{ required: true, message: '请输入手机验证码' }],
                                  })(<Input placeholder="请输入手机验证码" />)}
                              </FormItem>
                            </Col>
                        </Row>
                      } */}
                      {/* <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='用户名称'>
                              <p>用户名称</p>
                            </FormItem>
                          </Col>
                      </Row> */}
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='微信OpenID'>
                              {
                                weixinOpenId
                                ? 
                                <p>{weixinOpenId}<Button type="primary" onClick={() => this.unbindWeixin()} style={{marginLeft:20}} loading={unBindWeixin}>解除绑定</Button></p> 
                                : null 
                              }
                            </FormItem>
                          </Col>
                      </Row>
                      {/* <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='QQOpenID'>
                              <p>gjiGGBNo761bibfsuf9bi9h9ahYUHBbaohhaopqh<a>解除绑定</a></p>
                            </FormItem>
                          </Col>
                      </Row> */}
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='注册日期'>
                              <p>{regTime}</p>
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='注册来源-系统'>
                              <p>{_osType[osType]}</p>
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='注册来源-平台'>
                              <p>{_platformType[platformType]}</p>
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='头像'>
                              {headPicUrl ? <img alt="pic" src={headPicUrl} width="60"/> : null}
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='昵称'>
                              <p>{nickName}</p>  
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='性别'>
                              <p>{sexArr[sex]}</p>
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='生日'>
                              <p>{birthday}</p>
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='地区'>
                              <p>{area}</p>
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='状态'>
                              <p>{stateArr[_state]}</p>
                            </FormItem>
                          </Col>
                      </Row>
                      {/* <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='备注'>
                              <TextArea rows={4}/>
                            </FormItem>
                          </Col>
                      </Row> */}
                    </Form>
                    <Row style={{marginTop:150}}>
                        <Col  span={12} style={{display:'flex',justifyContent:'flex-end'}}>
                            {mobile ? null : <Button type="primary" onClick={this.bindMobile} style={{marginRight:20}} loading={uploading}>保存</Button>}
                            <Button  onClick={this._goBack}>取消</Button>
                        </Col>
                    </Row>
                </div> 
              </Card>
          </div>
      </PageHeaderLayout>
    );
  }
}
