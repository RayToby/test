import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Menu,
  Modal,
  message,
  Badge,
  Divider,
  Radio,
  Popconfirm 
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TableList.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['success', 'default','processing', 'default' ];
const status = ['正常', '禁用'];
const switch_ = ['禁用', '启用'];

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, roleList } = props;
  const role = roleList.length > 0 ? roleList.map((item, i) => {
    return <Option value={item.id} key={i}>{item.name}</Option>
  }) : <Option value="-1">暂无</Option>;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  const compareToFirstPassword = (rule, value, callback) => {
    // const form = this.props.form;
    if (value && value !== form.getFieldValue('passWord')) {
      callback('两次密码不一致');
    } else {
      callback();
    }
  }
  return (
    <Modal
      title="新建账户"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名">
        {form.getFieldDecorator('userName', {
          rules: [{ required: true, message: '请输入用户名' }],
        })(<Input placeholder="请输入用户名" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="姓名">
        {form.getFieldDecorator('realName', {
          rules: [{ required: true, message: '请输入真实姓名' }],
        })(<Input placeholder="请输入真实姓名" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="密码">
        {form.getFieldDecorator('passWord', {
          rules: [{ required: true, message: '请输入密码' }],
        })(<Input placeholder="请输入密码" type="password"/>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="确认密码">
        {form.getFieldDecorator('rePassword', {
          rules: [{ 
            required: true, message: '请再次输入密码',
           },{
            validator: compareToFirstPassword,
           }],
        })(<Input placeholder="请再次输入密码" type="password" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色">
        {form.getFieldDecorator('roleId', {
          rules: [{ required: true, message: '请选择角色' }],
        })(
        <Select placeholder="请选择" style={{ width: '100%' }}>
          {role}
              {/* // <Option value="0">超级管理员</Option>
              // <Option value="1">管理员</Option>
              // <Option value="2">运营</Option>
              // <Option value="3">市场</Option>
              // <Option value="4">客服</Option> */}
           </Select>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
        {form.getFieldDecorator('remarks', {
          rules: [{ required: true, message: '请输入备注信息' }],
        })(<TextArea rows={4} placeholder="请输入备注信息" />)}
      </FormItem>
      
    </Modal>
  );
});

const EditForm = Form.create()(props => {
  const { editModalVisible, form, handleEdit, handleEditModalVisible, roleList, username, realname, remarks, roleName, normalizeAll } = props;
  const role = roleList.length > 0 ? roleList.map((item, i) => {
    return <Option value={item.id} key={i}>{item.name}</Option>
  }) : <Option value="-1">暂无</Option>;
  const okHandle = () => {
    form.validateFields({},(err, fieldsValue) => {
      if (err) return;
      //下拉框不进行修改时  给下拉框进行id赋值
      if(fieldsValue.roleId == roleName) {
          roleList.length > 0 && roleList.map((item, i) => {
            if(fieldsValue.roleId == item.name) {
              fieldsValue.roleId = item.id;
            }
          })
      }
      form.resetFields();
      handleEdit(fieldsValue);
    });
  };
  return (
    <Modal
      title="编辑账户"
      visible={editModalVisible}
      onOk={okHandle}
      onCancel={() => handleEditModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名">
        <Input placeholder="请输入用户名" value={username} disabled/>
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="姓名">
        {form.getFieldDecorator('realName', {
            rules: [{ required: true, message: '请输入真实姓名' }],
            initialValue: realname,
          })(<Input placeholder="请输入真实姓名" />)
        }
        
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色">
        {form.getFieldDecorator('roleId', {
          rules: [{ required: true, message: '请选择角色' }],
          initialValue: roleName,
          // normalize: normalizeAll,
        })(
        <Select placeholder="请选择" style={{ width: '100%' }}>
          {role}
        </Select>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
        {form.getFieldDecorator('remarks', {
          rules: [{ required: true, message: '请输入备注信息' }],
          initialValue: remarks,
        })(<TextArea rows={4} placeholder="请输入备注信息" />)}
      </FormItem>
      
    </Modal>
  );
});

@connect(({ account, loading }) => ({
  account,
  loading: loading.models.account,
}))
@Form.create()
export default class UserList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    data: {},
    roleList: [],
    editModalVisible: false,
    page: 1,
    pageSize: 10,
    total: '',
  };

  componentDidMount() {
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'account/fetch',
        payload: {
          username: fieldsValue.username ? fieldsValue.username : "",
          state: fieldsValue.state,
          page: this.state.page,
          pageSize: this.state.pageSize,
        },
        callback: (res) => {
          if(res && res.code == '0'){
            this.setState({
              data: res.data ? res.data : {},
              total: res.data.total ? res.data.total : '',
            });
          }else{
            message.error(res && res.message || '服务器错误')
          }
        },
      });
    });
    // 查找角色roleList
    dispatch({
      type: 'account/allRole',
      payload: {},
      callback: (res) => {
        if(res && res.code == '0'){
          this.setState({
            roleList: res.data.roleList ? res.data.roleList : [],
          });
        }else{
          message.error(res && res.message || '服务器错误');
        }
      },
    });
   
  }

  // normalizeAll = (value, prevValue = []) => {
  //   const { roleList } = this.state;
  //   roleList.length > 0 && roleList.map((item , i) => {
  //     if(value == item.name) {
  //       return item.id;
  //     }else{
  //       return value;
  //     }
  //   })
    
  //   // if (value == roleList) {
  //   //   return ['All', 'Apple', 'Pear', 'Orange'];
  //   // }
  //   // if (value.indexOf('All') < 0 && prevValue.indexOf('All') >= 0) {
  //   //   return [];
  //   // }
  //   // return value;
  // };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    let params = {
      ...formValues,
      ...filters,
      page: pagination.current,
      pageSize: pagination.pageSize,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'account/fetch',
      payload: params,
      callback: (res) => {
        this.setState({
          data: res.data ? res.data : {},
          total: res.data.total ? res.data.total : '',
        });
      }
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'account/fetch',
      payload: {
        page: 1,
        pageSize: this.state.pageSize,
      },
      callback: (res) => {
        this.setState({
          data: res.data ? res.data : {},
          total: res.data.total ? res.data.total : '',
          page: 1,
        });
      }
    });
  };

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'account/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    const that = this;
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        userName: fieldsValue.username ? fieldsValue.username : "",
        state: fieldsValue.state,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
        page: 1,
        pageSize: this.state.pageSize,
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'account/fetch',
        payload: values,
        callback: (res) => {
          this.setState({
            data: res.data ? res.data : {},
            total: res.data.total ? res.data.total : '',
            page: 1,
          });
        },
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleEditModalVisible = flag => {
    this.setState({
      editModalVisible: !!flag,
    });
  };

  edit = user => {
    this.setState({
      editModalVisible: true,
      userId: user.id,
      username: user.userName,
      realname: user.realName,
      remarks: user.remarks,
      roleName: user.roleName,
    });
  }

  showDeleteConfirm = (id,userName) => {
    const that = this;
    const dispatch  = this.props.dispatch;
    dispatch({
      type: 'account/remove',
      payload: {
        id: id,
        userName: userName,
      },
      callback: (res) => {
        if(res && res.code == '0'){
          this.handleFormReset();
          message.success('删除成功');
        }else{
          message.error(res && res.message || '服务器错误');
        }
      }
    });
  }
 
  resetPwd = (id,userName) => {
    const dispatch  = this.props.dispatch;
    dispatch({
      type: 'account/reset',
      payload: {
        id: id,
        // username: userName,
      },
      callback: (res) => {
        if(res && res.code == '0') {
          this.handleFormReset();
          message.success('重置成功,初始密码为6个0');
        }else{
          message.error(res && res.message || '服务器错误');
        }
      }
    });
    
  }

  handleAdd = fields => {
    this.props.dispatch({
      type: 'account/add',
      payload: {
        ...fields
      },
      callback: (res) => {
        if(res && res.code == '0') {
          this.handleFormReset();
          message.success('添加成功');
        }else{
          message.error(res && res.message || '服务器错误');
        }
      }
    });
    this.setState({
      modalVisible: false,
    });
  };

  handleEdit = fields => {
    this.props.dispatch({
      type: 'account/edit',
      payload: {
        ...fields,
        id: this.state.userId,
      },
      callback: (res) => {
        if(res && res.code == '0') {
          this.handleFormReset();
          message.success('修改成功');
        }else{
          message.error(res && res.message || '服务器错误');
        }
      }
    });
    
    this.setState({
      editModalVisible: false,
    });
  };

  onRadioChange = (e) => {
    this.props.form.setFieldsValue({
      state: e.target.value,
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="用户名">
              {getFieldDecorator('username')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状 态">
              {getFieldDecorator('state',{
                initialValue: "",
              })(
                <RadioGroup onChange={this.onRadioChange}>
                  <Radio value={""}>全选</Radio>
                  <Radio value={0}>正常</Radio>
                  <Radio value={1}>禁用</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit" >
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a> */}
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  editUserState = (userId,userState) => {
    this.props.dispatch({
      type: 'account/editState',
      payload: {
        id: userId,
        state: userState,
      },
      callback: (res) => {
        if(res && res.code == '-1') {
          message.error(res && res.message);
        }
        this.handleFormReset();
      }
    });
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  onClickPage(current, pageSize) {
      this.setState({page:current,pageSize:pageSize});

      const { dispatch, form } = this.props;
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        dispatch({
          type: 'account/fetch',
          payload: {
            username: fieldsValue.username ? fieldsValue.username : "",
            state: fieldsValue.state,
            page: current,
            pageSize: pageSize,
          },
          callback: (res) => {
            this.setState({
              data: res.data ? res.data : {},
              total: res.data.total ? res.data.total : '',
            });
          },
        });
      });
  }

  render() {
    const {  loading, dispatch } = this.props;//rule: { data },
    const form = this.props.form;
    const { selectedRows, modalVisible, editModalVisible, roleList } = this.state;
    let {page, pageSize, total} = this.state;
    let pagination = {
        total: total,
        defaultCurrent: page,
        pageSize: pageSize,
        current: page,
        showSizeChanger: true,
        onShowSizeChange: (current, pageSize) => {
            this.onClickPage(current, pageSize)
        },
        onChange:(current, pageSize) => {
            this.onClickPage(current, pageSize)
        },
    }
    const columns = [
      {
        title: '用户名',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '真实姓名',
        dataIndex: 'realName',
        key: 'realName',
      },
      {
        title: '角色',
        dataIndex: 'roleName',
        // editable: true,
        key: 'roleName',
      },
      {
        title: '备注',
        dataIndex: 'remarks',
        // editable: true,
        key: 'remarks',
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        // filters: [
        //   {
        //     text: status[0],
        //     value: 0,
        //   },
        //   {
        //     text: status[1],
        //     value: 1,
        //   },
        // ],
        onFilter: (value, record) => record.status.toString() === value,
        render(val, row, index) {
          return <Badge key={index} status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '操作',
        render: (text, record, index) => {
          return(
          <Fragment key={index}>
            <a href="javascript:;" onClick={() => this.edit(record)}>编辑</a>
            <Divider type="vertical" />
            <a href="javascript:;" onClick={() => this.editUserState(record.id,record.state)} className={record.state == 1 ? null : styles.stateRed}>{switch_[record.state]}</a>
            <Divider type="vertical" />
            <Popconfirm title="确定删除本条记录?" onConfirm={() => this.showDeleteConfirm(record.id,record.userName)}>
             <a href="javascript:;" style={{color:"#FF3500"}}>删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <Popconfirm title="确定重置密码?" onConfirm={() => this.resetPwd(record.id,record.userName)}>
              <a href="javascript:;" style={{color:"#FF8000"}}>重置密码</a>
            </Popconfirm>
          </Fragment>
          )
        },
      },
    ];
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">禁用</Menu.Item>
        <Menu.Item key="approval">开启</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    const parentMethodsEdit = {
      handleEdit: this.handleEdit,
      handleEditModalVisible: this.handleEditModalVisible,
      username: this.state.username,
      realname: this.state.realname,
      remarks: this.state.remarks,
      roleName: this.state.roleName,
      normalizeAll: this.normalizeAll,
    };

    return (
      <PageHeaderLayout title="后台账号列表">
        <div>
            <Card bordered={false}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderForm()}</div>
                <div className={styles.tableListOperator}>
                  <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)} >
                    添加
                  </Button>
                  {/* {selectedRows.length > 0 && (
                    <span>
                      <Dropdown overlay={menu}>
                        <Button>
                         批量操作 <Icon type="down" />
                        </Button>
                      </Dropdown>
                    </span>
                  )} */}
                </div>
                <StandardTable
                  ref="standardTable"
                  selectedRows={selectedRows}
                  loading={loading}
                  data={this.state.data}
                  columns={columns}
                  onSelectRow={this.handleSelectRows}
                  onChange={this.handleStandardTableChange}
                  pagination={pagination}
                />
              </div>
            </Card>
            <CreateForm {...parentMethods} modalVisible={modalVisible} roleList={roleList}/>
            <EditForm {...parentMethodsEdit} editModalVisible={editModalVisible} roleList={roleList}/>
        </div>   
      </PageHeaderLayout>
    );
  }
}
