import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import {
 Form,
 Card,
 Icon,
 Input,
 Row,
 Col,
 Upload,
 Modal,
 Button,
 Radio,
 DatePicker,
 message,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

@connect(({ advertise, loading }) => ({
  advertise,
  loading: loading.models.advertise,
}))
@Form.create()
export default class AdverEdit extends PureComponent {
  constructor(props) {
    super(props);
    const prevParams = props && props.location.params;
    let bgImg1334 = [];
    let bgImg1920 = [];
    let bgImg2160 = [];
    let bgImg2208 = [];
    let bgImg2436 = [];
    let imgUrl1334 = '';
    let imgUrl1920 = '';
    let imgUrl2160 = '';
    let imgUrl2208 = '';
    let imgUrl2436 = '';
    prevParams && prevParams.content && prevParams.content.forEach((value,index,array) => {
        if(value.indexOf('/750*1334') > 0) {
            let obj = {};
            obj.uid = -1*Math.random();
            obj.url = value;
            bgImg1334.push(obj);
            imgUrl1334 = value.indexOf('.png') > 0 ? value.substring(value.indexOf('advert'),value.indexOf('.png')) : '';
        }
        if(value.indexOf('/1080*1920') > 0) {
            let obj1 = {};
            obj1.uid = -1*Math.random();
            obj1.url = value;
            bgImg1920.push(obj1);
            imgUrl1920 = value.indexOf('.png') > 0 ? value.substring(value.indexOf('advert'),value.indexOf('.png')) : '';
        }
        if(value.indexOf('/1242*2208') > 0) {
            let obj2 = {};
            obj2.uid = -1*Math.random();
            obj2.url = value;
            bgImg2160.push(obj2);
            imgUrl2160 = value.indexOf('.png') > 0 ? value.substring(value.indexOf('advert'),value.indexOf('.png')) : '';
        }
        if(value.indexOf('/1080*2160') > 0) {
            let obj3 = {};
            obj3.uid = -1*Math.random();
            obj3.url = value;
            bgImg2208.push(obj3);
            imgUrl2208 = value.indexOf('.png') > 0 ? value.substring(value.indexOf('advert'),value.indexOf('.png')) : '';
        }
        if(value.indexOf('/1126*2436') > 0) {
            let obj4 = {};
            obj4.uid = -1*Math.random();
            obj4.url = value;
            bgImg2436.push(obj4);
            imgUrl2436 = value.indexOf('.png') > 0 ? value.substring(value.indexOf('advert'),value.indexOf('.png')) : '';
        }
    });
    this.state = {
        bgImg1334: bgImg1334,
        bgImg1920: bgImg1920,
        bgImg2160: bgImg2160,
        bgImg2208: bgImg2208,
        bgImg2436: bgImg2436,
        imgUrl1334: imgUrl1334,
        imgUrl1920: imgUrl1920,
        imgUrl2160: imgUrl2160,
        imgUrl2208: imgUrl2208,
        imgUrl2436: imgUrl2436,
        modal_1334: { imgUrl: imgUrl1334, content : ''},
        modal_1920: { imgUrl: imgUrl1920, content : ''},
        modal_2160: { imgUrl: imgUrl2160, content : ''},
        modal_2208: { imgUrl: imgUrl2208, content : ''},
        modal_2436: { imgUrl: imgUrl2436, content : ''},
        prevUrl: prevParams && prevParams.url || '', 
        prevType: prevParams && String(prevParams.type) || '',
        prevName: prevParams && prevParams.name || '',  
        prevStartTime: prevParams && prevParams.startTime || '', 
        prevEndTime: prevParams && prevParams.endTime || '', 
        prevId: prevParams && prevParams.id || '', 
        uploading: false,
        previewVisible: false,
        imgVisible: false,
    };
  }

  componentDidMount() {

  }
  
  goBack = () => {
    this.props.dispatch( routerRedux.goBack());
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  
  handleCancel = () => {
    this.setState({ previewVisible: false });
  }

  handleUpload = () => {
    const { modal_1334, modal_1920, modal_2160, modal_2208, modal_2436,} = this.state;
    this.setState({ uploading: true });
    let sizeArray = [];
    sizeArray.push(modal_1334, modal_1920, modal_2160, modal_2208, modal_2436);
    this.props.form.validateFields((err, fieldsValue) => {
        if (err) return;
        if(Date.parse(fieldsValue.startTime) > Date.parse(fieldsValue.endTime)) {
            message.error('开始时间不能大于结束时间');
            this.setState({ uploading: false, });
            return;
        }
        fieldsValue.startTime = moment(fieldsValue.startTime).format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.endTime = moment(fieldsValue.endTime).format('YYYY-MM-DD HH:mm:ss');
        this.props.dispatch({
            type: 'advertise/modifyAdvert',
            payload: {
                advert: {
                    ...fieldsValue,
                    sizeArray: sizeArray,
                    id: this.state.prevId,
                }
            },
            callback: (res) => {
                if(res && res.code == '0') {
                    this.setState({ 
                        uploading: false,
                    });
                    message.success('保存成功');
                }else{
                    this.setState({ 
                        uploading: false,
                    });
                    message.error(res && res.message || '服务器错误');
                }
            }
        });
    });
  }

  _goBack = () => {
      this.props.dispatch(
          routerRedux.goBack()
      );
  }

  onRadioChange =  (e) => {
    this.props.form.setFieldsValue({
      type: e.target.value,
    });
  };

  //图片详情
  handlePreview = (file) => {
    this.setState({
        previewImage: file.url || file.thumbUrl,
        previewVisible: true,
    });
  }

  render() {
    const { previewVisible, previewImage,  bgImg1334, bgImg1920, bgImg2160, bgImg2208, bgImg2436, imgUrl1334, imgUrl1920, imgUrl2160, imgUrl2208, imgUrl2436,} = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12, offset: 1 },
      },
    };
    const that = this;
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
              modal_1334: { imgUrl: imgUrl1334, content : '', size: '750*1334'},
            };
            });
        },
        beforeUpload: (file) => {
            this.setState(({ bgImg1334 }) => ({
              bgImg1334: [...bgImg1334, file],
              modal_1334: { imgUrl: imgUrl1334, content : '', size: '750*1334'},
            }));
            return false;
        },
        
        onChange(info) {
            getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                info.fileList[0].url = imgUrl;
                //转化后的base64
                that.setState({
                    modal_1334: {imgUrl: imgUrl1334, content : imgUrl.substring(imgUrl.indexOf(',')+1), size: '750*1334'},
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
              modal_1920: {imgUrl: imgUrl1920, content : '', size: '1080*1920'},
            };
            });
        },
        beforeUpload: (file) => {
            this.setState(({ bgImg1920 }) => ({
              bgImg1920: [...bgImg1920, file],
              modal_1920: {imgUrl: imgUrl1920, content : '', size: '1080*1920'},
            }));
            return false;
        },
        
        onChange(info) {
            getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                info.fileList[0].url = imgUrl;
                //转化后的base64
                that.setState({
                    modal_1920: {imgUrl: imgUrl1920, content : imgUrl.substring(imgUrl.indexOf(',')+1), size: '1080*1920'},
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
              modal_2208: {imgUrl: imgUrl2208, content : '', size: '1242*2208',},
            };
            });
        },
        beforeUpload: (file) => {
            this.setState(({ bgImg2208 }) => ({
              bgImg2208: [...bgImg2208, file],
              modal_2208: {imgUrl: imgUrl2208, content : '', size: '1242*2208',},
            }));
            return false;
        },
        
        onChange(info) {
            getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                info.fileList[0].url = imgUrl;
                //转化后的base64
                that.setState({
                  modal_2208: {imgUrl: imgUrl2208, content : imgUrl.substring(imgUrl.indexOf(',')+1), size: '1242*2208',},
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
              modal_2160: {imgUrl: imgUrl2160, content : '', size: '1080*2160'},
            };
            });
        },
        beforeUpload: (file) => {
            this.setState(({ bgImg2160 }) => ({
              bgImg2160: [...bgImg2160, file],
              modal_2160: {imgUrl: imgUrl2160, content : '', size: '1080*2160'},
            }));
            return false;
        },
        
        onChange(info) {
            getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                info.fileList[0].url = imgUrl;
                //转化后的base64
                that.setState({
                    modal_2160: {imgUrl: imgUrl2160, content : imgUrl.substring(imgUrl.indexOf(',')+1), size: '1080*2160'},
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
              modal_2436: {imgUrl: imgUrl2436, content : '', size: '1126*2436'},
            };
            });
        },
        beforeUpload: (file) => {
            this.setState(({ bgImg2436 }) => ({
              bgImg2436: [...bgImg2436, file],
              modal_2436: {imgUrl: imgUrl2436, content : '', size: '1126*2436'},
            }));
            return false;
        },
        
        onChange(info) {
            getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                info.fileList[0].url = imgUrl;
                //转化后的base64
                that.setState({
                    modal_2436: {imgUrl: imgUrl2436, content : imgUrl.substring(imgUrl.indexOf(',')+1), size: '1126*2436'},
                    bgImg2436: info.fileList
                })
            });
        },
        fileList: this.state.bgImg2436,
    };
    let { getFieldDecorator } = this.props.form;
    const title = <p><a href="javascript:void(0)" style={{marginRight:20,color:'rgba(0, 0, 0, 0.85)'}} onClick={() =>this.goBack()}><Icon type="left" style={{marginRight:5}}/>返回</a>编辑广告</p>;
    const  disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < moment().startOf('hour');
    }
    return (
      <PageHeaderLayout title={title}>
        <div>
              <Card bordered={false}>
                <div className={styles.tableList}>
                    <Form >
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='广告位名称'>
                                {getFieldDecorator('name', {
                                rules: [{ required: true, message: '请输入广告位名称' }],
                                initialValue: this.state.prevName,
                                })(<Input placeholder={"请输入广告位名称"} />)}
                            </FormItem>
                        </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='广告资源类型' >
                                {getFieldDecorator('type', {
                                    rules: [{ required: true, message: '请选择' }],
                                    initialValue: this.state.prevType,
                                    })(
                                    <RadioGroup onChange={(e) => this.onRadioChange(e)}>
                                        <Radio value={'0'}>应用内</Radio>
                                        <Radio value={'1'}>应用外</Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='开始时间'>
                                {getFieldDecorator('startTime', {
                                    rules: [{ required: true, message: '请选择开始时间' }],
                                    initialValue: moment(this.state.prevStartTime),
                                })(<DatePicker style={{width: '100%'}} format="YYYY-MM-DD HH:mm:ss" disabledDate={disabledDate} showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} />)}
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='结束时间'>
                            {getFieldDecorator('endTime', {
                                rules: [{ required: true, message: '请选择结束时间' }],
                                initialValue: moment(this.state.prevEndTime),
                            })(<DatePicker style={{width: '100%'}} format="YYYY-MM-DD HH:mm:ss" disabledDate={disabledDate} showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}/>)}
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='广告URL'>
                                {getFieldDecorator('url', {
                                    rules: [{ required: true, message: '请输入广告URL' }],
                                    initialValue: this.state.prevUrl,
                                    })(<Input placeholder={"请输入广告URL"} />)}
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='广告资源'>
                                <div style={{display:'flex',flexDirection:'row'}}>
                                    <Upload {...props1334} onPreview={this.handlePreview}>
                                        {bgImg1334.length >= 1 ? null : 
                                            <div>
                                                <Icon type="plus" />
                                                <div className="ant-upload-text">750*1334px</div>
                                            </div>
                                        }
                                    </Upload>
                                    <Upload {...props1920} onPreview={this.handlePreview}>
                                        {bgImg1920.length >= 1 ? null : 
                                            <div>
                                                <Icon type="plus" />
                                                <div className="ant-upload-text">1080*1920px</div>
                                            </div>
                                        }
                                    </Upload>
                                    <Upload {...props2160} onPreview={this.handlePreview}>
                                        {bgImg2160.length >= 1 ? null : 
                                            <div>
                                                <Icon type="plus" />
                                                <div className="ant-upload-text">1080*2160px</div>
                                            </div>
                                        }
                                    </Upload>
                                    <Upload {...props2208} onPreview={this.handlePreview}>
                                        {bgImg2208.length >= 1 ? null : 
                                            <div>
                                                <Icon type="plus" />
                                                <div className="ant-upload-text">1242*2208px</div>
                                            </div>
                                        }
                                    </Upload>
                                    <Upload {...props2436} onPreview={this.handlePreview}>
                                        {bgImg2436.length >= 1 ? null : 
                                            <div>
                                                <Icon type="plus" />
                                                <div className="ant-upload-text">1126*2436px</div>
                                            </div>
                                        }
                                    </Upload>
                                </div>    
                                
                            </FormItem>
                          </Col>
                      </Row>
                    </Form>
                    <Row style={{marginTop:150}}>
                        <Col  span={12} style={{display:'flex',justifyContent:'flex-end'}}>
                            <Button type="primary" onClick={this.handleUpload} style={{marginRight:20}} loading={this.state.uploading}>保存</Button>
                            <Button  onClick={() => this._goBack()}>取消</Button>
                        </Col>
                    </Row>
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                </div> 
              </Card>
          </div>
      </PageHeaderLayout>
    );
  }
}
