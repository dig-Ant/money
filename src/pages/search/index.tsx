import React, { useEffect, useState } from 'react';
import { connect, useSelector, useRequest, useDispatch } from 'umi';
import parse from 'query-string';

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
  Radio,
} from 'antd';
import request from '@/utils/request';
import { GET_DY_SEARCH } from '@/utils/api';
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
    title: 'title',
    dataIndex: 'title',
    // render: (text) => text,
  },
  {
    title: '发布时间',
    dataIndex: 'createDate',
  },
  {
    title: '点赞',
    dataIndex: 'like',
  },
  {
    title: '用户',
    dataIndex: 'user',
    render: (val, record: Record<string, any>) => {
      const { userLink = 'javaScript:void(0);' } = record || {};
      return <a href={userLink}>{val}</a>;
    },
  },
  {
    title: '评论数',
    dataIndex: 'comment',
  },
  {
    title: '分享数',
    dataIndex: 'share',
  },
  {
    title: '视频链接',
    dataIndex: 'videoSrc',
  },
  {
    title: '操作',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

export default function HomePage() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const {
    run,
    data = {},
    error,
    loading,
  } = useRequest(
    (data) => {
      return request(GET_DY_SEARCH, {
        method: 'post',
        data,
      }).then((res) => res?.data);
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
  useEffect(() => {
    const keyword = parse.parse(location.search);
    keyword.v && run({ keyword: keyword.v });
  }, []);
  const { list = [] } = data;
  const onFinish = (values: Record<string, any>) => {
    console.log('values: ', values);
    run(values);
  };
  return (
    <div>
      <Form
        // {...layout}
        layout="inline"
        form={form}
        className="list-filter"
        onFinish={onFinish}
        initialValues={{ isLogin: false }}
        colon={false}
      >
        {/* <Form.Item
          name="url"
          label="link"
          // rules={[{ required: true, message: '请输入抖音列表链接' }]}
        >
          <Input />
        </Form.Item> */}
        <Form.Item
          name="keyword"
          label="关键字"
          rules={[
            { required: true, message: '抖音关键字搜索', whitespace: true },
          ]}
        >
          <Input />
        </Form.Item>
        {/* <Form.Item name="filter" label="包含文字筛选">
          <Input />
        </Form.Item> */}

        <Form.Item
          name="limitLen"
          label="最近几条"
          // rules={[{ required: true, message: '请输入最近几条' }]}
        >
          <InputNumber precision={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            查询
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
      <Table scroll={{ x: true }} columns={columns} dataSource={list} />
    </div>
  );
}
