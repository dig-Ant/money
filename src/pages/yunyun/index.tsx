import React, { useState, useEffect } from 'react';
import { useSelector, useRequest, useDispatch } from 'umi';
import { Table, Form, Button, Input, Radio, Space } from 'antd';
import request from '@/utils/request';
import { GET_DY_YUNYUN, GET_DY_YUNYUN_LIST } from '@/utils/api';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.less';
import { copy } from '@/utils/common';

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
      return request(GET_DY_YUNYUN, {
        method: 'post',
        data,
      });
    },
    {
      manual: true,
      onSuccess: (result, params) => {
        return;
      },
    },
  );

  const {
    run: listRun,
    data: listData = {},
    error: listError,
    loading: listLoading,
  } = useRequest(
    (data) => {
      return request(GET_DY_YUNYUN_LIST, {
        method: 'post',
        data,
      }).then((res) => res?.data);
    },
    {
      manual: true,
      onSuccess: (result, params) => {
        return;
      },
    },
  );
  useEffect(() => {
    listRun({});
  }, []);
  let { list = [] } = listData;
  console.log('data: ', loading, data);
  const onFinish = (values: Record<string, any>) => {
    console.log('values: ', values);
    run(values);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: '用户',
      dataIndex: 'userName',
      width: 100,
      render: (val, record: Record<string, any>) => {
        const { userSrc = 'javaScript:void(0);' } = record || {};
        return (
          <a href={userSrc} target="_blank">
            {val}
          </a>
        );
      },
    },
    {
      title: '类型',
      dataIndex: 'href',
      width: 100,
      render: (val) => {
        return <span>{val.includes('video') ? '视频' : '图文'}</span>;
      },
    },
    {
      title: '发布时间',
      dataIndex: 'time',
      width: 150,
      render: (val) => {
        return <span>{val && val.slice(7)}</span>;
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      render: (val, record: Record<string, any>) => {
        const {
          href = 'javaScript:void(0);',
          time = '',
          like = '',
        } = record || {};
        return (
          <Space>
            <a
              target="_blank"
              onClick={() => {
                copy(val);
              }}
            >
              total
            </a>
            <a
              href={href}
              target="_blank"
              onClick={() => {
                copy(val);
              }}
            >
              {like}-{val}
            </a>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <Form
        layout="inline"
        form={form}
        className={styles.filter}
        // size="small"
        onFinish={onFinish}
        initialValues={{
          type: 'favorite_collection',
          limitStart: 0,
          limitEnd: 2,
        }}
        colon={false}
      >
        <Form.Item>
          <Button type="primary" htmlType="submit">
            获取
          </Button>
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
          <Button
            type="primary"
            onClick={() => {
              listRun({});
            }}
          >
            查询
          </Button>
        </Form.Item>
      </Form>
      <Table columns={columns} dataSource={list || []} />
    </div>
  );
}
