import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import {
 Form,
 Card,
 Icon,
 Input,
 Row,
 Col,
 Upload,
 Radio, 
 Button,
 message,
 Modal,
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

@connect(({ festivalManage, loading }) => ({
  festivalManage,
  loading: loading.models.festivalManage,
}))
@Form.create()
export default class FestivalEdit extends PureComponent {
  constructor(props) {
    super(props);
    const prevParams = props && props.location.params;
    let bgImg1334 = [];
    let bgImg1920 = [];
    let bgImg2160 = [];
    let bgImg2208 = [];
    let bgImg2436 = [];
    prevParams && prevParams.bgImg.forEach((value,index,array) => {
        if(value.indexOf('/750*1334') > 0) {
            let obj = {};
            obj.uid = -1*Math.random();
            obj.url = value;
            bgImg1334.push(obj);
        }
        if(value.indexOf('/1080*1920') > 0) {
            let obj1 = {};
            obj1.uid = -1*Math.random();
            obj1.url = value;
            bgImg1920.push(obj1);
        }
        if(value.indexOf('/1242*2208') > 0) {
            let obj2 = {};
            obj2.uid = -1*Math.random();
            obj2.url = value;
            bgImg2160.push(obj2);
        }
        if(value.indexOf('/1080*2160') > 0) {
            let obj3 = {};
            obj3.uid = -1*Math.random();
            obj3.url = value;
            bgImg2208.push(obj3);
        }
        if(value.indexOf('/1126*2436') > 0) {
            let obj4 = {};
            obj4.uid = -1*Math.random();
            obj4.url = value;
            bgImg2436.push(obj4);
        }
        // let bgImgObj = {};
        // bgImgObj.url = item;
        // bgImgObj.uid = -1 * Math.random();
        // bgImgArray.push(bgImgObj);
        // return bgImgArray;
    });
    this.state = {
      // params: props.location.query.title,
      fileListIcon: [{
        uid: -1,
        status: 'done',
        url: prevParams && prevParams.icon || '',
        // thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      }],
      fileListBanner: [{
        uid: -2,
        status: 'done',
        url: prevParams && prevParams.banner || '',
        // thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      }],
    //   fileListBgImg: bgImgArray,
      bgImg1334: bgImg1334,
      bgImg1920: bgImg1920,
      bgImg2160: bgImg2160,
      bgImg2208: bgImg2208,
      bgImg2436: bgImg2436,
      modal_1334: {size: '750*1334', bgImg : ''},
      modal_1920: {size: '1080*1920', bgImg : ''},
      modal_2160: {size: '1242*2208', bgImg : ''},
      modal_2208: {size: '1080*2160', bgImg : ''},
      modal_2436: {size: '1126*2436', bgImg : ''},
      id: prevParams && prevParams.id || '',
      banner: prevParams && prevParams.banner || '',
      bgImg: prevParams && prevParams.bgImg || [],
      festivalDate: prevParams &&  prevParams.festivalDate || '',
      name: prevParams && prevParams.name || '',
      typeName: prevParams && prevParams.typeName || '',
      sharingType: prevParams && String(prevParams.sharingType) || '',
      prevUrl: prevParams && prevParams.url || '',
      uploading: false,
      previewVisible: false,
      imgVisible: false,
      bannerBase64: '',
      iconBase64: '',
      showUrlInput: '0'
    };
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }   
  
  _goBack = () => {
    this.props.dispatch( routerRedux.goBack());
  }

  onRadioChange = (e) => {
    const that = this;
    that.props.form.setFieldsValue({
        sharingType: e.target.value,
    });
    this.setState({
        sharingType: e.target.value,
        showUrlInput: e.target.value,
    });
  }

  handleUpload = () => {
      const { modal_1334, modal_1920, modal_2160, modal_2208, modal_2436 } = this.state;
    //   if((bgImg1334 == '' && modal_1334.bgImg == '') || (bgImg1920 == '' && modal_1920.bgImg == '') ||  (bgImg2160 == '' && modal_2160.bgImg == '') || (bgImg2208 == '' && modal_2208.bgImg == '') ||  (bgImg2436 == '' && modal_2436.bgImg == '') ) {
    //     return message.error('图片详情不能为空');
    //   }
      this.setState({ uploading: true });
      let festivalArray = new Array();
      festivalArray.push(modal_1334,modal_1920,modal_2160,modal_2208,modal_2436);
      this.props.dispatch({
          type: 'festivalManage/festivalUpload',
          payload: {
            id: this.state.id,
            icon: this.state.iconBase64,
            banner : this.state.bannerBase64,
            type: 'festival',
            sharingType: this.state.inputUrl || this.state.prevUrl   ? '1' : '0',
            url: this.state.inputUrl || this.state.prevUrl,
            festivalArray: festivalArray,
            name: this.state.name,
          },
          callback: (res) => {
              if(res && res.code == '0'){
                this.setState({ 
                    uploading: false,
                });
                message.success('保存成功');
              }else{
                  this.setState({ uploading: false });
                  message.error(res && res.message || '服务器错误');
              }
          }
      });
  }

  goToUrl = () => {
      window.open(this.state.inputUrl || this.state.prevUrl );
  }

  normalizeAll = (value) => {
    this.setState({
        inputUrl: value,
    });
  }

  inputChange = (e) => {
    let inputUrl = this.refs.inputUrl.input.value
    this.setState({
        inputUrl: inputUrl,
        prevUrl: '',
    });
  }

  handleCancel = () =>{
    this.setState({ previewVisible: false })
  }

  handlePreview = (file) => {
    this.setState({
        previewImage: file.url || file.thumbUrl,
        previewVisible: true,
    });
  }

  render() {
    const { previewVisible, previewImage, uploading, fileListIcon, fileListBanner, bgImg1334, bgImg1920, bgImg2208, bgImg2160, bgImg2436 } = this.state;
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
    const propsIcon = {
        listType:"picture-card",
        // action: '/Weather/query',
        onRemove: (file) => {
            this.setState(({ fileListIcon }) => {
            const index = fileListIcon.indexOf(file);
            const newFileList = fileListIcon.slice();
            newFileList.splice(index, 1);
            return {
                fileListIcon: newFileList,
                iconBase64: '',
            };
            });
        },
        beforeUpload: (file) => {
            this.setState(({ fileListIcon }) => ({
                fileListIcon: [...fileListIcon, file],
                iconBase64: '',
            }));
            return false;
        },
        
        onChange(info) {
            getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                info.fileList[0].url = imgUrl;
                //转化后的base64
                that.setState({
                    iconBase64: imgUrl.substring(imgUrl.indexOf(',')+1),
                    fileListIcon: info.fileList
                })
            });
        },
        fileList: this.state.fileListIcon,
    };
   
    const propsBanner = {
        listType:"picture-card",
        // action: '/Weather/query',
        onRemove: (file) => {
            this.setState(({ fileListBanner }) => {
            const index = fileListBanner.indexOf(file);
            const newFileList = fileListBanner.slice();
            newFileList.splice(index, 1);
            return {
                fileListBanner: newFileList,
                bannerBase64: '',
            };
            });
        },
        beforeUpload: (file) => {
            this.setState(({ fileListBanner }) => ({
                fileListBanner: [...fileListBanner, file],
                bannerBase64: '',
            }));
            return false;
        },
        
        onChange(info) {
            getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                info.fileList[0].url = imgUrl;
                //转化后的base64
                that.setState({
                    bannerBase64: imgUrl.substring(imgUrl.indexOf(',')+1),
                    fileListBanner: info.fileList
                })
            });
        },
        fileList: this.state.fileListBanner,
    }
    const propsBgImg1334 = {
        listType:"picture-card",
        // action: '/Weather/query',
        onRemove: (file) => {
            this.setState(({ bgImg1334 }) => {
            const index = bgImg1334.indexOf(file);
            const newFileList = bgImg1334.slice();
            newFileList.splice(index, 1);
            return {
                bgImg1334: newFileList,
                modal_1334: {size: '750*1334', bgImg : ''},
            };
            });
        },
        beforeUpload: (file) => {
            this.setState(({ bgImg1334 }) => ({
                bgImg1334: [...bgImg1334, file],
                modal_1334: {size: '750*1334', bgImg : ''},
            }));
            return false;
        },
        
        onChange(info) {
            getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                info.fileList[0].url = imgUrl;
                //转化后的base64
                that.setState({
                    modal_1334: {size: '750*1334', bgImg : imgUrl.substring(imgUrl.indexOf(',')+1)},
                    bgImg1334: info.fileList
                })
            });
        },
        fileList: this.state.bgImg1334,
    };
    const propsBgImg1920 = {
        listType:"picture-card",
        // action: '/Weather/query',
        onRemove: (file) => {
            this.setState(({ bgImg1920 }) => {
            const index = bgImg1920.indexOf(file);
            const newFileList = bgImg1920.slice();
            newFileList.splice(index, 1);
            return {
                bgImg1920: newFileList,
                modal_1920: {size: '1080*1920', bgImg : ''},
            };
            });
        },
        beforeUpload: (file) => {
            this.setState(({ bgImg1920 }) => ({
                bgImg1920: [...bgImg1920, file],
                modal_1920: {size: '1080*1920', bgImg : ''},
            }));
            return false;
        },
        
        onChange(info) {
            getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                info.fileList[0].url = imgUrl;
                //转化后的base64
                that.setState({
                    modal_1920: {size: '1080*1920', bgImg : imgUrl.substring(imgUrl.indexOf(',')+1)},
                    bgImg1920: info.fileList
                })
            });
        },
        fileList: this.state.bgImg1920,
    };
    const propsBgImg2208 = {
        listType:"picture-card",
        // action: '/Weather/query',
        onRemove: (file) => {
            this.setState(({ bgImg2208 }) => {
            const index = bgImg2208.indexOf(file);
            const newFileList = bgImg2208.slice();
            newFileList.splice(index, 1);
            return {
                bgImg2208: newFileList,
                modal_2208: {size: '1242*2208', bgImg : ''},
            };
            });
        },
        beforeUpload: (file) => {
            this.setState(({ bgImg2208 }) => ({
                bgImg2208: [...bgImg2208, file],
                modal_2208: {size: '1242*2208', bgImg : ''},
            }));
            return false;
        },
        
        onChange(info) {
            getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                info.fileList[0].url = imgUrl;
                //转化后的base64
                that.setState({
                    modal_2208: {size: '1242*2208', bgImg : imgUrl.substring(imgUrl.indexOf(',')+1)},
                    bgImg2208: info.fileList
                })
            });
        },
        fileList: this.state.bgImg2208,
    };
    const propsBgImg2160 = {
        listType:"picture-card",
        // action: '/Weather/query',
        onRemove: (file) => {
            this.setState(({ bgImg2160 }) => {
            const index = bgImg2160.indexOf(file);
            const newFileList = bgImg2160.slice();
            newFileList.splice(index, 1);
            return {
                bgImg2160: newFileList,
                modal_2160: {size: '1080*2160', bgImg : ''},
            };
            });
        },
        beforeUpload: (file) => {
            this.setState(({ bgImg2160 }) => ({
                bgImg2160: [...bgImg2160, file],
                modal_2160: {size: '1080*2160', bgImg : ''},
            }));
            return false;
        },
        
        onChange(info) {
            getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                info.fileList[0].url = imgUrl;
                //转化后的base64
                that.setState({
                    modal_2160: {size: '1080*2160', bgImg : imgUrl.substring(imgUrl.indexOf(',')+1)},
                    bgImg2160: info.fileList
                })
            });
        },
        fileList: this.state.bgImg2160,
    };
    const propsBgImg2436 = {
        listType:"picture-card",
        // action: '/Weather/query',
        onRemove: (file) => {
            this.setState(({ bgImg2436 }) => {
            const index = bgImg2436.indexOf(file);
            const newFileList = bgImg2436.slice();
            newFileList.splice(index, 1);
            return {
                bgImg2436: newFileList,
                modal_2436: {size: '1126*2436', bgImg : ''},
            };
            });
        },
        beforeUpload: (file) => {
            this.setState(({ bgImg2436 }) => ({
                bgImg2436: [...bgImg2436, file],
                modal_2436: {size: '1126*2436', bgImg : ''},
            }));
            return false;
        },
        
        onChange(info) {
            getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                info.fileList[0].url = imgUrl;
                //转化后的base64
                that.setState({
                    modal_2436: {size: '1126*2436', bgImg : imgUrl.substring(imgUrl.indexOf(',')+1)},
                    bgImg2436: info.fileList
                })
            });
        },
        fileList: this.state.bgImg2436,
    };
    const { getFieldDecorator } = this.props.form;
    const title = <p><a href="javascript:void(0)" style={{marginRight:20,color:'rgba(0, 0, 0, 0.85)'}} onClick={() =>this._goBack()}><Icon type="left" style={{marginRight:5}}/>返回</a>编辑节日节气</p>;
    return (
      <PageHeaderLayout title={title}>
        <div>
              <Card bordered={false}>
                <div className={styles.tableList}>
                    <Form >
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='节日图标'>
                                <Upload {...propsIcon} onPreview={this.handlePreview}>
                                    {fileListIcon.length >= 1 ? null : 
                                        <div>
                                            <Icon type="upload" />
                                        </div>
                                    }
                                </Upload>
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='节日名称'>
                              <p>{this.state.name}</p>
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='节日类型'>
                              <p>{this.state.typeName}</p>
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='节日日期'>
                              <p>{this.state.festivalDate}</p>
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='分享页类型'>
                                {getFieldDecorator('sharingType',{
                                    initialValue: 0,
                                })(
                                    <RadioGroup onChange={this.onRadioChange}>
                                        <Radio value={0}>图片</Radio>
                                        <Radio value={1}>Html5</Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>
                        </Col>
                       
                      </Row>
                      {
                            this.state.showUrlInput == 1 ?
                            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                                <Col md={12} sm={24}>
                                    <FormItem {...formItemLayout} label={[]} colon={false}>
                                        {getFieldDecorator('stateUrl',{
                                            // normalize: this.normalizeAll,
                                            // initialValue: 0,
                                        })(<div><Input ref='inputUrl' defaultValue={(this.state.prevUrl || this.state.inputUrl  ) ? (this.state.prevUrl || this.state.inputUrl) : "请输入地址"} onChange={this.inputChange}/><a href="javascript:;" onClick={() => this.goToUrl()}>点击预览</a></div>)
                                        }
                                    </FormItem>
                                </Col>
                            </Row>  : null
                        }
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='Banner图片'>
                                <Upload {...propsBanner} onPreview={this.handlePreview}>
                                    {fileListBanner.length >= 1 ? null : 
                                        <div>
                                            <Icon type="upload" />
                                        </div>
                                    }
                                </Upload>
                            </FormItem>
                          </Col>
                      </Row>
                      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24}>
                            <FormItem {...formItemLayout} label='分享图片详情'>
                                <div style={{display:'flex',flexDirection:'row'}}>
                                    <Upload {...propsBgImg1334} onPreview={this.handlePreview}>
                                        {bgImg1334.length >= 1 ? null : 
                                            <div>
                                                <Icon type="plus" />
                                                <div className="ant-upload-text">750*1334px</div>
                                            </div>
                                        }
                                    </Upload>
                                    <Upload {...propsBgImg1920} onPreview={this.handlePreview}>
                                        {bgImg1920.length >= 1 ? null : 
                                            <div>
                                                <Icon type="plus" />
                                                <div className="ant-upload-text">1080*1920px</div>
                                            </div>
                                        }
                                    </Upload>
                                    <Upload {...propsBgImg2208} onPreview={this.handlePreview}>
                                        {bgImg2208.length >= 1 ? null : 
                                            <div>
                                                <Icon type="plus" />
                                                <div className="ant-upload-text">1242*2208px</div>
                                            </div>
                                        }
                                    </Upload>
                                    <Upload {...propsBgImg2160} onPreview={this.handlePreview}>
                                        {bgImg2160.length >= 1 ? null : 
                                            <div>
                                                <Icon type="plus" />
                                                <div className="ant-upload-text">1080*2160px</div>
                                            </div>
                                        }
                                    </Upload>
                                    <Upload {...propsBgImg2436} onPreview={this.handlePreview}>
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
                            <Button type="primary" onClick={this.handleUpload} style={{marginRight:20}} loading={uploading}>保存</Button>
                            <Button  onClick={this._goBack}>取消</Button>
                        </Col>
                    </Row>
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} width={300}>
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                </div> 
              </Card>
          </div>
      </PageHeaderLayout>
    );
  }
}
