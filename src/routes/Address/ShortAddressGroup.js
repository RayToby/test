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
 message,
 Popconfirm,
 Modal,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
const FormItem = Form.Item;
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleEdit, handleModalVisible, btn, params} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      btn == "add" ? handleAdd(fieldsValue) : handleEdit(fieldsValue);
    });
  };
  return (
    <Modal
      title="新增分组"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入名称' }],
          initialValue: params ? params.name : '',
        })(<Input placeholder="请输入名称" />)}
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
    name: '',
    page: 1,
    pageSize: 10,
    total: '',
    modalVisible: false,
  };

  componentDidMount() {
      this.handleSearch();
  }

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('name',{
                initialValue: ''
              })(<Input placeholder={'请输入名称'}/>)}
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
      type: 'shortAddress/addShortUrlGroup',
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
      type: 'shortAddress/updateShortUrlGroup',
      payload: {
        id: this.state.params.id,
        name: fields.name,
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
        name: fieldsValue.name,
        page: 1,
        pageSize: this.state.pageSize,
      };
      dispatch({
        type: 'shortAddress/queryShortUrlGroup',
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
        name: fieldsValue.name,
        page: this.state.page,
        pageSize: this.state.pageSize,
      };
      dispatch({
        type: 'shortAddress/queryShortUrlGroup',
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
        type: 'shortAddress/deleteShortUrlGroup',
        payload: {
          id: params.id,
          name: params.name,
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
        type: 'shortAddress/queryShortUrlGroup',
        payload: {
          name: fieldsValue.name,
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
    let {page, pageSize, total, data } = this.state;
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
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },{
      title: '简介',
      dataIndex: 'intro',
      key: 'intro',
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
