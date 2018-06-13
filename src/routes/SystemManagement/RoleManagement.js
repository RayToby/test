import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Input,
  Button,
  Modal,
  message,
  Badge,
  Divider,
  Popconfirm, 
  Checkbox
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TableList.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const CheckboxGroup  = Checkbox.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['success', 'default','processing', 'default' ];
const status = ['正常', '禁用'];
const switch_ = ['禁用', '启用'];
let checkArray = [];
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, pidList, children, that, btn, rolename, rRemarks, rid, handleEdit} = props;
  const okHandle = () => {
      debugger;
    form.validateFields({ rid: rid },(err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      btn == "add" ? handleAdd(fieldsValue) : handleEdit(fieldsValue);
    });
  };
  const checkBoxOption =  children && children.length > 0 ? children.map((item, i) => {
    const itemChildren1 = [];
    item.children1.length > 0 && item.children1.map((j, k) => {
      const checkboxOne = {};
      checkboxOne.label = j.name;
      checkboxOne.value = j.id;
      itemChildren1.push(checkboxOne);
      return itemChildren1;
    })
    return <div style={{paddingBottom:8}} key={i}><p style={{marginBottom:0,fontWeight:'bold'}}>{item.name}</p><CheckboxGroup style={{ width: '100%' }} options={itemChildren1} onChange={that.checkboxOnChange}  value={pidList}></CheckboxGroup></div>
    // <Row>{itemChildren1}</Row>
  }) : null;
  return (
    <Modal
      title="新建角色"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色名">
        {
          btn == "add" 
          ? 
            form.getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入角色' }],
              // initialValue: btn == "edit" ? rolename : "",
            })(<Input placeholder="请输入角色名" />)
          :
            form.getFieldDecorator('ridName', {
              // rules: [{ required: true, message: '请输入角色' }],
              initialValue: btn == "edit" ? rolename : "",
              // normalize: rid,
            })(<Input placeholder="请输入角色名" disabled/>)
          }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
        {form.getFieldDecorator('rRemarks', {
          rules: [{ required: true, message: '请输入备注信息' }],
          initialValue: btn == "edit" ? rRemarks : "",
        })(<TextArea rows={4} placeholder="请输入备注信息" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="权限">
        {checkBoxOption}
      </FormItem>
      
    </Modal>
  );
});

