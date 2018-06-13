import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
 Table,
 Divider,
 Card,
 Form,
 Row,
 Col,
 Input,
 Button,
 Select,
 message,
 Popconfirm,
 Modal,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from '../SystemManagement/TableList.less';
const FormItem = Form.Item;
const { Option } = Select;
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleEdit, handleModalVisible, groupList, btn, params} = props;
  
  const role = groupList.length > 0 ? groupList.map((item, i) => {
    return <Option value={item} key={i}>{item}</Option>
  }) : <Option value=""></Option>;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      btn == "add" ? handleAdd(fieldsValue) : handleEdit(fieldsValue);
    });
  };
  return (
    <Modal
      title="新增短地址"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="分组">
        {form.getFieldDecorator('grouping', {
          rules: [{ required: true, message: '请选择分组' }],
          initialValue: params ? params.grouping : '',
        })(
        <Select placeholder="请选择" style={{ width: '100%' }} mode="combobox">
          {role}
        </Select>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="跳转地址">
        {form.getFieldDecorator('url', {
          rules: [{ required: true, message: '请输入跳转地址' }],
          initialValue: params ? params.url : '',
        })(<Input placeholder="请输入跳转地址" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="简介">
        {form.getFieldDecorator('intro', {
          rules: [{ required: true, message: '请输入简介' }],
          initialValue: params ? params.intro : '',
        })(<Input placeholder="请输入简介" />)}
      </FormItem>
    </Modal>
  );
});
@connect(({ shortAddress, loading }) => ({
  shortAddress,
  loading: loading.models.shortAddress,
}))
@Form.create()
export default class FeedBackList extends PureComponent {
  state = {
    grouping: '',
    intro: '',
    page: 1,
    pageSize: 10,
    total: '',
    modalVisible: false,
    groupList: []
  };

  componentDidMount() {
      this.handleSearch();
      this.fetchGroupList();
  }

  fetchGroupList() {
    this.props.dispatch({
      type: 'shortAddress/queryGroup',
      payload: {},
      callback: (res) => {
        if(res && res.code == '0') {
          this.setState({ groupList: res.data.dataArray });
        }else{
          message.error(res && res.message || '服务器错误');
        }
      }
    });
  }

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { groupList } = this.state;
    const role = groupList.length > 0 ? groupList.map((item, i) => {
      return <Option value={item} key={i}>{item}</Option>
    }) : <Option value=""></Option>;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="分组">
              {getFieldDecorator('grouping',{
                initialValue: ''
              })(
              <Select style={{ width: '100%' }} placeholder={'请选择'}  mode="combobox">
                {role}
              </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="简介">
              {getFieldDecorator('intro',{
                initialValue: '',
              })(<Input placeholder="请输入简介" />)}
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
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  handleModalVisible = (flag, btn, params) => {
    this.setState({
      modalVisible: !!flag,
      btn: btn ? btn : null,
      params: params ? params : null,
    });
  };
  //新增
  handleAdd = fields => {
    this.props.dispatch({
      type: 'shortAddress/addShortUrl',
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
  }
  //编辑
  handleEdit = fields => {
    const that = this;
    this.props.dispatch({
      type: 'shortAddress/updateShortUrl',
      payload: {
        id: this.state.params.id,
        grouping: fields.grouping,
        url: fields.url,
        intro: fields.intro,
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
  }
  //重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        grouping: fieldsValue.grouping,
        intro: fieldsValue.intro,
        page: 1,
        pageSize: this.state.pageSize,
      };
      dispatch({
        type: 'shortAddress/queryShortUrl',
        payload: values,
        callback: (res) => {
          if(res && res.code == '0') {
            this.setState({
              data: res.data ? res.data.dataList : [],
              total: res.data.total ? res.data.total : '',
              page: 1,
            });
          }else{
            message.error(res && res.message || '服务器错误')
          }
        },
      });
    });
  }
  //查询
  handleSearch = e => {
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        grouping: fieldsValue.grouping,
        intro: fieldsValue.intro,
        page: this.state.page,
        pageSize: this.state.pageSize,
      };
      dispatch({
        type: 'shortAddress/queryShortUrl',
        payload: values,
        callback: (res) => {
          if(res && res.code == '0') {
            this.setState({
              data: res.data ? res.data.dataList : [],
              total: res.data.total ? res.data.total : '',
            });
          }else{
            message.error(res && res.message || '服务器错误')
          }
        },
      });
    });
  };
  //删除
  showDeleteConfirm = (params) => {
      const dispatch  = this.props.dispatch;
      dispatch({
        type: 'shortAddress/deleteShortUrl',
        payload: {
          id: params.id,
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

  onClickPage(current, pageSize) {
    this.setState({page:current,pageSize:pageSize});
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'shortAddress/queryShortUrl',
        payload: {
          grouping: fieldsValue.grouping,
          intro: fieldsValue.intro,
          page: current,
          pageSize: pageSize,
        },
        callback: (res) => {
          if(res && res.code == '0'){
            this.setState({
              data: res.data ? res.data.dataList : [],
              total: res.data.total ? res.data.total : '',
            });
          }else{
            message.error(res && res.message || '服务器错误')
          }
        },
      });
    });
  }

  render() {
    let {page, pageSize, total, data, modalVisible} = this.state;
    let pagination = {
      total: total,
      defaultCurrent: page,
      current: page,
      pageSize: pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      onShowSizeChange: (current, pageSize) => {
        this.onClickPage(current, pageSize)
      },
      onChange:(current, pageSize) => {
          this.onClickPage(current, pageSize)
      },
    }

    const columns = [{
      title: '简介',
      dataIndex: 'intro',
      key: 'intro',
    }, {
      title: '短链接',
      dataIndex: 'shortUrl',
      key: 'shortUrl',
    }, {
      title: '跳转地址',
      dataIndex: 'url',
      key: 'url',
    },{
      title: '分组',
      dataIndex: 'grouping',
      key: 'grouping',
      // render: (value, row, index) => {
      //   let sys = "";
      //   if(row.clientSystem == '1') {
      //     sys = 'Android';
      //   }else if(row.clientSystem == '2') {
      //     sys = 'iOS';
      //   }
      //   return(
      //     <span key={index}>{sys}</span>
      //   )
      // },
    },{
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (value, row, index) => {
        return(
          <Fragment key={index}>
              <a href="javascript:;" onClick={() => this.handleModalVisible(true,"edit",row)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="确定删除本条记录?" onConfirm={() => this.showDeleteConfirm(row)}>
                <a href="javascript:;" style={{color:"#FF3500"}}>删除</a>
              </Popconfirm>
          </Fragment>
        )
      }
    }];

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleEdit: this.handleEdit,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout title="反馈列表">
        <div>
            <Card bordered={false}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderForm()}</div>
                <div className={styles.tableListOperator}>
                  <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true, 'add')} >
                    添加
                  </Button>
                </div>
                <Table 
                  style={{backgroundColor:'white',marginTop:16}}
                  columns={columns} 
                  dataSource={data} 
                  pagination={pagination}
                />
              </div>
            </Card>
            <CreateForm {...parentMethods} {...this.state}/>
        </div>   
        
      </PageHeaderLayout>
    );
  }
}
