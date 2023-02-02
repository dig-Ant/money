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
import { GET_DY_PRODUCTMSG } from '@/utils/api';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.less';
import { copy } from '@/utils/common';

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

export default function HomePage() {
  const [form] = Form.useForm();
  const { run, data, error, loading } = useRequest(
    (data) => {
      return request(GET_DY_PRODUCTMSG, {
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

  const columns: ColumnsType<DataType> = [
    {
      title: '用户',
      dataIndex: ['user', 'name'],
    },
    {
      title: '标题',
      dataIndex: 'title',
      render: (val, record: Record<string, any>) => {
        const {
          href = 'javaScript:void(0);',
          name = '',
          likeNum,
        } = record || {};
        return (
          <a
            href={href}
            target="_blank"
            onClick={() => {
              copy(val);
            }}
          >
            {likeNum}-{val}
          </a>
        );
      },
    },
  ];

  return (
    <div>
      <Form
        // {...layout}
        layout="inline"
        form={form}
        className={styles.filter}
        // size="small"
        onFinish={onFinish}
        initialValues={{ type: 'favorite_collection' }}
        // wrapperCol={{span: 0, offset: 0}}
        // labelCol={{ span: 0, offset: 0 }}
        colon={false}
      >
        <Form.Item name="url" label="link">
          <Input />
        </Form.Item>

        {/* <Form.Item name="filter" label="包含文字筛选">
          <Input />
        </Form.Item> */}

        <Form.Item name="downloadFilename" label="文件夹名">
          <Input />
        </Form.Item>

        <Form.Item name="limitStart" label="start">
          <Input style={{ width: '45px' }} />
        </Form.Item>
        <Form.Item name="limitEnd" label="end">
          <Input style={{ width: '45px' }} />
        </Form.Item>
        <Form.Item
          label="类型"
          name="type"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          <Radio.Group>
            <Radio.Button value="favorite_collection">收藏</Radio.Button>
            <Radio.Button value="like">喜欢</Radio.Button>
            <Radio.Button value="post">作品</Radio.Button>
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
      <Table columns={columns} dataSource={data?.data.list || []} />
    </div>
  );
}
