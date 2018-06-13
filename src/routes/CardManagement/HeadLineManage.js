import React, { PureComponent,} from 'react';
import { connect } from 'dva';
import {
    Card, Tabs, Form,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import HeadLineList from './HeadLineList';
import PushingManage from './PushingManage';
import PushedRecord from './PushedRecord';
const { Meta } = Card;
const TabPane = Tabs.TabPane;

@connect(({ rule, role, loading }) => ({
  rule,
  role,
  loading: loading.models.rule,
}))
@Form.create()
export default class HeadLineManage extends PureComponent {
    state = {
        mode: 'top',
        activeKey: '1',
    }
    componentDidMount() {
        const { dispatch } = this.props;
    }

    tabClick = (e) => {
        if(e == '1') {
            this.setState({ activeKey: '1' });
        }else if(e == '2') {
            this.setState({ activeKey: '2' });
        }else{
            this.setState({ activeKey: '3' });
        }
    }

    render() {
        const { mode } = this.state;
        return (
            <PageHeaderLayout title="头条管理">
                <div>
                    <Card bordered={false}>
                        <Tabs
                            ref="Tab"
                            defaultActiveKey='1'
                            activeKey={this.state.activeKey}
                            tabPosition={mode}
                            tabBarStyle={{height:50,border:1}}
                            onTabClick={this.tabClick}
                        >
                            <TabPane tab="头条管理" key="1">
                                <HeadLineList />
                            </TabPane>
                            <TabPane tab="推送中管理" key="2">
                                <PushingManage />
                            </TabPane>
                            <TabPane tab="推送记录" key="3">
                                <PushedRecord />
                            </TabPane>
                        </Tabs>
                    </Card>
                </div>
            </PageHeaderLayout>
        );
    }
}
