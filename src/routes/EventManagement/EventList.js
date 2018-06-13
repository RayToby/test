import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
    Card,
    Table,
    Form,
    message,
    Row,
    Col,
    Input,
    Button,
    Modal,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
import moment from 'moment';
const FormItem = Form.Item;
@connect(({ event, loading }) => ({
    event,
    loading: loading.models.event,
}))
@Form.create()
export default class EventList extends PureComponent {
    state = {
        page: 1,
        pageSize: 10,
        eventId: '',
        introduce: '',
        loading: false,
        modalVisible: false,
    }

    componentDidMount() {
        this.getEventList();
    }

    getEventList = () => {
        this.setState({loading: true});
        this.props.form.validateFields((err, fieldsValue) => {
            this.props.dispatch({
                type: 'events/getEventList',
                payload: {
                    eventId: this.state.eventId,
                    introduce: fieldsValue.introduce,
                    page: this.state.page,
                    pageSize: this.state.pageSize,
                },
                callback: (res) => {
                    if(res && res.code =='0') {
                        this.setState({
                            data: res.data && res.data.dataList,
                            total: res.data && res.data.total,
                            loading: false,
                        });
                    }else {
                        message.error(res && res.message || '服务器错误');
                        this.setState({loading: fasle});
                    }
                }
            });
        });
    }
    
    handleFormReset = () => {  
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
          page: 1,
          pageSize: 10,
          eventId: '',
          introduce: '',
          loading: true,
        });
        dispatch({
          type: 'events/getEventList',
            payload: {
                page: 1,
                pageSize: 10,
                eventId: '',
                introduce: '',
            },
            callback: (res) => {
                if(res && res.code == '0') {
                    this.setState({
                        data: res.data ? res.data.dataList : [],
                        total: res.data ? res.data.total : '',
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
    
    renderForm() {
        const { getFieldDecorator } = this.props.form;
        return (
        <Form onSubmit={this.getEventList} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={24}>
                    <FormItem label="事件名称">
                        {getFieldDecorator('introduce',{
                            initialValue: '',
                        })(<Input placeholder="请输入事件名称" />)}
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

    onClickPage(current, pageSize) {
        this.setState({ page:current, pageSize:pageSize,loading:true});
        const { dispatch, form } = this.props;
        form.validateFields((err, fieldsValue) => {
          if (err) return;
            dispatch({
                type: 'events/getEventList',
                payload: {
                    eventId: this.state.eventId,
                    introduce: fieldsValue.introduce,
                    page: current,
                    pageSize: pageSize,
                },
                callback: (res) => {
                    if(res && res.code == '0'){
                        this.setState({
                            data: res.data ? res.data.dataList : [],
                            total: res.data.total ? res.data.total : '',
                            loading: false,
                        });
                    }else{
                        message.error(res && res.message || '服务器错误')
                        this.setState({loading: false});
                    }
                },
            });
            
        });
    }
    
    _dialog = (params) => {
        this.props.dispatch({
            type: 'events/eventStatus',
            payload: {
                eventId: params.id,
                status: params.status,
            },
            callback: (res) => {
                if(res && res.code == '0') {
                    this.setState({
                        modalVisible: true,
                        dataDetail: res.data,
                    });
                }else {
                    message.error(res && res.message || '服务器错误');
                }
            }
        });
    }

    handleCancel = () => {
        this.setState({ modalVisible: false });
    }
    
    render() {
        const { total, page, pageSize, loading, modalVisible } = this.state;
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
        // let paginationDetail = {
        //     defaultCurrent: 1,
        //     // current: page,
        //     // pageSize: pageSize,
        //     // showSizeChanger: true,
        //     // showQuickJumper: true,
        // };
        const columns = [{
            title: '事件名称',
            dataIndex: 'introduce',
            key: 'introduce',
            width: 500,
          }, {
            title: '事件日期',
            dataIndex: 'content',
            key: 'content',
          },
        //    {
        //     title: '提醒时间',
        //     dataIndex: 'remindTimes',
        //     key: 'remindTimes',
        //   },           {
        //     title: '提醒次数',
        //     dataIndex: 'remindCounts',
        //     key: 'remindCounts',
        //   },
        // {
        //     title: '预提醒',
        //     dataIndex: 'beginning',
        //     key: 'beginning',
        // },
        {
            title: '提示音',
            dataIndex: 'ring',
            key: 'ring',
            render: (value, row, index) => {
                return(
                    <span key={index}>{row.ring == 'girl' ? '女声' : '男声'}</span>
                )
            },
        }, {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: (value, row, index) => {
                return(
                    <a key={index} href='javascript:;' onClick={() => this._dialog(row)}>查看详情</a>
                )
            }
        }];

        const columnsDetail = [{
            title: '时间',
            dataIndex: 'time',
            key: 'time',
            render: (value, row, index) => {
                return(<span key={index}>{moment(row.time).format('YYYY-MM-DD HH:mm:ss')}</span>)
            },
          }, {
            title: '次数',
            dataIndex: 'sendCount',
            key: 'sendCount',
          }, {  
            title: '是否预提醒',
            dataIndex: 'beginnings',
            key: 'beginnings',
            render: (value, row, index) => {
                let unit = '';
                const unit_num = row.beginnings ? row.beginnings.substring(0,row.beginnings.indexOf(':')) : '';
                const unit_value = row.beginnings ? row.beginnings.substring(row.beginnings.indexOf(':')+1) : '';
                switch( unit_num ) {
                    case '1':
                        unit = '分钟';
                        break;
                    case '2':
                        unit = '小时';
                        break;
                    case '3':
                        unit = '天';
                        break;
                    case '4':
                        unit = '周';
                        break;
                    case '5':
                        unit = '月';
                        break;
                    case '6':
                        unit = '年';
                        break;
                    default:
                        unit = '分钟';
                }
                return(<span key={index}>{(unit_value && unit ) ? `每${unit_value}${unit}` : '未设置'}</span>)
            },
        }];
       
        return(
            <PageHeaderLayout title='事件列表' >
                <div>
                    <Card bordered={false} >
                        <div className={styles.tableList} >
                            <div className={styles.tableListForm}>{this.renderForm()}</div>
                            <Table 
                                style={{backgroundColor: 'white', marginTop: 16}}
                                columns={columns}
                                dataSource={this.state.data}
                                pagination={pagination}
                                loading={loading}
                            />
                        </div>
                    </Card>
                    <Modal 
                        visible={modalVisible} 
                        footer={null} 
                        onCancel={this.handleCancel}
                        title="事件详情"
                        width={800}
                    >
                        <Table 
                            columns={columnsDetail}
                            dataSource={this.state.dataDetail}
                            // pagination={paginationDetail}
                            // loading={loading}
                        />
                    </Modal>
                </div>
            </PageHeaderLayout>
        )
    }
}