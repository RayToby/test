import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
 Table,
 Divider,
 Card,
 Form,
 Row,
 Col,
 Radio,
 Input,
 Button,
 DatePicker,
 message,
 Icon,
 Popconfirm,
 Badge,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
const osType = ['','Android','iOS'];
const platformType = ['','米橙提醒','米橙浏览器'];
const _state = ['正常','禁用'];
const switch_ = ['禁用', '启用'];
const statusMap = ['success', 'default','processing', 'default' ];
// In the fifth row, other columns are merged into first column
// by setting it's colSpan to be 0
@connect(({ userList, loading }) => ({
  userList,
  loading: loading.models.userList,
}))
@Form.create()
export default class UserList extends PureComponent {
  state = {
    startCreateDate: '',
    overCreateDate: '',
    page: 1,
    pageSize: 10,
    total: '',
    expandForm: false,
  };

  componentDidMount() {
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        startCreateDate: this.state.startCreateDate,
        overCreateDate: this.state.overCreateDate,
        mobile: fieldsValue.mobile ? fieldsValue.mobile : "",
        nickName: fieldsValue.nickName ? fieldsValue.nickName : "",
        state: fieldsValue.state, 
        osType: fieldsValue.osType ? fieldsValue.osType : "", 
        platformType: fieldsValue.platformType ? fieldsValue.platformType : "",   
        page: this.state.page,
        pageSize: this.state.pageSize,
      };

      // this.setState({
      //   formValues: values,
      // });

