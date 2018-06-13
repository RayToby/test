import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
 Table,
 Divider,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// In the fifth row, other columns are merged into first column
// by setting it's colSpan to be 0
@connect(({ authority, loading }) => ({
  authority,
  loading: loading.models.authority,
}))
export default class AuthorityList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'authority/getAllPermission',
      payload: {},
      callback: (res) => {

      }
    });
  }
  render() {
    const {  children } = this.props.authority.data && this.props.authority.data.data || [];
    const renderContent = (value, row, index) => {
      const obj = {
        // children: value,
        // props: {},
      };
      const name = [];
      row.children1.map((item, i) => {
        const opt = (i == row.children1.length - 1) ? <div key={i}>{item.name}</div> : <div key={i}>{item.name}<Divider/></div>;
        name.push(opt)
      });
      obj.children = name;
      return obj;
    };
    const columns = [{
      title: '权限组',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '权限名',
      dataIndex: 'children1',
      render: renderContent,
    }, {
      title: '权限类型',
      // colSpan: 2,
      dataIndex: 'type',
      render: (value, row, index) => {
        const obj1 = {
          
        };
        const name1 = [];
        row.children1.map((item, i) => {
          const opt1 = (i == row.children1.length - 1) ? <div key={i}>{item.type}</div> : <div key={i}>{item.type}<Divider/></div>;
          name1.push(opt1)
        });
        obj1.children = name1;
        return obj1;
      },
    },{
      title: '描述',
      dataIndex: children ? 'id' : '',
      render: (value, row, index) => {
        const obj2 = {
          
        };
        const name2 = [];
        row.children1.map((item, i) => {
          const opt2 = (i == row.children1.length - 1) ? <div key={i}>{item.desc}</div> : <div key={i}>{item.desc}<Divider/></div>;
          name2.push(opt2)
        });
        obj2.children = name2;
        return obj2;
      },
    }];
    
    return (
      <PageHeaderLayout title="权限管理">
        <Table 
          style={{backgroundColor:'white'}}
          columns={columns} 
          dataSource={children} 
          bordered 
          pagination={{
            // showSizeChanger: true,
            // showQuickJumper: true,
            pageSize:50
          }}/>
      </PageHeaderLayout>
    );
  }
}
