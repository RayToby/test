import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
    Icon, Row, Col, Button, Upload, message, Tabs,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Card.less';
const TabPane = Tabs.TabPane;

const weatherType = ["晴天","阴天","多云","雾霾","风","雨","暴雨","雷阵雨","小雪","大雪","雨夹雪","小雨","中雨"];
const sizeArray = ["750*1334","1080*1920","1242*2208","1080*2160","1126*2436"];

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

// In the fifth row, other columns are merged into first column
// by setting it's colSpan to be 0
@connect(({ weatherManage, loading }) => ({
  weatherManage,
  loading: loading.models.weatherManage,
}))

// function base64Url(url, callback) {
//     let xhr = new XMLHttpRequest();
//     xhr.onload = function() {
//       let reader = new FileReader();
//       reader.onloadend = function() {
//         callback(reader.result);
//       }
//       reader.readAsDataURL(xhr.response);
//     };
//     xhr.open('GET', url);
//     xhr.responseType = 'blob';
//     xhr.send();
//   }
  
//   const url = 'http://img15.3lian.com/2015/f1/38/d/41.jpg'
//   base64Url(url, (result) => {
//       console.log("result base64 url was", result)
//   })
export default class WeatherList extends PureComponent {
  state = {
      index: '0',
      typeName: '暴雨',
      id: '1',
      dateState: 'datetime',
      fileList: [],
      fileList1: [],
      fileList2: [],
      fileList3: [],
      fileList4: [],
      fileListNight: [],
      fileListNight1: [],
      fileListNight2: [],
      fileListNight3: [],
      fileListNight4: [],
      modal: {key: '750*1334', img: ''},
      modal1: {key: '1080*1920', img: ''},
      modal2: {key: '1242*2208', img: ''},
      modal3: {key: '1080*2160', img: ''},
      modal4: {key: '1126*2436', img: ''},
      modalNight: {key: '750*1334', img: ''},
      modalNight1: {key: '1080*1920', img: ''},
      modalNight2: {key: '1242*2208', img: ''},
      modalNight3: {key: '1080*2160', img: ''},
      modalNight4: {key: '1126*2436', img: ''},
      uploading: false,
      mode: 'top',
      weatherList: [],
      tabs1Content: true,
      activeKey: '1',
  }

