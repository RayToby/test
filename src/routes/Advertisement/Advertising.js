import React, { PureComponent, Fragment } from 'react';
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
 Select,
 DatePicker,
 message,
 Icon,
 Popconfirm,
 Carousel,
 Modal,
 Badge,
 Upload,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import moment from 'moment';
import styles from '../SystemManagement/TableList.less';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Option } = Select;
const { RangePicker } = DatePicker;
const adverType = ['应用内','应用外'];
const statusMap = ['processing','success', 'warning', 'default' ];
const status = ['未开始','使用中','已结束','禁用'];
const switch_ = ['禁用','禁用','禁用', '启用'];

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, props1334, props1920, props2160, props2208, props2436, bgImg1334, bgImg1920, bgImg2160, bgImg2208, bgImg2436, } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if(Date.parse(fieldsValue.startTime) > Date.parse(fieldsValue.endTime)) {
        message.error('开始时间不能大于结束时间');
        return;
      }
      fieldsValue.startTime = moment(fieldsValue.startTime).format('YYYY-MM-DD HH:mm:ss');
      fieldsValue.endTime = moment(fieldsValue.endTime).format('YYYY-MM-DD HH:mm:ss');
      handleAdd(fieldsValue,form);
    });
  };
  const onRadioChange =  (e) => {
    form.setFieldsValue({
      type: e.target.value,
    });
  };
  
  const  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().startOf('hour');
  }
  return (
    <Modal
      title="新建广告"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {form.resetFields();handleModalVisible()}}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="广告位名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入广告位名称' }],
        })(<Input placeholder="请输入广告位名称" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="广告源类型">
        {form.getFieldDecorator('type', {
          rules: [{ required: true, message: '请选择' }],
          initialValue: 0,
        })(
          <RadioGroup onChange={onRadioChange} >
            <Radio value={0}>应用内</Radio>
            <Radio value={1}>应用外</Radio>
          </RadioGroup>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="广告URL">
        {form.getFieldDecorator('url', {
          rules: [{ message: '请输入广告URL' }],
        })(<Input placeholder="请输入广告URL" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="开始时间">
       {form.getFieldDecorator('startTime', {
          rules: [{ required: true, message: '请选择开始时间' }],
       })(<DatePicker
           style={{width: '100%'}}
           format="YYYY-MM-DD HH:mm:ss"
           disabledDate={disabledDate}
           showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
           />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="结束时间">
        {form.getFieldDecorator('endTime', {
            rules: [{ required: true, message: '请选择结束时间' }],
        })(<DatePicker
           style={{width: '100%'}}
           format="YYYY-MM-DD HH:mm:ss"
           disabledDate={disabledDate}
           showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
           />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="广告资源">
        {form.getFieldDecorator('content', {
          // rules: [{ required: true, message: '请上传' }],
        })(
          <div>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col  md={8} sm={24}>
                <Upload {...props1334}>
                  {bgImg1334.length >= 1 ? null : 
                        <div>
                            <Icon type="plus" />
                            <div className="ant-upload-text">750*1334px</div>
                        </div>
                  }
                </Upload>
              </Col>
              <Col  md={8} sm={24} offset={4}>
                <Upload {...props1920}>
                  {bgImg1920.length >= 1 ? null : 
                        <div>
                            <Icon type="plus" />
                            <div className="ant-upload-text">1080*1920px</div>
                        </div>
                  }
                </Upload>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col  md={8} sm={24}>
                <Upload {...props2160}>
                  {bgImg2160.length >= 1 ? null : 
                        <div>
                            <Icon type="plus" />
                            <div className="ant-upload-text">1080*2160px</div>
                        </div>
                  }
                </Upload>
              </Col>
              <Col  md={8} sm={24}  offset={4}>
                <Upload {...props2208}>
                  {bgImg2208.length >= 1 ? null : 
                        <div>
                            <Icon type="plus" />
                            <div className="ant-upload-text">1242*2208px</div>
                        </div>
                  }
                </Upload>
              </Col>
            </Row> 
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}> 
              <Col  md={8} sm={24}>
                <Upload {...props2436}>
                  {bgImg2436.length >= 1 ? null : 
                        <div>
                            <Icon type="plus" />
                            <div className="ant-upload-text">1126*2436px</div>
                        </div>
                  }
                </Upload>
              </Col>
            </Row>
          </div>
        )}
      </FormItem>
     
      
    </Modal>
  );
});

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
// In the fifth row, other columns are merged into first column
// by setting it's colSpan to be 0
@connect(({ advertise, loading }) => ({
  advertise,
  loading: loading.models.advertise,
}))
@Form.create()
export default class AdvertiseList extends PureComponent {
  state = {
    modalVisible: false,
    startTime: '',
    endTime: '',
    imgVisible: false,
    imgArray: [],
    page: 1,
    pageSize: 10,
    total: '',
    expandForm: false,
    bgImg1334: [],
    bgImg1920: [],
    bgImg2160: [],
    bgImg2208: [],
    bgImg2436: [],
    modal_1334: {size: '750*1334', content : ''},
    modal_1920: {size: '1080*1920', content : ''},
    modal_2160: {size: '1242*2208', content : ''},
    modal_2208: {size: '1080*2160', content : ''},
    modal_2436: {size: '1126*2436', content : ''},
  };

  componentDidMount() {
    const { dispatch, form } = this.props;
    form.validateFields((err) => {
      if (err) return;
      dispatch({
        type: 'advertise/queryAdList',
        payload: {
            page: this.state.page,
            pageSize: this.state.pageSize,
        },
        callback: (res) => {
          if(res && res.code == '0') {
            this.setState({
              data: res.data ? res.data.dataList : {},
              total: res.data.total ? res.data.total : '',
              // total: 4,
              // pageSize: 10
              page: 1,
            });
          }else{
            message.error(res && res.message || '服务器错误');
          }
        },
      });
    });
  }

  //重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      startTime: '',
      endTime: '',
    });
    dispatch({
      type: 'advertise/queryAdList',
        payload: {
            page: 1,
            pageSize: this.state.pageSize,
        },
        callback: (res) => {
          this.setState({
            data: res.data && res.data.dataList ? res.data.dataList : {},
            total: res.data.total ? res.data.total : '',
            page: 1
          });
        }
    });
  }
  //点击分页
  onClickPage(current, pageSize) {
    this.setState({page:current,pageSize:pageSize});

    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'advertise/queryAdList',
        payload: {
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            state: fieldsValue.state ? fieldsValue.state : "",
            page: current,
            pageSize: pageSize,
        },
        callback: (res) => {
          this.setState({
            data: res.data ? res.data.dataList : {},
            total: res.data.total ? res.data.total : '',
          });
        },
      });
    });
  }
  //编辑跳转
  edit = (params) => {
    this.props.dispatch( routerRedux.push({
      pathname: '/advertisement/advertisement-edit',
      params: params,
    }));
  }
  //预览图片
  seeImg = (imgArray,imgUrl) => {
    this.setState({
      imgArray: imgArray,
      imgVisible: true,
      imgUrl: imgUrl,
    });
  }   
  //点击图片跳转
  gotoImgUrl = () => {
    window.open(this.state.imgUrl)
  }

  imgCancel = () =>{
    this.setState({ imgVisible: false })
  }

  //编辑状态  禁用启用
  editAdverState = (row) => {
    this.props.dispatch({
        type: 'advertise/modifyState',
        payload: {
          advert: {
            id: row.id,
            state: row.state,
            startTime: row.state == 3 ? row.startTime : '',
            endTime: row.state == 3 ? row.endTime : '',
          }
        },
        callback: (res) => {
          if(res && res.code == '0'){
            this.handleFormReset();
          }else{
            message.error(res && res.message || '服务器错误');
          }
        }
    });
  }

  //删除当前行
  showDeleteConfirm = (params) => {
    let imgUrl1334 = '', imgUrl1920 = '', imgUrl2160 = '', imgUrl2208 = '', imgUrl2436 = '';
    params && params.content.forEach((value,index,array) => {
      if(value.indexOf('/750*1334') > 0) {
          imgUrl1334 = value.substring(value.indexOf('advert'),value.indexOf('.png'));
      }
      if(value.indexOf('/1080*1920') > 0) {
          imgUrl1920 = value.substring(value.indexOf('advert'),value.indexOf('.png'));
      }
      if(value.indexOf('/1242*2208') > 0) {
          imgUrl2160 = value.substring(value.indexOf('advert'),value.indexOf('.png'));
      }
      if(value.indexOf('/1080*2160') > 0) {
          imgUrl2208 = value.substring(value.indexOf('advert'),value.indexOf('.png'));
      }
      if(value.indexOf('/1126*2436') > 0) {
          imgUrl2436 = value.substring(value.indexOf('advert'),value.indexOf('.png'));
      }
    })
    
    this.props.dispatch({
      type: 'advertise/removeAdvert',
      payload: {
        id: params.id,
        name: params.name,
        sizeArray: [imgUrl1334,imgUrl1920,imgUrl2160,imgUrl2208,imgUrl2436],
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
  //modal显示隐藏
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  }

  //新增广告
  handleAdd = (fields, form) => {
    const { modal_1334, modal_1920, modal_2160, modal_2208, modal_2436 } = this.state;
    if(modal_1334.content == '' || modal_1920.content == '' || modal_2160.content == '' || modal_2208.content == '' || modal_2436.content == '') {
      message.error('必须上传5张图片');
      return;
    }
    form.resetFields();
    let sizeArray = [];
    sizeArray.push(modal_1334, modal_1920, modal_2160, modal_2208, modal_2436)
    this.props.dispatch({
      type: 'advertise/addAdvert',
      payload: {
        advert: {
          ...fields,
          sizeArray: sizeArray,
        }
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

  dateSelect = (date,dateString) => {
    this.setState({
      startTime: dateString[0],
      endTime: dateString[1],
    });
  }
 //搜索广告
  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      fieldsValue.startTime = this.state.startTime ? this.state.startTime : '';
      fieldsValue.endTime = this.state.endTime ? this.state.endTime : '';
      dispatch({
        type: 'advertise/queryAdList',
        payload: {
          ...fieldsValue,
          page: this.state.page,
          pageSize: this.state.pageSize,
        },
        callback: (res) => {
          this.setState({
            data: res.data ? res.data.dataList : {},
            total: res.data.total ? res.data.total : '',
            page: 1,
          });
        },
      });
    });
  };

 
  renderForm = () => {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="广告位名称">
              {getFieldDecorator('name',{
                initialValue: "",
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24} style={{display:'flex',justifyContent:'center'}}>
            <label style={{color: 'rgba(0, 0, 0, 0.85)',marginRight:18}}>时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;间:</label>
            <RangePicker onChange={this.dateSelect} style={{flex:1}} value={(this.state.startTime && this.state.endTime) ? [moment(this.state.startTime),moment(this.state.endTime)] : ''}/>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="状 态">
              {getFieldDecorator('state',{
                initialValue: "",
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  <Option value="0">未开始</Option>
                  <Option value="1">使用中</Option>
                  <Option value="2">已结束</Option>
                  <Option value="3">禁用</Option>
              </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
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
        <Row gutter={{ md: 8, lg: 24, xl: 48}}>
          
        </Row>
      </Form>
    );
  }

  render() {
    const { bgImg1334 } = this.state;
    const { list } = this.props.advertise.data &&  this.props.advertise.data.data || [];
    const that = this;
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
    const columns = [{
      title: '广告位名称',
      dataIndex: 'name',
      key: 'name',
    },{
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
    },{
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
    },{
      title: '广告资源类型',
      dataIndex: 'type',
      key: 'type',
      render: (value, row, index) => {
        return(
            <span key={index}>{adverType[value]}</span>
        )
      },
    },{
      title: '广告资源',
      dataIndex: 'content',
      key: 'content',
      render: (value, row, index) => {
        return(
          <Fragment key={index}>
              <a href="javascript:;" onClick={() => this.seeImg(row.content, row.url)}>图片</a>
          </Fragment>
        )
      }
    },{
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      render: (value, row, index) => {
        return <Badge key={index} status={statusMap[row.state]} text={status[row.state]} />;
      },
    },{
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (value, row, index) => {
        return(
          <Fragment key={index}>
            <a href="javascript:void(0);" onClick={() => this.edit(row)}>编辑</a>
            <Divider type="vertical" />
            <a href="javascript:;" onClick={() => this.editAdverState(row)} className={row.state == 3 ? null : styles.stateRed}>{switch_[row.state]}</a>
            <Divider type="vertical" />
            <Popconfirm title="确定删除本条记录?" onConfirm={() => this.showDeleteConfirm(row)}>
             <a href="javascript:;" style={{color:"#FF3500"}}>删除</a>
            </Popconfirm>
            <Divider type="vertical" />
          </Fragment>
          )
      }
    }];
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    const props1334 = {
      listType:"picture-card",
      // action: '/Weather/query',
      onRemove: (file) => {
          this.setState(({ bgImg1334 }) => {
          const index = bgImg1334.indexOf(file);
          const newFileList = bgImg1334.slice();
          newFileList.splice(index, 1);
          return {
            bgImg1334: newFileList,
            modal_1334: {size: '750*1334', content : ''},
          };
          });
      },
      beforeUpload: (file) => {
          this.setState(({ bgImg1334 }) => ({
            bgImg1334: [...bgImg1334, file],
            modal_1334: {size: '750*1334', content : ''},
          }));
          return false;
      },
      
      onChange(info) {
          getBase64(info.fileList[0].originFileObj, (imgUrl) => {
              info.fileList[0].url = imgUrl;
              //转化后的base64
              that.setState({
                  modal_1334: {size: '750*1334', content : imgUrl.substring(imgUrl.indexOf(',')+1)},
                  bgImg1334: info.fileList
              })
          });
      },
      fileList: this.state.bgImg1334,
    };
    const props1920 = {
      listType:"picture-card",
      // action: '/Weather/query',
      onRemove: (file) => {
          this.setState(({ bgImg1920 }) => {
          const index = bgImg1920.indexOf(file);
          const newFileList = bgImg1334.slice();
          newFileList.splice(index, 1);
          return {
            bgImg1920: newFileList,
            modal_1920: {size: '1080*1920', content : ''},
          };
          });
      },
      beforeUpload: (file) => {
          this.setState(({ bgImg1920 }) => ({
            bgImg1920: [...bgImg1920, file],
            modal_1920: {size: '1080*1920', content : ''},
          }));
          return false;
      },
      
      onChange(info) {
          getBase64(info.fileList[0].originFileObj, (imgUrl) => {
              info.fileList[0].url = imgUrl;
              //转化后的base64
              that.setState({
                  modal_1920: {size: '1080*1920', content : imgUrl.substring(imgUrl.indexOf(',')+1)},
                  bgImg1920: info.fileList
              })
          });
      },
      fileList: this.state.bgImg1920,
    };
    const props2208 = {
      listType:"picture-card",
      // action: '/Weather/query',
      onRemove: (file) => {
          this.setState(({ bgImg2208 }) => {
          const index = bgImg2208.indexOf(file);
          const newFileList = bgImg2208.slice();
          newFileList.splice(index, 1);
          return {
            bgImg2208: newFileList,
            modal_2208: {size: '1242*2208', content : ''},
          };
          });
      },
      beforeUpload: (file) => {
          this.setState(({ bgImg2208 }) => ({
            bgImg2208: [...bgImg2208, file],
            modal_2208: {size: '1242*2208', content : ''},
          }));
          return false;
      },
      
      onChange(info) {
          getBase64(info.fileList[0].originFileObj, (imgUrl) => {
              info.fileList[0].url = imgUrl;
              //转化后的base64
              that.setState({
                modal_2208: {size: '1242*2208', content : imgUrl.substring(imgUrl.indexOf(',')+1)},
                bgImg2208: info.fileList
              })
          });
      },
      fileList: this.state.bgImg2208,
    };
    const props2160 = {
      listType:"picture-card",
      // action: '/Weather/query',
      onRemove: (file) => {
          this.setState(({ bgImg2160 }) => {
          const index = bgImg2160.indexOf(file);
          const newFileList = bgImg2160.slice();
          newFileList.splice(index, 1);
          return {
            bgImg2160: newFileList,
            modal_2160: {size: '1080*2160', content : ''},
          };
          });
      },
      beforeUpload: (file) => {
          this.setState(({ bgImg2160 }) => ({
            bgImg2160: [...bgImg2160, file],
            modal_2160: {size: '1080*2160', content : ''},
          }));
          return false;
      },
      
      onChange(info) {
          getBase64(info.fileList[0].originFileObj, (imgUrl) => {
              info.fileList[0].url = imgUrl;
              //转化后的base64
              that.setState({
                  modal_2160: {size: '1080*2160', content : imgUrl.substring(imgUrl.indexOf(',')+1)},
                  bgImg2160: info.fileList
              })
          });
      },
      fileList: this.state.bgImg2160,
    };
    const props2436 = {
      listType:"picture-card",
      // action: '/Weather/query',
      onRemove: (file) => {
          this.setState(({ bgImg2436 }) => {
          const index = bgImg2436.indexOf(file);
          const newFileList = bgImg2436.slice();
          newFileList.splice(index, 1);
          return {
            bgImg2436: newFileList,
            modal_2436: {size: '1126*2436', content : ''},
          };
          });
      },
      beforeUpload: (file) => {
          this.setState(({ bgImg2436 }) => ({
            bgImg2436: [...bgImg2436, file],
            modal_2436: {size: '1126*2436', content : ''},
          }));
          return false;
      },
      
      onChange(info) {
          getBase64(info.fileList[0].originFileObj, (imgUrl) => {
              info.fileList[0].url = imgUrl;
              //转化后的base64
              that.setState({
                  modal_2436: {size: '1126*2436', content : imgUrl.substring(imgUrl.indexOf(',')+1)},
                  bgImg2436: info.fileList
              })
          });
      },
      fileList: this.state.bgImg2436,
    };

    return (
      <PageHeaderLayout title="广告位列表">
        <div>
            <Card bordered={false}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderForm()}</div>
                <div className={styles.tableListOperator}>
                  <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)} >
                    添加
                  </Button>
                </div>
                <Table 
                  style={{backgroundColor:'white',marginTop:16}}
                  columns={columns} 
                  dataSource={this.state.data} 
                  pagination={pagination}
                  rowKey={'key'}
                />
              </div>
              <Modal visible={this.state.imgVisible} footer={null} onCancel={this.imgCancel} width={360}>
                  <Carousel autoplay>
                    {this.state.imgArray.length > 0  && this.state.imgArray.map((item, i) => {
                      return <div onClick={this.gotoImgUrl} key={i}><img alt={i} src={item}  width='320' /></div>
                    })}
                  </Carousel>
              </Modal>
              <CreateForm {...parentMethods} modalVisible={this.state.modalVisible} {...this.state} 
                props1334={props1334} props1920={props1920} props2208={props2208} props2160={props2160} 
                props2436={props2436}
              />
            </Card>
        </div>   
        
      </PageHeaderLayout>
    );
  }
}