@connect(({ role, loading }) => ({
  role,
  loading: loading.models.role,
}))
@Form.create()
export default class RoleList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    data: {},
    roleList: [],
    allPermission: [],
  };

  componentDidMount() {
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'role/fetchRoleList',
        payload: {
          name: fieldsValue.name ? fieldsValue.name : "",
          rStats: fieldsValue.rStats ? fieldsValue.rStats : "",
        },
        callback: (res) => {
          if(res && res.code == '0') {
            this.setState({
              data: res.data,
            });
          }

        },
      });
    });
    // 查找角色roleList
    // dispatch({
    //   type: 'role/allRole',
    //   payload: {},
    //   callback: (res) => {
    //     this.setState({
    //       roleList: res.data.roleList ? res.data.roleList : [],
    //     });
    //   },
    // });

     // 查询所有权限
     dispatch({
      type: 'role/findPermission',
      payload: {},
      callback: (res) => {
        if(res && res.code == '0'){
          this.setState({
            allPermission: res.data.children ? res.data.children : [],
          });
        }else{
          message.error(res && res.message || '服务器错误');
        }
      },
    });
  }


  checkboxOnChange = (checkedValues) => {
    checkArray = Array.from(new Set(checkArray.concat(checkedValues))); 
    console.log('checkArray:'+checkedValues);
    this.setState({
      pidList: checkedValues,
    })
    // return checkArray;
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'role/fetchRoleList',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'role/fetchRoleList',
      payload: {},
      callback: (res) => {
        this.setState({
          data: res.data ? res.data : {},
        });
      }
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'role/remove',
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

  handleModalVisible = (flag, btn, role) => {
    checkArray = [];
    this.setState({
      modalVisible: !!flag,
      btn: btn ? btn : null,
      rolename: role && role.name ? role.name : null,
      rRemarks: role && role.rRemarks ?  role.rRemarks : null,
      pidList: role && role.pidList ?  role.pidList : null,
      rid: role && role.id ?  role.id : null,
    });
  };

  showDeleteConfirm = (id) => {
    const dispatch  = this.props.dispatch;
        dispatch({
          type: 'role/roleRemove',
          payload: {
            rId: id,
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

  handleAdd = fields => {
    // const pidArray = checkArray;
    this.props.dispatch({
      type: 'role/addRole',
      payload: {
        ...fields,
        pId: this.state.pidList,
      },
      callback: (res) => {
        if(res && res.code == '0'){
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
    const that = this;
    this.props.dispatch({
      type: 'role/editRole',
      payload: {
        rRemarks: fields.rRemarks,
        rId: that.state.rid,
        pId: that.state.pidList,
      },
      callback: (res) => {
        if(res && res.code == '0'){
          this.handleFormReset();
          message.success('修改成功');
        }else{
          message.error(res && res.message || '服务器错误');
        }
      }
    });
    this.setState({
      modalVisible: false,
    });
  };

  onRadioChange = (e) => {
    this.props.form.setFieldsValue({
      state: e.target.value,
    });
  }

  editRole = (roleId,roleState) => {
    this.props.dispatch({
      type: 'role/editRoleState',
      payload: {
        id: roleId,
        state: roleState,
      },
      callback: () => {
        this.handleFormReset();
      }
    });
  }

  render() {
    const {  loading } = this.props;//rule: { data },
    const { selectedRows, modalVisible, btn } = this.state;
    const {  children } = this.props.role.data && this.props.role.data.dataList || {};

    const columns = [
      {
        title: '角色名',
        dataIndex: 'name',
        editable: true,
      },
      {
        title: '备注',
        dataIndex: 'rRemarks',
        editable: true,
      },
      {
        title: '状态',
        dataIndex: 'rStats',
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
        // onFilter: (value, record) => record.status.toString() === value,
        render(val,row,index) {
          return <Badge key={index} status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '操作',
        render: (text, record, index) => {
          // const that = this;
          return(
          <Fragment key={index}>
            <a href="javascript:;" onClick={() => this.handleModalVisible(true,"edit",record)}>编辑</a>
            <Divider type="vertical" />
            <a href="javascript:;" onClick={() => this.editRole(record.id,record.rStats)} className={record.rStats == 1 ? null : styles.stateRed}>{switch_[record.rStats]}</a>
            <Divider type="vertical" />
            <Popconfirm title="确定删除本条记录?" onConfirm={() => this.showDeleteConfirm(record.id)}>
             <a href="javascript:;" style={{color:"#FF3500"}}>删除</a>
            </Popconfirm>
          </Fragment>
          )
        },
      },
    ];

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleEdit: this.handleEdit,
      handleModalVisible: this.handleModalVisible,
      children: this.state.allPermission,
      rolename: this.state.rolename,
      rRemarks: this.state.rRemarks,
      pidList: this.state.pidList,
      rid: this.state.rid,
    };

    return (
      <PageHeaderLayout title="角色管理">
        <div>
            <Card bordered={false}>
              <div className={styles.tableList}>
                {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}
                <div className={styles.tableListOperator}>
                  <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true,"add")} >
                    添加
                  </Button>
                </div>
                <StandardTable
                  ref="standardTable"
                  selectedRows={selectedRows}
                  loading={loading}
                  data={this.state.data}
                  columns={columns}
                  onSelectRow={this.handleSelectRows}
                  onChange={this.handleStandardTableChange}
                />
              </div>
            </Card>
            <CreateForm {...parentMethods} modalVisible={modalVisible} that={this} btn={btn}/>
        </div>   
      </PageHeaderLayout>
    );
  }
}
