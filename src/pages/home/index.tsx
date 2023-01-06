import React, { useState } from 'react';
import { connect, useSelector, useRequest, useDispatch } from 'umi';

import {
  Space,
  Table,
  Tag,
  Form,
  Button,
  Input,
  InputNumber,
  message,
  notification,
  Select,
  Radio,
} from 'antd';
import request from '@/utils/request';
import { GET_DY_RESOURCE } from '@/utils/api';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.less';

const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

const datas: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

export default function HomePage() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { run, data, error, loading } = useRequest(
    (data) => {
      return request(GET_DY_RESOURCE, {
        method: 'post',
        data,
      });
    },
    {
      manual: true,
      onSuccess: (result, params) => {
        console.log('result, params: ', result, params);
        return;
        if (result.success) {
          message.success(`The username was changed to "${params[0]}" !`);
        }
      },
    },
  );
  console.log('data: ', loading, data);
  const onFinish = (values: Record<string, any>) => {
    console.log('values: ', values);
    run(values);
  };
  return (
    <div>
      <Space style={{ marginBottom: 10 }}>
        <Button
          type="primary"
          style={{ marginBottom: 10 }}
          onClick={() => {
            dispatch({
              type: 'global/loginPup',
            });
          }}
        >
          首次需要登录chromium
        </Button>
        <Button
          type="primary"
          style={{ marginBottom: 10 }}
          onClick={() => {
            dispatch({
              type: 'global/logoutPup',
            });
          }}
        >
          关闭登录chromium
        </Button>
      </Space>
      <Form
        {...layout}
        layout="inline"
        form={form}
        className={styles.filter}
        onFinish={onFinish}
        initialValues={{ type: 'post' }}
      >
        <Form.Item name="url" label="抖音列表链接">
          <Input />
        </Form.Item>

        {/* <Form.Item name="filter" label="包含文字筛选">
          <Input />
        </Form.Item> */}

        <Form.Item name="downloadFilename" label="下载文件夹名称">
          <Input />
        </Form.Item>

        <Form.Item
          name="limitLen"
          label="最近几条"
          // rules={[{ required: true, message: '请输入最近几条' }]}
        >
          <InputNumber precision={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="类型"
          name="type"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          <Radio.Group>
            <Radio.Button value="post">作品</Radio.Button>
            <Radio.Button value="like">喜欢</Radio.Button>
            <Radio.Button value="favorite_collection">收藏</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="button"
            onClick={() => {
              form.resetFields();
            }}
          >
            重置
          </Button>
        </Form.Item>
      </Form>
      <Table columns={columns} dataSource={datas} />
    </div>
  );
}
