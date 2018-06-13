import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
    Card, Icon, Avatar, Row, Col
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
const { Meta } = Card;
// import styles from './TableList.less';
// In the fifth row, other columns are merged into first column
// by setting it's colSpan to be 0
@connect(({ rule, role, loading }) => ({
  rule,
  role,
  loading: loading.models.rule,
}))
export default class LotteryList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'rule/getAllPermission',
    //   payload: {},
    //   callback: (res) => {

    //   }
    // });
  }
  render() {
    return (
      <PageHeaderLayout title="卡片设置">
        <Row gutter={16}>
            <Col span={6}>
                <Card
                    style={{ width: 300 }}
                    cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
                    actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
                >
                    <Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title="Card title"
                    description="This is the description"
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card
                    style={{ width: 300 }}
                    cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
                    actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
                >
                    <Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title="Card title"
                    description="This is the description"
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card
                    style={{ width: 300 }}
                    cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
                    actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
                >
                    <Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title="Card title"
                    description="This is the description"
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card
                    style={{ width: 300 }}
                    cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
                    actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
                >
                    <Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title="Card title"
                    description="This is the description"
                    />
                </Card>
            </Col>
        </Row>
        <Row style={{marginTop:20}}>
            <Col span={6}>
                <Card
                    style={{ width: 300 }}
                    cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
                    actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
                >
                    <Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title="Card title"
                    description="This is the description"
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card
                    style={{ width: 300 }}
                    cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
                    actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
                >
                    <Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title="Card title"
                    description="This is the description"
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card
                    style={{ width: 300 }}
                    cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
                    actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
                >
                    <Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title="Card title"
                    description="This is the description"
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card
                    style={{ width: 300 }}
                    cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
                    actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
                >
                    <Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title="Card title"
                    description="This is the description"
                    />
                </Card>
            </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
