import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
    Card, Row, Col, Radio, Form, Button, DatePicker, Input, Select, Table, message, Badge, Popconfirm, Modal, TimePicker, 
} from 'antd';
import styles from '../SystemManagement/TableList.less';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

const newsState = ['全部','正常','删除','待发布','审核不通过'];
const newsGroup = ['全部','头条','娱乐','笑话','国际','段子','问答','视频'];
const contentType = ['全部','图文','多图','视频','问答'];
const pushType = ['未推送','推送中','已撤销','推送结束'];
const statusMap = ['default', 'processing','warning','success'];

const CreateForm = Form.create()(props => {
    const { modalVisible, form, handlePush, handleRePush, handleModalVisible, rowParams, onRadioChange, state, repush } = props;
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        fieldsValue.time = fieldsValue.time ? moment(fieldsValue.time).format('HH:mm:ss')  : moment(new Date().getTime()).format('HH:mm:ss');
        fieldsValue.pushTime = fieldsValue.pushTime ? (moment(fieldsValue.pushTime).format('YYYY-MM-DD') + " " + fieldsValue.time)  : ( moment(new Date()).format('YYYY-MM-DD') + " " + fieldsValue.time);
        form.resetFields();
        repush == 'repush' ? handleRePush(fieldsValue) : handlePush(fieldsValue);
      });
    };
    const  disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < moment().endOf('day');
    }
    return (
      <Modal
        title="推送头条"
        visible={modalVisible}
        onOk={okHandle}
        onCancel={() => {form.resetFields();handleModalVisible()}}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="推送标题">
            {form.getFieldDecorator('title', {
                rules: [{ required: true, message: '请输入推送标题' }],
                initialValue: rowParams ? rowParams.title : '',
            })(<TextArea rows={4} placeholder="请输入推送标题" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="推送">
            {form.getFieldDecorator('state', {
                rules: [{ required: true, message: '请选择' }],
                initialValue: state,
            })(
                <RadioGroup onChange={onRadioChange}>
                    <Radio value={0}>立即推送</Radio>
                    <Radio value={1}>定时推送</Radio>
                </RadioGroup>
            )}
        </FormItem>
        {
            state ?
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="日期">
            {form.getFieldDecorator('pushTime', {
            })(<DatePicker 
                    style={{width: '100%'}}
                    disabledDate={disabledDate}
                />
            )}
             </FormItem>
            :null
        }
        {
           state ?
           <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="时间">
           {form.getFieldDecorator('time', {
           })(<TimePicker style={{width: '100%'}} />,
           )}
            </FormItem>
           :null 
        }
      </Modal>
    );
  });

