import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
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
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from '../SystemManagement/TableList.less';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
// In the fifth row, other columns are merged into first column
// by setting it's colSpan to be 0
@connect(({ feedback, loading }) => ({
  feedback,
  loading: loading.models.feedback,
}))
@Form.create()
export default class FeedBackList extends PureComponent {
  state = {
    startCreateDate: '',
    overCreateDate: '',
    page: 1,
    pageSize: 10,
    total: '',
  };

  componentDidMount() {
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        startCreateDate: this.state.startCreateDate,
        overCreateDate: this.state.overCreateDate,
        contactWay: fieldsValue.contactWay ? fieldsValue.contactWay : "",
        clientSystem: fieldsValue.clientSystem ? fieldsValue.clientSystem : "",
        appVersion: fieldsValue.appVersion ? fieldsValue.appVersion : "",
        page: this.state.page,
        pageSize: this.state.pageSize,
      };

      // this.setState({
      //   formValues: values,
      // });

      dispatch({
        type: 'feedback/queryFeedbackList',
        payload: values,
        callback: (res) => {
          if(res && res.code == '0') {
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
  }

  dateSelect = (date,dateString) => {
    this.setState({
      startCreateDate: dateString[0],
      overCreateDate: dateString[1],
    });
  }
  renderForm() {
    const { getFieldDecorator } = this.props.form;
    // const role = roleList.length > 0 ? roleList.map((item, i) => {
    //   return <Option value={item.id} key={i}>{item.name}</Option>
    // }) : <Option value="-1">暂无</Option>;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24} style={{display:'flex',alignItems:'center'}}>
              <label style={{color: 'rgba(0, 0, 0, 0.85)',marginRight:18}}>时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;间:</label>
              <RangePicker onChange={this.dateSelect.bind(this)} style={{flex:1}} value={(this.state.startCreateDate && this.state.overCreateDate) ? [moment(this.state.startCreateDate),moment(this.state.overCreateDate)] : ''} />
          </Col>
          <Col md={8} sm={24}  style={{display:'flex',justifyContent:'center'}}>
            <FormItem label="客户端系统">
              {getFieldDecorator('clientSystem',{
                initialValue: "",
              })(
                <RadioGroup onChange={this.onRadioChange} initialValue={1}>
                  <Radio value={""}>全选</Radio>
                  <Radio value={2}>Ios</Radio>
                  <Radio value={1}>Android</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="版本号">
              {getFieldDecorator('appVersion')(<Input placeholder="请输入版本号" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>  
          <Col md={8} sm={24}>
            <FormItem label="联系方式">
              {getFieldDecorator('contactWay',{
                // rules: [{
                //   message: '联系方式不正确',
                //   validator: this.validatecontactWay,
                // }],
                // validateTrigger: 'onBlur',
              })(<Input placeholder="请输入手机号,QQ或邮箱" />)}
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
              {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a> */}
            </span>
          </Col>
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

  onRadioChange = (e) => {
    this.props.form.setFieldsValue({
      clientSystem: e.target.value,
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
      type: 'feedback/queryFeedbackList',
        payload: {
          page: 1,
          pageSize: this.state.pageSize,
        },
        callback: (res) => {
          if(res && res.code == '0') {
            this.setState({
              data: res.data && res.data.dataList ? res.data : {},
              total: res.data.total ? res.data.total : '',
              page: 1,
            });
          }else{
            message.error(res && res.message || '服务器错误')
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
        contactWay: fieldsValue.contactWay ? fieldsValue.contactWay : "",
        clientSystem: fieldsValue.clientSystem ? fieldsValue.clientSystem : "",
        appVersion: fieldsValue.appVersion ? fieldsValue.appVersion : "",
        page: 1,
        pageSize: this.state.pageSize,
      };

      // this.setState({
      //   formValues: values,
      // });

      dispatch({
        type: 'feedback/queryFeedbackList',
        payload: values,
        callback: (res) => {
          if(res && res.code == '0'){
            this.setState({
              data: res.data ? res.data : {},
              total: res.data.total ? res.data.total : '',
              page: 1,
            });
          }else{
            message.error(res && res.message || '服务器错误')
          }
        },
      });
    });
  };

  onClickPage(current, pageSize) {
    this.setState({page:current,pageSize:pageSize});

    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'feedback/queryFeedbackList',
        payload: {
          startCreateDate: this.state.startCreateDate,
          overCreateDate: this.state.overCreateDate,
          contactWay: fieldsValue.contactWay ? fieldsValue.contactWay : "",
          clientSystem: fieldsValue.clientSystem ? fieldsValue.clientSystem : "",
          appVersion: fieldsValue.appVersion ? fieldsValue.appVersion : "",
          page: current,
          pageSize: pageSize,
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
  }

  render() {
    const { dataList } =  this.props.feedback.data &&  this.props.feedback.data.data || [];//
    let {page, pageSize, total} = this.state;
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
    const renderContent = (value, row, index) => {
      const obj = {
        // children: value,
        // props: {},
      };
      const name = [];
      value.map((item, i) => {
        const opt = (i == value.length - 1) ? <div>{item.name}</div> : <div>{item.name}<Divider/></div>;
        name.push(opt)
      });
      obj.children = name;
      return obj;
    };
    const columns = [{
      title: '反馈时间',
      dataIndex: 'createDate',
      key: 'createDate',
    }, {
      title: '联系方式',
      dataIndex: 'contactWay',
      key: 'contactWay',
      // render: renderContent,
    }, {
      title: '反馈内容',
      dataIndex: 'content',
      key: 'content',
      // render: (value, row, index) => {
      //   const obj1 = {
          
      //   };
      //   const name1 = [];
      //   row.children1.map((item, i) => {
      //     const opt1 = (i == row.children1.length - 1) ? <div>{item.type}</div> : <div>{item.type}<Divider/></div>;
      //     name1.push(opt1)
      //   });
      //   obj1.children = name1;
      //   return obj1;
      // },
    },{
      title: '客户端系统',
      dataIndex: 'clientSystem',
      key: 'clientSystem',
      render: (value, row, index) => {
        let sys = "";
        if(row.clientSystem == '1') {
          sys = 'Android';
        }else if(row.clientSystem == '2') {
          sys = 'iOS';
        }
        return(
          <span>{sys}</span>
        )
      },
    },{
      title: '版本号',
      dataIndex: 'appVersion',
      key: 'appVersion',
    }];
    return (
      <PageHeaderLayout title="反馈列表">
        <div>
            <Card bordered={false}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderForm()}</div>
                <Table 
                  style={{backgroundColor:'white',marginTop:16}}
                  columns={columns} 
                  dataSource={dataList} 
                  pagination={pagination}
                />
              </div>
            </Card>
        </div>   
        
      </PageHeaderLayout>
    );
  }
}