  fetchImg = (state,typeName) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'weatherManage/queryWeather',
      payload: {
        typeName: typeName,
        state: state,
        sizeArray: sizeArray,
      },
      callback: (res) => {
          if(res && res.code == '0'){
                const urlArray = res.data.urlArray;
                const fileList = [];
                const fileList1 = [];
                const fileList2 = [];
                const fileList3 = [];
                const fileList4 = [];
                const fileListNight = [];
                const fileListNight1 = [];
                const fileListNight2 = [];
                const fileListNight3 = [];
                const fileListNight4 = [];
                urlArray.length > 0 && urlArray.forEach((value,index,array) => {
                    if(value.indexOf('datetime/750*1334') > 0) {
                        let obj = {};
                        obj.uid = -1*Math.random();
                        obj.url = value;
                        fileList.push(obj);
                    }
                    if(value.indexOf('datetime/1080*1920') > 0) {
                        let obj1 = {};
                        obj1.uid = -1*Math.random();
                        obj1.url = value;
                        fileList1.push(obj1);
                    }
                    if(value.indexOf('datetime/1242*2208') > 0) {
                        let obj2 = {};
                        obj2.uid = -1*Math.random();
                        obj2.url = value;
                        fileList2.push(obj2);
                    }
                    if(value.indexOf('datetime/1080*2160') > 0) {
                        let obj3 = {};
                        obj3.uid = -1*Math.random();
                        obj3.url = value;
                        fileList3.push(obj3);
                    }
                    if(value.indexOf('datetime/1126*2436') > 0) {
                        let obj4 = {};
                        obj4.uid = -1*Math.random();
                        obj4.url = value;
                        fileList4.push(obj4);
                    }
                    if(value.indexOf('night/750*1334') > 0) {
                        let objNight = {};
                        objNight.uid = -1*Math.random();
                        objNight.url = value;
                        fileListNight.push(objNight);
                    }
                    if(value.indexOf('night/1080*1920') > 0) {
                        let objNight1 = {};
                        objNight1.uid = -1*Math.random();
                        objNight1.url = value;
                        fileListNight1.push(objNight1);
                    }
                    if(value.indexOf('night/1242*2208') > 0) {
                        let objNight2 = {};
                        objNight2.uid = -1*Math.random();
                        objNight2.url = value;
                        fileListNight2.push(objNight2);
                    }
                    if(value.indexOf('night/1080*2160') > 0) {
                        let objNight3 = {};
                        objNight3.uid = -1*Math.random();
                        objNight3.url = value;
                        fileListNight3.push(objNight3);
                    }
                    if(value.indexOf('night/1126*2436') > 0) {
                        let objNight4 = {};
                        objNight4.uid = -1*Math.random();
                        objNight4.url = value;
                        fileListNight4.push(objNight4);
                    }
                })
                this.setState({
                    weatherList: res.data.weatherList,
                    fileList: fileList,
                    fileList1: fileList1,
                    fileList2: fileList2,
                    fileList3: fileList3,
                    fileList4: fileList4,
                    fileListNight: fileListNight,
                    fileListNight1: fileListNight1,
                    fileListNight2: fileListNight2,
                    fileListNight3: fileListNight3,
                    fileListNight4: fileListNight4,
                    previewImage: fileList.length > 0 && fileList[0].url || '',
                    previewVisible: true,
                    previewImageNight: fileListNight.length > 0 && fileListNight[0].url || '',
                    previewVisibleNight: true,
                })
        }else{
            message.error(res && res.message || '服务器错误')
        }
      }
    });
  }
  componentDidMount() {
    this.fetchImg('datetime',this.state.typeName);
  }

  handleCancel = () => this.setState({ previewVisible: false, previewVisibleNight: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handlePreviewNight = (file) => {
    this.setState({
      previewImageNight: file.url || file.thumbUrl,
      previewVisibleNight: true,
    });
  }

  handleUpload = () => {
    const { modal, modal1, modal2, modal3, modal4, modalNight, modalNight1, modalNight2, modalNight3, modalNight4 } = this.state;
    // if(this.state.dateState == 'datetime' && (modal.img == '' && modal1.img == '' && modal2.img == '' && modal3.img == '' && modal4.img == '')) {
    //     return message.error('必须上传5张或者更改5张图片');
    // }
    // if(this.state.dateState == 'night' && (modalNight.img == '' && modalNight1.img == '' && modalNight2.img == '' && modalNight3.img == '' && modalNight4.img == '')) {
    //     return message.error('必须上传5张或者更改5张图片');
    // }
    this.setState({ uploading: true });
    let weatherArray = new Array();
    this.state.dateState == 'datetime' ? weatherArray.push(modal, modal1, modal2, modal3, modal4) : weatherArray.push(modalNight, modalNight1, modalNight2, modalNight3, modalNight4);
    this.props.dispatch({
        type: 'weatherManage/uploadWeather',
        payload: {
            weatherArray: weatherArray,
            typeName: this.state.typeName,
            type: 'weather',
            state: this.state.dateState,
        },
        callback: (res) => {
            if(res && res.code == '0') {
                this.setState({
                    data: res.data ? res.data : {},
                    uploading: false,
                });
                message.success('上传成功');
            }else{
                this.setState({
                    uploading: false,
                });
                message.success('上传失败');
            }
        },
    });
  }

  reset = () => {
    this.setState({
        fileList: [],
        fileList1: [],
        fileList2: [],
        fileList3: [],
        fileList4: [],
        fileListNight: [],
        fileListNight1: [],
        fileListNight2: [],
        fileListNight3: [],
        fileListNight4: [],
        previewVisible: false,
        previewVisibleNight: false,
    });
  }

  changeLabel = (index, typeName, id) => {
    this.setState({
        index: index,
        typeName: typeName,
        id: id,
        activeKey: '1',
        tabs1Content: true,
        // state: ''
    });
    this.fetchImg('datetime',typeName);
  }

  tabClick = (e) => {
      e == '1'?
        this.setState({
            tabs1Content: true,
            dateState: 'datetime',
            activeKey: '1'
        })
      : 
        this.setState({
            tabs1Content: false,
            dateState: 'night',
            activeKey: '2',
        })

        this.fetchImg(e == '1' ? 'datetime' : 'night', this.state.typeName);
  }

  render() {
    const that = this;
    const { previewVisible, previewVisibleNight, previewImage, previewImageNight, fileList, fileList1, fileList2, fileList3, fileList4, fileListNight, fileListNight1, fileListNight2, fileListNight3, fileListNight4, uploading, mode  } = this.state;
    const props = {
        img:{
            listType:"picture-card",
            // action: '/Weather/query',
            onRemove: (file) => {
                this.setState(({ fileList }) => {
                const index = fileList.indexOf(file);
                const newFileList = fileList.slice();
                newFileList.splice(index, 1);
                return {
                    fileList: newFileList,
                    // previewVisible: false,
                    modal: {key: '750*1334', img: ''},
                };
                });
            },
            beforeUpload: (file) => {
                this.setState(({ fileList }) => ({
                fileList: [...fileList, file],
                modal: {key: '750*1334', img: ''},
                })
            );
                return false;
            },
            
            onChange(info) {
                getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                    info.fileList[0].url = imgUrl;
                    //转化后的base64
                    that.setState({
                        modal: {id: that.state.id, key: '750*1334', img: imgUrl.substring(imgUrl.indexOf(',')+1)},
                        fileList: info.fileList,
                        previewImage: imgUrl,
                        previewVisible: true,
                    })
                });
            },
            fileList: this.state.fileList,
        },
        img1:{
            listType:"picture-card",
            action: '/Weather/query',
            onRemove: (file) => {
                this.setState(({ fileList1 }) => {
                const index = fileList1.indexOf(file);
                const newFileList = fileList1.slice();
                newFileList.splice(index, 1);
                return {
                    fileList1: newFileList,
                    // previewVisible: false,
                    modal1: {key: '1080*1920', img: ''},
                };
                });
            },
            beforeUpload: (file) => {
                this.setState(({ fileList1 }) => ({
                fileList1: [...fileList1, file],
                modal1: {key: '1080*1920', img: ''},
                }));
                return false;
            },
            
            onChange(info) {
                getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                    info.fileList[0].url = imgUrl;
                    //转化后的base64
                    that.setState({
                        modal1: {id: that.state.id, key: '1080*1920', img: imgUrl.substring(imgUrl.indexOf(',')+1)},
                        fileList1: info.fileList,
                        previewImage: imgUrl,
                        previewVisible: true,
                    })
                });
            },
            fileList: this.state.fileList1,
        },
        img2:{
            listType:"picture-card",
            action: '/Weather/query',
            onRemove: (file) => {
                this.setState(({ fileList2 }) => {
                const index = fileList2.indexOf(file);
                const newFileList = fileList2.slice();
                newFileList.splice(index, 1);
                return {
                    fileList2: newFileList,
                    // previewVisible: false,
                    modal2: {key: '1242*2208', img: ''},
                };
                });
            },
            beforeUpload: (file) => {
                this.setState(({ fileList2 }) => ({
                fileList2: [...fileList2, file],
                modal2: {key: '1242*2208', img: ''},
                }));
                return false;
            },
            
            onChange(info) {
                getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                    info.fileList[0].url = imgUrl;
                    //转化后的base64
                    that.setState({
                        modal2: {id: that.state.id, key: '1242*2208', img: imgUrl.substring(imgUrl.indexOf(',')+1)},
                        fileList2: info.fileList,
                        previewImage: imgUrl,
                        previewVisible: true,
                    })
                });
            },
            fileList: this.state.fileList2,
        },
        img3:{
            listType:"picture-card",
            action: '/Weather/query',
            onRemove: (file) => {
                this.setState(({ fileList3 }) => {
                const index = fileList3.indexOf(file);
                const newFileList = fileList3.slice();
                newFileList.splice(index, 1);
                return {
                    fileList3: newFileList,
                    // previewVisible: false,
                    modal3: {key: '1080*2160', img: ''},
                };
                });
            },
            beforeUpload: (file) => {
                this.setState(({ fileList3 }) => ({
                fileList3: [...fileList3, file],
                modal3: {key: '1080*2160', img: ''},
                }));
                return false;
            },
            
            onChange(info) {
                getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                    info.fileList[0].url = imgUrl;
                    //转化后的base64
                    that.setState({
                        modal3: {id: that.state.id, key: '1080*2160', img: imgUrl.substring(imgUrl.indexOf(',')+1)},
                        fileList3: info.fileList,
                        previewImage: imgUrl,
                        previewVisible: true,
                    })
                });
            },
            fileList: this.state.fileList3,
        },
        img4:{
            listType:"picture-card",
            action: '/Weather/query',
            onRemove: (file) => {
                this.setState(({ fileList4 }) => {
                const index = fileList4.indexOf(file);
                const newFileList = fileList4.slice();
                newFileList.splice(index, 1);
                return {
                    fileList4: newFileList,
                    // previewVisible: false,
                    modal4: {key: '1126*2436', img: ''},
                };
                });
            },
            beforeUpload: (file) => {
                this.setState(({ fileList4 }) => ({
                fileList4: [...fileList4, file],
                modal4: {key: '1126*2436', img: ''},
                }));
                return false;
            },
            
            onChange(info) {
                getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                    info.fileList[0].url = imgUrl;
                    //转化后的base64
                    that.setState({
                        modal4: {id: that.state.id, key: '1126*2436', img: imgUrl.substring(imgUrl.indexOf(',')+1)},
                        fileList4: info.fileList,
                        previewImage: imgUrl,
                        previewVisible: true,
                    })
                });
            },
            fileList: this.state.fileList4,
        },
    };
    const props1 = {
        img:{
            listType:"picture-card",
            action: '/Weather/query',
            onRemove: (file) => {
                this.setState(({ fileListNight }) => {
                const index = fileListNight.indexOf(file);
                const newFileList = fileListNight.slice();
                newFileList.splice(index, 1);
                return {
                    fileListNight: newFileList,
                    // previewVisibleNight: false,
                    modalNight: {key: '750*1334', img: ''},
                };
                });
            },
            beforeUpload: (file) => {
                this.setState(({ fileListNight }) => ({
                    fileListNight: [...fileListNight, file],
                    modalNight: {key: '750*1334', img: ''},
                }));
                return false;
            },
            
            onChange(info) {
                getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                    info.fileList[0].url = imgUrl;
                    //转化后的base64
                    that.setState({
                        modalNight: {id: that.state.id, key: '750*1334', img: imgUrl.substring(imgUrl.indexOf(',')+1)},
                        fileListNight: info.fileList,
                        previewImageNight: imgUrl,
                        previewVisibleNight: true,
                    })
                });
            },
            fileList: this.state.fileListNight,
        },
        img1:{
            listType:"picture-card",
            action: '/Weather/query',
            onRemove: (file) => {
                this.setState(({ fileListNight1 }) => {
                const index = fileListNight1.indexOf(file);
                const newFileList = fileListNight1.slice();
                newFileList.splice(index, 1);
                return {
                    fileListNight1: newFileList,
                    // previewVisibleNight: false,
                    modalNight1: {key: '1080*1920', img: ''},
                };
                });
            },
            beforeUpload: (file) => {
                this.setState(({ fileListNight1 }) => ({
                    fileListNight1: [...fileListNight1, file],
                    modalNight1: {key: '1080*1920', img: ''},
                }));
                return false;
            },
            
            onChange(info) {
                getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                    info.fileList[0].url = imgUrl;
                    //转化后的base64
                    that.setState({
                        modalNight1: {id: that.state.id, key: '1080*1920', img: imgUrl.substring(imgUrl.indexOf(',')+1)},
                        fileListNight1: info.fileList,
                        previewImageNight: imgUrl,
                        previewVisibleNight: true,
                    })
                });
            },
            fileList: this.state.fileListNight1,
        },
        img2:{
            listType:"picture-card",
            action: '/Weather/query',
            onRemove: (file) => {
                this.setState(({ fileListNight2 }) => {
                const index = fileListNight2.indexOf(file);
                const newFileList = fileListNight2.slice();
                newFileList.splice(index, 1);
                return {
                    fileListNight2: newFileList,
                    // previewVisibleNight: false,
                    modalNight2: {key: '1242*2208', img: ''},
                };
                });
            },
            beforeUpload: (file) => {
                this.setState(({ fileListNight2 }) => ({
                    fileListNight2: [...fileListNight2, file],
                    modalNight2: {key: '1242*2208', img: ''},
                }));
                return false;
            },
            
            onChange(info) {
                getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                    info.fileList[0].url = imgUrl;
                    //转化后的base64
                    that.setState({
                        modalNight2: {id: that.state.id, key: '1242*2208', img: imgUrl.substring(imgUrl.indexOf(',')+1)},
                        fileListNight2: info.fileList,
                        previewImageNight: imgUrl,
                        previewVisibleNight: true,
                    })
                });
            },
            fileList: this.state.fileListNight2,
        },
        img3:{
            listType:"picture-card",
            action: '/Weather/query',
            onRemove: (file) => {
                this.setState(({ fileListNight3 }) => {
                const index = fileListNight3.indexOf(file);
                const newFileList = fileListNight3.slice();
                newFileList.splice(index, 1);
                return {
                    fileListNight3: newFileList,
                    // previewVisibleNight: false,
                    modalNight3: {key: '1080*2160', img: ''},
                };
                });
            },
            beforeUpload: (file) => {
                this.setState(({ fileListNight3 }) => ({
                    fileListNight3: [...fileListNight3, file],
                    modalNight3: {key: '1080*2160', img: ''},
                }));
                return false;
            },
            
            onChange(info) {
                getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                    info.fileList[0].url = imgUrl;
                    //转化后的base64
                    that.setState({
                        modalNight3: {id: that.state.id, key: '1080*2160', img: imgUrl.substring(imgUrl.indexOf(',')+1)},
                        fileListNight3: info.fileList,
                        previewImageNight: imgUrl,
                        previewVisibleNight: true,
                    })
                });
            },
            fileList: this.state.fileListNight3,
        },
        img4:{
            listType:"picture-card",
            action: '/Weather/query',
            onRemove: (file) => {
                this.setState(({ fileListNight4 }) => {
                const index = fileListNight4.indexOf(file);
                const newFileList = fileListNight4.slice();
                newFileList.splice(index, 1);
                return {
                    fileListNight4: newFileList,
                    // previewVisibleNight: false,
                    modalNight4: {key: '1126*2436', img: ''},
                };
                });
            },
            beforeUpload: (file) => {
                this.setState(({ fileListNight4 }) => ({
                    fileListNight4: [...fileListNight4, file],
                    modalNight4: {key: '1126*2436', img: ''},
                }));
                return false;
            },
            
            onChange(info) {
                getBase64(info.fileList[0].originFileObj, (imgUrl) => {
                    info.fileList[0].url = imgUrl;
                    //转化后的base64
                    that.setState({
                        modalNight4: {id: that.state.id, key: '1126*2436', img: imgUrl.substring(imgUrl.indexOf(',')+1)},
                        fileListNight4: info.fileList,
                        previewImageNight: imgUrl,
                        previewVisibleNight: true,
                    })
                });
            },
            fileList: this.state.fileListNight4,
        },
    };
    
    const uploadButton = (
        <div>
          <Icon type="plus" />
          <div className="ant-upload-text">Upload</div>
        </div>
      );
    let weatherWrap = [];
    this.state.weatherList.length>0 && this.state.weatherList.forEach((value,index,array) =>{
        const weatherOne = <Button key={index} className={this.state.index == index ? styles.btnBlue : styles.btnNone} onClick={() => this.changeLabel(index,value.typeName,value.id)}>{value.typeName}</Button>;
        weatherWrap.push(weatherOne);
    });
    return (
      <PageHeaderLayout title="天气管理">
        <div>
            <Row style={{marginBottom:24,background: '#fff',padding:12}}>
                <Col  sm={24} style={{display:'flex',justifyContent:'space-around',alignItems:'center'}}>
                    <label style={{color:'rgba(0,0,0,0.85)'}}>天气类型:</label>
                    {weatherWrap}
                </Col>
            </Row>
            <Row style={{marginBottom:24,background: '#fff',paddingTop:60,paddingBottom:60}}>
                <Col span={12}  style={{display:'flex',justifyContent:'space-around',alignItems:'center'}}>
                     <div>
                        {/* <Radio.Group onChange={this.handleModeChange} value={mode} style={{ marginBottom: 8 }}>
                            <Radio.Button value="top">白天</Radio.Button>
                            <Radio.Button value="left">晚上</Radio.Button>
                        </Radio.Group> */}
                        <Tabs
                        ref="Tab"
                        defaultActiveKey='1'
                        activeKey={this.state.activeKey}
                        tabPosition={mode}
                        style={{ width: 300 }}
                        tabBarStyle={{height:60,border:1,textAlign:'center'}}
                        onTabClick={this.tabClick}
                        >
                            <TabPane tab="白天" key="1">
                                <div className={styles.imgWrap}>
                                    {previewVisible ? <img alt="example" style={{ width: '100%' }} src={previewImage} /> : null}
                                    <div className={styles.circle}></div>
                                </div>
                            </TabPane>
                            <TabPane tab="晚上" key="2">
                                <div className={styles.imgWrap}>
                                    {previewVisibleNight ? <img alt="example" style={{ width: '100%' }} src={previewImageNight} /> : null}
                                    <div className={styles.circle}></div>
                                </div>
                            </TabPane>
                        </Tabs>
                        
                    </div>
                    
                </Col>
                {
                    this.state.tabs1Content
                    ?
                    <Col span={12} aligin="center">
                        <Row>
                            <Col span={12}>
                                <p>iPhone5、iPhone6、iPhone7、iPhone8</p>
                                <Upload {...(props.img)} onPreview={this.handlePreview} >
                                {fileList.length >= 1 ? null : 
                                    <div>
                                        <Icon type="plus" />
                                        <div className="ant-upload-text">750*1334px</div>
                                    </div>
                                }
                                </Upload>
                            </Col>
                            <Col span={12}>
                                <p>Andriod非全面屏</p>
                                <Upload {...(props.img1)} onPreview={this.handlePreview}>
                                {fileList1.length >= 1 ? null : 
                                    <div>
                                        <Icon type="plus" />
                                        <div className="ant-upload-text">1080*1920px</div>
                                    </div>
                                }
                                </Upload>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <p>iPhone Plus</p>
                                <Upload {...(props.img2)} onPreview={this.handlePreview}>
                                {fileList2.length >= 1 ? null : 
                                    <div>
                                        <Icon type="plus" />
                                        <div className="ant-upload-text">1242*2208px</div>
                                    </div>
                                }
                                </Upload>
                            </Col>
                            <Col span={12}>
                                <p>Andriod全面屏</p>
                                <Upload {...(props.img3)} onPreview={this.handlePreview}>
                                {fileList3.length >= 1 ? null : 
                                    <div>
                                        <Icon type="plus" />
                                        <div className="ant-upload-text">1080*2160px</div>
                                    </div>
                                }
                                </Upload>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <p>iPhoneX</p>
                                <Upload {...(props.img4)} onPreview={this.handlePreview}>
                                {fileList4.length >= 1 ? null : 
                                    <div>
                                        <Icon type="plus" />
                                        <div className="ant-upload-text">1126*2436px</div>
                                    </div>
                                }
                                </Upload>
                            </Col>
                        </Row>
                        <Row style={{marginTop:150}}>
                            <Col  span={12} style={{display:'flex',justifyContent:'flex-end'}}>
                                <Button type="primary" onClick={this.handleUpload} style={{marginRight:20}} loading={uploading}>保存</Button>
                                <Button  onClick={this.reset}>重置</Button>
                            </Col>
                        </Row>
                    </Col>
                    :
                    <Col span={12} aligin="center">
                        <Row>
                            <Col span={12}>
                                <p>iPhone5、iPhone6、iPhone7、iPhone8</p>
                                <Upload {...(props1.img)} onPreview={this.handlePreviewNight} >
                                {fileListNight.length >= 1 ? null : 
                                    <div>
                                        <Icon type="plus" />
                                        <div className="ant-upload-text">750*1334px</div>
                                    </div>
                                }
                                </Upload>
                            </Col>
                            <Col span={12}>
                                <p>Andriod非全面屏</p>
                                <Upload {...(props1.img1)} onPreview={this.handlePreviewNight}>
                                {fileListNight1.length >= 1 ? null : 
                                    <div>
                                        <Icon type="plus" />
                                        <div className="ant-upload-text">1080*1920px</div>
                                    </div>
                                }
                                </Upload>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <p>Plus</p>
                                <Upload {...(props1.img2)} onPreview={this.handlePreviewNight}>
                                {fileListNight2.length >= 1 ? null : 
                                    <div>
                                        <Icon type="plus" />
                                        <div className="ant-upload-text">1242*2208px</div>
                                    </div>
                                }
                                </Upload>
                            </Col>
                            <Col span={12}>
                                <p>Andriod全面屏11112</p>
                                <Upload {...(props1.img3)} onPreview={this.handlePreviewNight}>
                                {fileListNight3.length >= 1 ? null : 
                                    <div>
                                        <Icon type="plus" />
                                        <div className="ant-upload-text">1080*2160px</div>
                                    </div>
                                }
                                </Upload>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <p>iPhoneX</p>
                                <Upload {...(props1.img4)} onPreview={this.handlePreviewNight}>
                                {fileListNight4.length >= 1 ? null : 
                                    <div>
                                        <Icon type="plus" />
                                        <div className="ant-upload-text">1126*2436px</div>
                                    </div>
                                }
                                </Upload>
                            </Col>
                        </Row>
                        <Row style={{marginTop:150}}>
                            <Col  span={12} style={{display:'flex',justifyContent:'flex-end'}}>
                                <Button type="primary" onClick={this.handleUpload} style={{marginRight:20}} loading={uploading}>保存</Button>
                                <Button  onClick={this.reset}>重置</Button>
                            </Col>
                        </Row>
                    </Col>
                }
            </Row>
            
        </div>
      </PageHeaderLayout>
    );
  }
}
