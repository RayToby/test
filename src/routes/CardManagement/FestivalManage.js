import React, { Fragment, Component } from 'react';
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
 message,
 Carousel,
 Modal,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../SystemManagement/TableList.less';
import "./styles.less";
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Option } = Select;

@connect(({ festivalManage, loading }) => ({
  festivalManage,
  loading: loading.models.festivalManage,
}))
@Form.create()
export default class FestivalList extends Component {
  state = {
    total: '',
    previewVisible: false,
    imgVisible: false,
    previewImage: '',
    formValues: {},
    imgArray: [],

  };

  componentDidMount() {
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        name: fieldsValue.name ? fieldsValue.name : "",
        type: fieldsValue.type ? fieldsValue.type : "",
        sharingType: fieldsValue.sharingType ? fieldsValue.sharingType : "",
        // page: this.state.page,
        // pageSize: this.state.pageSize,
      };

      // this.setState({
      //   formValues: values,
      // });

      dispatch({
        type: 'festivalManage/queryFestival',
        payload: values,
        callback: (res) => {
          if(res && res.code == '0'){
            this.setState({
              data: res.data ? res.data.festArray : {},
              total: res.data.sumCount ? res.data.sumCount : '',
            });
          }else{
            message.error(res && res.message || '服务器错误');
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
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="节日名">
                {getFieldDecorator('name')(<Input placeholder="请输入节日名" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="节日类型">
                {getFieldDecorator('type', {
                // rules: [{ required: true, message: '请选择节日' }],
                // initialValue: '全部'
                })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                    <Option value="">全部</Option>
                    <Option value="1">中国节日</Option>
                    <Option value="2">世界节日</Option>
                    <Option value="3">节气</Option>
                </Select>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="分享页类型">
              {getFieldDecorator('sharingType',{
                initialValue: "",
              })(
                <RadioGroup onChange={this.onRadioChange}>
                  <Radio value="">全选</Radio>
                  <Radio value="0">图片</Radio>
                  <Radio value="1">Html5</Radio>
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
    // const { formValues } = this.state;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'festivalManage/queryFestival',
        payload: {
          // page: 1,
          // pageSize: this.state.pageSize,
          name: "",
          type: "",
          sharingType: "",
        },
        callback: (res) => {
          this.setState({
            data: res.data && res.data.festArray ? res.data.festArray : {},
            total: res.data.sumCount ? res.data.sumCount : '',
            page: 1,
          });
        }
    });
  }

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        name: fieldsValue.name ? fieldsValue.name : "",
        type: fieldsValue.type ? fieldsValue.type : "",
        sharingType: fieldsValue.sharingType ? fieldsValue.sharingType : "",
        page: this.state.page,
        pageSize: this.state.pageSize,
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'festivalManage/queryFestival',
        payload: values,
        callback: (res) => {
          this.setState({
            data: res.data ? res.data.festArray : {},
            total: res.data.sumCount ? res.data.sumCount : '',
            page: 1,
          });
        },
      });
    });
  };

  onPageClick(current, pageSize) {
    this.setState({page:current,pageSize:pageSize});

    // const { dispatch, form } = this.props;
    // form.validateFields((err, fieldsValue) => {
    //   if (err) return;
    //   dispatch({
    //     type: 'festivalManage/queryFeedbackList',
    //     payload: {
    //       name: fieldsValue.name ? fieldsValue.name : "",
    //       type: fieldsValue.type ? fieldsValue.type : "",
    //       imgType: fieldsValue.imgType ? fieldsValue.imgType : "",
    //       // page: current,
    //       // pageSize: pageSize,
    //     },
    //     callback: (res) => {
    //       this.setState({
    //         data: res.data ? res.data.festArray : {},
    //         total: res.data.sumCount ? res.data.sumCount : '',
    //       });
    //     },
    //   });
    // });
  }

  edit = (params) => {
    this.props.dispatch( routerRedux.push({
        pathname: '/cardManagement/festival-edit',
        params: params,
      }
    ));
  }

  seeBanner = (params) => {
    if(params) {
      this.setState({
        previewVisible: true,
        previewImage: params,
      });
    }else{
      message.warn('未上传')
    }
  }

  handleCancel = () =>{
    this.setState({ previewVisible: false, previewVisibleNight: false })
  }

  imgCancel = () =>{
    this.setState({ imgVisible: false })
  }

  seeImg = (imgArray) => {
      this.setState({
        imgArray: imgArray,
        imgVisible: true,
      });
  }

  toNext = () => {
    Carousel.prev();
  }

  _change = (from, to ) => {
    console.log('111')
  }
  render() {
    const { list } = this.props.festivalManage.data &&  this.props.festivalManage.data.data || [];
    let {page, pageSize, total, previewVisible, previewImage} = this.state;
    let pagination = {
      total: total,
      defaultCurrent: page,
      pageSize: pageSize,
      current: page,
      showSizeChanger: true,
      showQuickJumper: true,
      onShowSizeChange: (current, pageSize) => {
        this.onPageClick(current, pageSize)
      },
      onChange:(current, pageSize) => {
          this.onPageClick(current, pageSize)
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

    // const data_ = [];
    // for (let i = 0; i < 46; i++) {
    //   data_.push({
    //     key: i,
    //     icon: '开屏广告',
    //     name: '劳动节',
    //     typeName: '世界节日',
    //     festivalDate: '05-01',
    //     bgImg: '图片',
    //     operation: 1,
    //   });
    // }
    const columns = [{
      title: '节日图标',
      dataIndex: 'icon',
      key: 'icon',
      render: (value, row, index) => {
        return(
          <Fragment>
            {value ? <img src={value} style={{width:40,height:40}}/> : <p>未上传</p>}
          </Fragment>
          )
      }
    }, {
      title: '节日名',
      dataIndex: 'name',
      key: 'name',
      // render: renderContent,
    }, {
      title: '节日类型',
      dataIndex: 'typeName',
      key: 'typeName',
      // render: renderContent,
    }, {
      title: '日期',
      dataIndex: 'festivalDate',
      key: 'festivalDate',
      // render: renderContent,
    }, {
      title: '分享页类型',
      dataIndex: 'bgImg',
      key: 'bgImg',
      render: (value, row, index) => {
        return(
          <Fragment>
            {
              row.sharingType == '0' 
              ?
              <a href="javascript:;" onClick={() => this.seeImg(row.bgImg)}>图片</a>
              :
              <a href={row.url} target='blank'>Html5</a>
            }
          </Fragment>
          )
      }
    },{
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (value, row, index) => {
        return(
          <Fragment>
            <a href="javascript:;" onClick={() => this.edit(row)}>编辑</a>
            <Divider type="vertical" />
            <a href="javascript:;" onClick={() => this.seeBanner(row.banner)} >Banner预览</a>
            <Divider type="vertical" />
          </Fragment>
          )
      }
    }];
    const photos = [
      {
        name: "photo A",
        url: "https://placeimg.com/640/480/nature"
      },
      {
        name: "photo B",
        url: "https://placeimg.com/640/480/tech"
      },
      {
        name: "photo C",
        url: "https://placeimg.com/640/480/animals"
      }
    ];
    const settings = {
      // dots: true,
      // infinite: true,
      // speed: 500,
      // arrows: true,
    };
    return (
      <PageHeaderLayout title="节日管理">
        <div>
            <Card bordered={false}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderForm()}</div>
                <Table 
                  style={{backgroundColor:'white',marginTop:16}}
                  columns={columns} 
                  dataSource={this.state.data} 
                  pagination={pagination}
                />
                 <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
                <Modal visible={this.state.imgVisible} footer={null} onCancel={this.imgCancel} width={360} style={{position:'relative'}}>
                  <Carousel {...settings} beforeChange={this._change} autoplay>
                    {this.state.imgArray.length > 0  && this.state.imgArray.map((item, i) => {
                      return <div><img alt={i} src={item}  width='320' /></div>
                    })}
                  </Carousel>
                  {/* <a style={{position: 'absolute',top:300,left:-100}} href='javascript:void(0)' onClick={this.toNext}><Icon type='caret-left' style={{fontSize: 26}} /></a>
                  
                  <a style={{position: 'absolute',top:300,right:-100}} href='javascript:void(0)' onClick={this.toNext}><Icon type='caret-right' style={{fontSize: 26}}/></a>
                   */}
                </Modal>
              </div>
            </Card>
            {/* <Slider {...settings}>
              {photos.map(photo => (
                <div>
                  <img width="100%" src={photo.url} />
                </div>
              ))}
            </Slider> */}
        </div>   
        
      </PageHeaderLayout>
    );
  }
}
