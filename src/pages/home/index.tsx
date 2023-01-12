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

export default function HomePage() {
  const [form] = Form.useForm();
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

  const columns: ColumnsType<DataType> = [
    {
      title: '用户',
      dataIndex: ['user', 'name'],
    },
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '点赞数',
      dataIndex: 'likeNum',
    },
  ];

  return (
    <div>
      <Form
        {...layout}
        layout="inline"
        form={form}
        className={styles.filter}
        onFinish={onFinish}
        initialValues={{ type: 'post' }}
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

        <Form.Item
          name="limitStart"
          label="start"
        >
          <InputNumber precision={0} style={{ width: '50%' }} />
        </Form.Item>
        <Form.Item
          name="limitEnd"
          label="end"
        >
          <InputNumber precision={0} style={{ width: '50%' }} />
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
      <Table columns={columns} dataSource={data?.data.list || []} />
    </div>
  );
}
