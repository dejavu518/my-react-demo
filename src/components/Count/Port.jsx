// 邮件设置页面

import React, { Component } from 'react';
import {Select, Divider, Input, Typography, Space} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
 
const {Option} = Select;
 
class DropdownToAdd extends Component {
    state = {
        items: ['jack', 'lucy'],
        typeValue: '',
    }
    // 选中 option，或 input 的 value 变化时，调用此函数
    onNameChange = event => {
        this.setState({typeValue: event.target.value})
        // setName(event.target.value);
    };
    addItem = e => {
        e.preventDefault();
        console.log(this.state.typeValue);
        if (!this.state.typeValue) return;
        let items = [...this.state.items];
        items.push(this.state.typeValue);
        console.log(items) //将获取到的新内容添加的items里面;
        this.setState({items, typeValue: ''})
    };
 
    render() {
        const {items, typeValue} = this.state
        return (
            <div>
                <Select
                    style={{width: 300}}
                    placeholder="custom dropdown render"
                    dropdownRender={menu => (
                        <>
                            {menu}
                            <Divider style={{margin: '8px 0'}}/>
                            <Space align="center" style={{padding: '0 8px 4px'}}>
                                <Input placeholder="Please enter item" value={typeValue} onChange={this.onNameChange}/>
                                <Typography.Link onClick={this.addItem} style={{whiteSpace: 'nowrap'}}>
                                    <PlusOutlined/> Add item
                                </Typography.Link>
                            </Space>
                        </>
                    )}
                >
                    {items.map(item => (
                        <Option key={item}>{item}</Option>
                    ))}
                </Select>
            </div>
        );
    }
}
 
export default DropdownToAdd;