      dispatch({
        type: 'userList/queryUserList',
        payload: values,
        callback: (res) => {
          if(res && res.code == '0') {
            this.setState({
              data: res.data ? res.data.dataList : {},
              total: res.data ? res.data.total : '',
            });
          }else{
            message.error(res && res.message || '服务器错误');
          }
        },
      });
    });
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }

  dateSelect = (date,dateString) => {
    this.setState({
      startCreateDate: dateString[0],
      overCreateDate: dateString[1],
    });
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    // const role = roleList.length > 0 ? roleList.map((item, i) => {
    //   return <Option value={item.id} key={i}>{item.name}</Option>
    // }) : <Option value="-1">暂无</Option>;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="用户手机">
              {getFieldDecorator('mobile')(<Input placeholder="请输入用户手机号码" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="用户昵称">
              {getFieldDecorator('nickName')(<Input placeholder="请输入用户昵称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24} >
            <FormItem label="状态">
                {getFieldDecorator('state',{
                    initialValue: "",
                })(
                    <RadioGroup onChange={this.onRadioChangeState} initialValue={1}>
                    <Radio value={""}>全选</Radio>
                    <Radio value={0}>正常</Radio>
                    <Radio value={1}>禁用</Radio>
                    </RadioGroup>
                )}
                <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                    展开 <Icon type="down" />
                </a>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
                <span className={styles.submitButtons}>
                    <Button type="primary" htmlType="submit" >
                        查询
                    </Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                        重置
                    </Button>
                </span>
            </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
                <FormItem label="用户手机">
                {getFieldDecorator('mobile')(<Input placeholder="请输入用户手机号码" />)}
                </FormItem>
            </Col>
            <Col md={8} sm={24}>
                <FormItem label="用户昵称">
                {getFieldDecorator('nickName')(<Input placeholder="请输入用户昵称" />)}
                </FormItem>
            </Col>
            <Col md={8} sm={24} >
                <FormItem label="状态">
                {getFieldDecorator('state ',{
                    initialValue: "",
                })(
                    <RadioGroup onChange={this.onRadioChangeState} initialValue={1}>
                    <Radio value={""}>全选</Radio>
                    <Radio value={0}>正常</Radio>
                    <Radio value={1}>禁用</Radio>
                    </RadioGroup>
                )}
                </FormItem>
            </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24} style={{display:'flex',justifyContent:'center'}}>
              <label style={{color: 'rgba(0, 0, 0, 0.85)',marginRight:18}}>时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;间:</label>
              <RangePicker onChange={this.dateSelect.bind(this)} style={{flex:1}} value={(this.state.startCreateDate && this.state.overCreateDate) ? [moment(this.state.startCreateDate),moment(this.state.overCreateDate)] : ''}/>
            </Col>
            <Col md={8} sm={24}>
                <FormItem label="注册系统">
                {getFieldDecorator('osType',{
                    initialValue: "",
                })(
                    <RadioGroup onChange={this.onRadioChangeOs} initialValue={1}>
                        <Radio value={""}>全部</Radio>
                        <Radio value={1}>Android</Radio>
                        <Radio value={2}>iOS</Radio>
                        {/* <Radio value={3}>Web</Radio> */}
                    </RadioGroup>
                )}
                </FormItem>
            </Col>
            <Col md={8} sm={24} style={{display:'flex',paddingLeft:24}}>
                <FormItem label="注册平台">
                {getFieldDecorator('platformType',{
                    initialValue: "",
                })(
                    <RadioGroup onChange={this.onRadioChangePlat} initialValue={1}>
                    <Radio value={""}>全部</Radio>
                    <Radio value={1}>米橙提醒</Radio>
                    <Radio value={2}>米橙浏览器</Radio>
                    </RadioGroup>
                )}
                </FormItem>
            </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <div style={{ overflow: 'hidden' }}>
                <span style={{ marginBottom: 24 }}>
                    <Button type="primary" htmlType="submit" >
                    查询
                    </Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                    重置
                    </Button>
                    <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                    收起 <Icon type="up" />
                    </a>
                </span>
            </div>
        </Row>
        
      </Form>
    );
  }

  validatecontactWay = (rule, value, callback) => {
    const tel = /^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57]|17[0-9])[0-9]{8}$/;
    const qq = /^[1-9]\d{4,9}$/; 
    const email = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    if (!(tel.test(value) || qq.test(value) || email.test(value))) return callback(rule.message);
    this.setState({
      searchOk: true,
    });
    // this.props.dispatch
  }

  onRadioChangeState = (e) => {
    this.props.form.setFieldsValue({
      state: e.target.value,
    });
  }

  onRadioChangeOs = (e) => {
    this.props.form.setFieldsValue({
      osType: e.target.value,
    });
  }

  onRadioChangePlat = (e) => {
    this.props.form.setFieldsValue({
      platformType: e.target.value,
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      startCreateDate: '',
      overCreateDate: '',
    });
    dispatch({
      type: 'userList/queryUserList',
        payload: {
          page: 1,
          pageSize: this.state.pageSize,
        },
        callback: (res) => {
          if(res && res.code == '0'){
            this.setState({
              data: res.data && res.data.dataList ? res.data.dataList : {},
              total: res.data ? res.data.total : '',
              page: 1,
            });
          }else{
            message.error(res && res.message || '服务器错误');
          }
        }
    });
  }

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        startCreateDate: this.state.startCreateDate,
        overCreateDate: this.state.overCreateDate,
        mobile: fieldsValue.mobile ? fieldsValue.mobile : "",
        nickName: fieldsValue.nickName ? fieldsValue.nickName : "",
        state: fieldsValue.state, 
        osType: fieldsValue.osType ? fieldsValue.osType : "", 
        platformType: fieldsValue.platformType ? fieldsValue.platformType : "",   
        page: 1,
        pageSize: this.state.pageSize,
      };

      // this.setState({
      //   formValues: values,
      // });

      dispatch({
        type: 'userList/queryUserList',
        payload: values,
        callback: (res) => {
          if(res && res.code == '0'){
            this.setState({
              data: res.data ? res.data.dataList : {},
              total: res.data.total ? res.data.total : '',
              page: 1,
            });
          }else{
            message.error(res && res.message || '服务器错误');
          }
        },
      });
    });
  };

  onClick(current, pageSize) {
    this.setState({page:current,pageSize:pageSize});

    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'userList/queryUserList',
        payload: {
          startCreateDate: this.state.startCreateDate,
          overCreateDate: this.state.overCreateDate,
          mobile: fieldsValue.mobile ? fieldsValue.mobile : "",
          nickName: fieldsValue.nickName ? fieldsValue.nickName : "",
          state: fieldsValue.state, 
          osType: fieldsValue.osType ? fieldsValue.osType : "", 
          platformType: fieldsValue.platformType ? fieldsValue.platformType : "",  
          page: current,
          pageSize: pageSize,
        },
        callback: (res) => {
          if(res && res.code == '0') {
            this.setState({
              data: res.data ? res.data.dataList : {},
              total: res.data.total ? res.data.total : '',
            });
          }else{
            message.error(res && res.message || '服务器错误')
          }
          
        },
      });
    });
  }

  edit = (params) => {
    this.props.dispatch( routerRedux.push({
        pathname: '/usermanagement/user-edit',
        params: params,
      }
    ));
  }
 
  editUserState = (userId, userState) => {
    this.props.dispatch({
      type: 'userList/editCustomerState',
      payload: {
        id: userId,
        state: userState,
      },
      callback: (res) => {
        if(res && res.code == '0') {
          this.handleFormReset();
        }else {
          message.err(res && res.message || '服务器错误')
        }
      }
    });
  }

  showDeleteConfirm = (params) => {
    this.props.dispatch({
      type: 'userList/deleteCuster',
      payload: {
        id: params.id,
        headPicUrl: params.headPicUrl,
      },
      callback: (res) => {
        if(res && res.code == '0') {
          message.success('删除成功');
          this.handleFormReset();
        }else {
          message.error(res && res.message || '服务器错误');
        }
        
      }
    });
  } 

  render() {
    let {page, pageSize, total} = this.state;
    let pagination = {
      total: total,
      defaultCurrent: page,
      current: page,
      pageSize: pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      onShowSizeChange: (current, pageSize) => {
        this.onClick(current, pageSize)
      },
      onChange:(current, pageSize) => {
          this.onClick(current, pageSize)
      },
    }
    const renderContent = (value, row, index) => {
      const obj = {
        // children: value,
        // props: {},
      };
      const name = [];
      value.map((item, i) => {
        const opt = (i == value.length - 1) ? <div key={i}>{item.name}</div> : <div key={i}>{item.name}<Divider/></div>;
        name.push(opt)
      });
      obj.children = name;
      return obj;
    };
    const columns = [{
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
      render: (value, row, index) => {
        return(
          <Fragment key={index}>
            <span>{value ? value : '未绑定'}</span>
          </Fragment>
        )
      }
    }, {
      title: '昵称',
      dataIndex: 'nickName',
      key: 'nickName',
      // render: renderContent,
    },{
      title: '注册日期',
      dataIndex: 'regTime',
      key: 'regTime',
      // render: (value, row, index) => {
      //   let sys = "";
      //   if(row.clientSystem == '1') {
      //     sys = 'Android';
      //   }else if(row.clientSystem == '2') {
      //     sys = 'iOS';
      //   }
      //   return(
      //     <p>{sys}</p>
      //   )
      // },
    },{
      title: '注册系统',
      dataIndex: 'osType',
      key: 'osType',
      render: (value, row, index) => {
        return(
          <Fragment key={index}>
            <span>{osType[value]}</span>
          </Fragment>
          )
      }
    },{
      title: '注册平台',
      dataIndex: 'platformType',
      key: 'platformType',
      render: (value, row, index) => {
        return(
          <Fragment key={index}>
            <span>{platformType[value]}</span>
          </Fragment>
          )
      }
    },{
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      // filters: [
      //   {
      //     text: _state[0],
      //     value: 0,
      //   },
      //   {
      //     text: _state[1],
      //     value: 1,
      //   },
      // ],
      // onFilter: (value, record) => record.status.toString() === value,
      render(value, row, index) {
        return <Badge status={statusMap[value]} text={_state[value]} />;
      },
    },{
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (value, row, index) => {
        return(
          <Fragment key={index}>
            {/* <Link to="/systemManagement/authority-management">编辑</Link>
            <Route path="/systemManagement/authority-management" /> */}
            {/* <Link to="/usermanagement/user-edit" >编辑</Link> */}
            {/* <Route path="/usermanagement/user-list/user-edit" /> */}
            <a href="javascript:;" onClick={() => this.edit(row)}>编辑</a>
            <Divider type="vertical" />
            <a href="javascript:;" onClick={() => this.editUserState(row.id,row.state)} className={row.state == 1 ? null : styles.stateRed} >{switch_[row.state]}</a>
            <Divider type="vertical" />
            <Popconfirm title="确定删除本条记录?" onConfirm={() => this.showDeleteConfirm(row)}>
             <a href="javascript:;" style={{color:"#FF3500"}}>删除</a>
            </Popconfirm>
            <Divider type="vertical" />
          </Fragment>
          )
      }
    }];
    return (
      <PageHeaderLayout title="用户列表">
        <div>
            <Card bordered={false}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderForm()}</div>
                <Table 
                  style={{backgroundColor:'white',marginTop:16}}
                  columns={columns} 
                  dataSource={this.state.data} 
                  pagination={pagination}
                />
              </div>
            </Card>
            {/* <Redirect exact from="/usermanagement/user-list" to="/usermanagement/user-list/user-edit" /> */}
        </div>   
        
      </PageHeaderLayout>
    );
  }
}