@connect(({ headLine, loading }) => ({
  headLine,
  loading: loading.models.headLine,
}))
@Form.create()
export default class HeadLineManage extends PureComponent {
    state = {
        page: 1,
        pageSize: 10,
        title: '',
        newsState: '-1',
        newsGroup: '-1',
        newsType: '-1',
        beginDay: '',
        endDay: '',
        contentType: '',
        newsSource: '',
        orderBy: '',
        loading: false,
        modalVisible: false,
        state: 0,
    }
    componentDidMount() {
        this.handleSearch();
    }
    //查询
    handleSearch = () => {
        this.setState({loading: true});
        const { dispatch, form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            dispatch({
                type: 'headLine/queryHeadLine',
                payload: {
                  index: this.state.page - 1,
                  size: this.state.pageSize,
                  title: fieldsValue.title ? fieldsValue.title : '',
                  newsState: '-1',
                  newsGroup: String(fieldsValue.newsGroup) ? fieldsValue.newsGroup : '',
                  newsType: '-1',
                  beginDay: this.state.beginDay,//fieldsValue.beginDay ?  moment(fieldsValue.beginDay).format('YYYY-MM-DD') : '',
                  endDay: this.state.endDay,//fieldsValue.endDay ? moment(fieldsValue.endDay).format('YYYY-MM-DD') : '',
                  contentType: String(fieldsValue.contentType) ? fieldsValue.contentType : '',
                  newsSource: fieldsValue.newsSource ? fieldsValue.newsSource : '',
                  orderBy: String(fieldsValue.orderBy) ? fieldsValue.orderBy : '',
                },
                callback: (res) => {
                    if(res && res.code == '0') {
                        this.setState({
                            data: res.data ? res.data.dataList : [],
                            total: res.data ? res.data.sumCount : '',
                            loading: false,
                        });
                    }else {
                        message.error(res && res.message || '服务器错误');
                        this.setState({loading: false});
                    }
                }
            });

        });
    }

    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
          formValues: {},
          loading: true,
          clickDays: undefined,
          beginDay: '',
          endDay: '',
        //   startTime: '',
        //   endTime: '',
        });
        dispatch({
          type: 'headLine/queryHeadLine',
            payload: {
                index: 0,
                size: 10,
                newsState: '-1',
                newsGroup: '-1',
                newsType: '-1',
                contentType: '-1'
            },
            callback: (res) => {
                if(res && res.code == '0') {
                    this.setState({
                        data: res.data ? res.data.dataList : [],
                        total: res.data ? res.data.sumCount : '',
                        page: 1,
                        loading: false
                    });
                }else {
                    message.error(res && res.message || '服务器错误');
                    this.setState({loading: false});
                }
            }
        });
    }

    onClickPage(current, pageSize) {
        this.setState({page:current,pageSize:pageSize,loading: true});
        const { dispatch, form } = this.props;
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          dispatch({
            type: 'headLine/queryHeadLine',
            payload: {
                index: current - 1,
                size: pageSize,
                title: fieldsValue.title ? fieldsValue.title : '',
                newsState: '-1',
                newsGroup: String(fieldsValue.newsGroup) ? fieldsValue.newsGroup : '',
                newsType: '-1',
                beginDay: this.state.beginDay,//fieldsValue.beginDay ?  moment(fieldsValue.beginDay).format('YYYY-MM-DD') : '',
                endDay: this.state.endDay,//fieldsValue.endDay ? moment(fieldsValue.endDay).format('YYYY-MM-DD') : '',
                contentType: String(fieldsValue.contentType) ? fieldsValue.contentType : '',
                newsSource: fieldsValue.newsSource ? fieldsValue.newsSource : '',
                orderBy: String(fieldsValue.orderBy) ? fieldsValue.orderBy : '',
            },
            callback: (res) => {
              if(res && res.code == '0'){
                this.setState({
                  data: res.data ? res.data.dataList : [],
                  total: res.data.sumCount ? res.data.sumCount : '',
                  loading: false,
                });
              }else{
                message.error(res && res.message || '服务器错误');
                this.setState({loading: false});
              }
              
            },
          });
        });
    }
    //日期加减
    addDate = (days, date) => { 
        var d=new Date(date); 
        d.setDate(d.getDate()+Number(days)); 
        var month=d.getMonth()+1; 
        var day = d.getDate(); 
        if(month<10){ 
           month = "0"+month; 
         } 
        if(day<10){ 
          day = "0"+day; 
         } 
        var val = d.getFullYear()+"-"+month+"-"+day; 
        return val; 
     }
     //点击天数
    daysClick = (days, date = new Date()) => {
        const beginDay = days ? this.addDate(days, date) : ''; //全部的话  起始日期不设
        this.setState({clickDays: days, loading: true, beginDay: beginDay, endDay: days ? moment(new Date()).format('YYYY-MM-DD') : '',})
        const { dispatch, form } = this.props;
        form.validateFields((err, fieldsValue) => {
           if (err) return;
           dispatch({
               type: 'headLine/queryHeadLine',
               payload: {
                 index: 0,
                 size: this.state.pageSize,
                 title: fieldsValue.title ? fieldsValue.title : '',
                 newsState: '-1',
                 newsGroup: String(fieldsValue.newsGroup) ? fieldsValue.newsGroup : '',
                 newsType: '-1',
                 beginDay: beginDay,
                 endDay: days ? moment(new Date()).format('YYYY-MM-DD') : '',
                 contentType: String(fieldsValue.contentType) ? fieldsValue.contentType : '',
                 newsSource: fieldsValue.newsSource ? fieldsValue.newsSource : '',
                 orderBy: String(fieldsValue.orderBy) ? fieldsValue.orderBy : '',
               },
               callback: (res) => {
                   if(res && res.code == '0') {
                       this.setState({
                           data: res.data ? res.data.dataList : [],
                           total: res.data ? res.data.sumCount : '',
                           loading: false,
                       });
                   }else {
                       message.error(res && res.message || '服务器错误');
                       this.setState({loading: false});
                   }
               }
            });

        });
    }
    //撤销推送
    showDeleteConfirm = (params) => {
        this.setState({loading: true})
        const dispatch  = this.props.dispatch;
        dispatch({
            type: 'headLine/revokePush',
            payload: {
                id: params.newsId,
                pushType: params.pushType,
            },
            callback: (res) => {
                if(res && res.code == '0'){
                    this.handleFormReset();
                    message.success('撤销成功');
                    this.setState({loading: false});
                }else{
                    message.error(res && res.message || '服务器错误');
                    this.setState({loading: false})
                }
            }
        });
    }

    onRadioChange = (e) => {
        this.props.form.setFieldsValue({
          state: e.target.value,
        });
        this.setState({
            state: e.target.value,
        })
    } 

    handleModalVisible = (flag, params, repush) => {
        this.setState({
            modalVisible: !!flag,
            rowParams: params,
            repush: repush,
            state: 0, 
        });
    }
    //重新推送
    handleRePush = (fields) => {
        this.setState({loading: true})
        const dispatch  = this.props.dispatch;
        dispatch({
            type: 'headLine/revokePush',
            payload: {
                id: this.state.rowParams.newsId,
                pushType: this.state.rowParams.pushType,
                ...fields,
            },
            callback: (res) => {
                if(res && res.code == '0'){
                    this.handleFormReset();
                    message.success('重新推送成功');
                }else{
                    message.error(res && res.message || '服务器错误');
                }
            }
        });
        this.setState({
            modalVisible: false,
            loading: false
        });
    }
    //推送
    handlePush = (fields) => {
        this.setState({loading: true})
        const dispatch  = this.props.dispatch;
        dispatch({
            type: 'headLine/headlinePush',
            payload: {
                headline: {
                    id: this.state.rowParams.newsId,
                    // title: params.title,
                    newsSource: this.state.rowParams.newsSource,
                    newsGroup: this.state.rowParams.newsGroup,
                    // pushTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                    uid: JSON.parse(localStorage.getItem('userId')),
                    pushType: this.state.rowParams.pushType,
                    newsAbstract: this.state.rowParams.newsAbstract,
                    contentType: this.state.rowParams.contentType,
                    ...fields,
                },
            },
            callback: (res) => {
                if(res && res.code == '0'){
                    this.handleFormReset();
                    message.success('推送成功');
                }else{
                    message.error(res && res.message || '服务器错误');
                }
            }
        });
        this.setState({
            modalVisible: false,
            loading: false
        });
    }

    renderForm = () => {
        const { getFieldDecorator } = this.props.form;
        return (
        <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={24}>
                    <FormItem label="新闻标题">
                    {getFieldDecorator('title')(<Input placeholder="请输入新闻标题" />)}
                    </FormItem>
                </Col>
                {/* <Col md={6} sm={24}>
                    <FormItem label="开始日期">
                    {getFieldDecorator('beginDay',{
                        // initialValue: moment([]),
                    })(<DatePicker style={{width:'100%'}}/>)}
                    </FormItem>
                </Col>
                <Col md={6} sm={24}>
                    <FormItem label="结束日期">
                    {getFieldDecorator('endDay',{
                        // initialValue: moment([]),
                    })(<DatePicker style={{width:'100%'}}/>)}
                    </FormItem>
                </Col> */}
                <Col md={8} sm={24}>
                    <FormItem label="内容类型">
                    {getFieldDecorator('contentType',{
                        initialValue: "-1",
                    })(
                        <Select placeholder="请选择" style={{ width: '100%' }}>
                            <Option value="-1">全部</Option>
                            <Option value="0">图文</Option>
                            <Option value="1">多图</Option>
                            <Option value="2">视频</Option>
                            <Option value="3">问答</Option>
                        </Select>
                        )}
                    </FormItem>
                </Col>
                <Col md={8} sm={24}>
                    <FormItem label="新闻分组">
                    {getFieldDecorator('newsGroup',{
                        initialValue: "-1",
                    })(
                        <Select placeholder="请选择" style={{ width: '100%' }}>
                            <Option value="-1">全部</Option>
                            <Option value="0">头条</Option>
                            <Option value="1">娱乐</Option>
                            <Option value="2">笑话</Option>
                            <Option value="3">国际</Option>
                            <Option value="4">段子</Option>
                            <Option value="5">问答</Option>
                            <Option value="20">视频</Option>
                        </Select>
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}> 
                <Col md={8} sm={24}>
                    <FormItem label="来&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;源">
                    {getFieldDecorator('newsSource',{
                        initialValue: "",
                    })(
                        <Select placeholder="请选择" style={{ width: '100%' }}>
                            <Option value="">全部</Option>
                            <Option value="西瓜视频">西瓜视频</Option>
                            <Option value="悟空问答">悟空问答</Option>
                            <Option value="糗事百科">糗事百科</Option>
                            <Option value="新浪新闻">新浪新闻</Option>
                            <Option value="凤凰新闻">凤凰新闻</Option>
                            <Option value="网易新闻">网易新闻</Option>
                            <Option value="搜狐新闻">搜狐新闻</Option>
                            <Option value="凤凰科技">凤凰科技</Option>
                            <Option value="澎湃新闻">澎湃新闻</Option>
                            <Option value="环球网">环球网</Option>
                            <Option value="新浪体育">新浪体育</Option>
                        </Select>
                        )}
                    </FormItem>
                </Col>
                <Col md={8} sm={24}  style={{display:'flex',justifyContent:'flex-start'}}>
                    <FormItem label="排&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;序">
                    {getFieldDecorator('orderBy',{
                        initialValue: '',
                    })(
                        <RadioGroup onChange={this.onRadioChange}>
                            <Radio value={''}>时间</Radio>
                            <Radio value={0}>热度</Radio>
                            <Radio value={1}>综合</Radio>
                        </RadioGroup>
                    )}
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
                        <span className={this.state.clickDays == '0' ? styles.stateBlue : ''} style={{marginLeft:15,cursor:'pointer'}} onClick={()=> this.daysClick('0')}>今天</span>
                        <span className={this.state.clickDays == '-7' ? styles.stateBlue : ''} style={{marginLeft:10,cursor:'pointer'}} onClick={()=> this.daysClick('-7')}>7天</span>
                        <span className={this.state.clickDays == '-14' ? styles.stateBlue : ''} style={{marginLeft:10,cursor:'pointer'}} onClick={()=> this.daysClick('-14')}>14天</span>
                        <span className={this.state.clickDays == '-30' ? styles.stateBlue : ''} style={{marginLeft:10,cursor:'pointer'}} onClick={()=> this.daysClick('-30')}>30天</span>
                        <span className={this.state.clickDays == undefined ? styles.stateBlue : ''} style={{marginLeft:10,cursor:'pointer'}} onClick={()=> this.daysClick()}>全部</span>
                        <a href="javascript:;" style={{marginLeft:10}} onClick={()=> this.handleFormReset()}>刷新</a>
                    </span>
                </Col>
            </Row>
        </Form>
        );
    }
    render() {
        const { total, data, page, pageSize, modalVisible, rowParams} = this.state;
        const columns = [{
            title: '新闻发布时间',
            dataIndex: 'addTime',
            width: 150,
             render: (value, row, index) => {
                return(
                    <span key={index}>{moment(value).format('YYYY-MM-DD')}</span>
                );
            },
        }, {
            title: '新闻标题',
            dataIndex: 'title',
            render: (value, row, index) => {
                return(
                    <a href={row.newsInfoUrl || row.newsSourceUrl} target="blank" key={index}>{value}</a>
                );
            },
        }, {
            title: '新闻分组',
            dataIndex: 'newsGroup',
            width: 200,
            render: (value, row, index) => {
                return(
                    <span key={index}>{value == 20 ? '视频' : newsGroup[Number(value) + 1]}</span>
                )
            }
        }, {
            title: '内容类型',
            dataIndex: 'contentType',
            width: 150,
            render: (value, row, index) => {
                return(
                    <span key={index}>{value == 20 ? '视频' : contentType[Number(value) + 1]}</span>
                )
            }
        }, {
            title: '来源',
            dataIndex: 'newsSource',
            width: 150,
            render: (value, row, index) => {
                return(
                    <span key={index}>{value}</span>
                )
            }
        }, {
            title: '推送状态',
            dataIndex: 'pushType',
            width: 150,
            render: (value, row, index) => {
                return <Badge status={statusMap[value]} text={pushType[value]} key={index}/>;
            }
        }, {
            title: '操作',
            dataIndex: 'operation',
            width: 150,
            render: (value , row, index) => {
                if(row.pushType == '0') {
                    return(
                        <a key={index} href="javascript:;" onClick={() => this.handleModalVisible(true,row)}>{'推送'}</a>
                    );
                }else if(row.pushType == '1') {
                    return(
                        <Fragment key={index}>
                            <Popconfirm title={"确定撤销推送本条记录?"} onConfirm={() => this.showDeleteConfirm(row)}>
                                <a href="javascript:;" className={styles.stateOrange}>{'撤销推送'}</a>
                            </Popconfirm>
                        </Fragment>
                    );
                }else if(row.pushType == '2') {
                    return(
                        <Fragment key={index}>
                            <a key={index} href="javascript:;" onClick={() => this.handleModalVisible(true,row,'repush')}>{'重新推送'}</a>
                        </Fragment>
                    );
                }else{
                    return(
                        <span key={index}>{'--'}</span>
                    );
                } 
            }
        }];

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
        };

        const parentMethods = {
            handlePush: this.handlePush,
            handleModalVisible: this.handleModalVisible,
            onRadioChange: this.onRadioChange,
            handleRePush: this.handleRePush,
        };
        
        return (
                <div>
                    <Card bordered={false}>
                        <div className={styles.tableList}>
                            <div className={styles.tableListForm}>{this.renderForm()}</div>
                            <Table 
                                style={{backgroundColor:'white',marginTop:16}}
                                columns={columns} 
                                dataSource={data} 
                                pagination={pagination}
                                loading={this.state.loading}
                            />
                        </div>
                        <CreateForm {...parentMethods} {...this.state}/>
                    </Card>
                </div>
        );
    }
}
