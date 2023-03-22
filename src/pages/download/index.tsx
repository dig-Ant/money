import React, { useEffect, useState } from 'react';
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
import { EXEC_DY_DOWNLIST, GET_DY_RESOURCE } from '@/utils/api';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.less';
import { copy, string_to_num, transformUrl } from '@/utils/common';

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
  let {
    run: listRun,
    data: listData = [],
    error: listError,
    loading: listLoading,
  } = useRequest(
    (data) => {
      return request(EXEC_DY_DOWNLIST, {
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
  console.log(
    'listData: ',
    listData.map((e) => {
      return { value: e.userName, label: e.userLink };
    }),
  );
  listData = listData.map((e: any) => {
    e.publishTime = new Date(e.time.slice(5)).getTime();
    return e;
  });
  const onFinish = (values: Record<string, any>) => {
    console.log('values: ', values);
    run({ ...values, userURL: transformUrl(values.userURL) });
  };
  const columns: ColumnsType<DataType> = [
    // {
    //   title: '_id',
    //   dataIndex: '_id',
    //   width: 100,
    // },
    {
      title: 'i',
      dataIndex: 'index',
      width: 50,
    },
    {
      title: '用户',
      dataIndex: 'name',
      width: 150,
      render: (val, record: Record<string, any>) => {
        return <span>{(val || record.filename || '').split('-')[0]}</span>;
      },
    },
    {
      title: '赞',
      dataIndex: 'like',
      defaultSortOrder: 'descend',
      width: 100,
      sorter: (a: any, b: any) => string_to_num(a.like) - string_to_num(b.like),
    },
    {
      title: '赞',
      dataIndex: 'like',
      // defaultSortOrder: 'descend',
      width: 100,
      render: (val, record: Record<string, any>) => {
        return <span>{string_to_num(val)} </span>;
      },
    },
    {
      title: '发布时间',
      dataIndex: 'time',
      defaultSortOrder: 'descend',
      sorter: (a: any, b: any) => a.publishTime - b.publishTime,
      width: 150,
      render: (val) => <span>{val && val.slice(7)}</span>,
    },
    {
      title: '作者粉丝',
      dataIndex: 'name',
      width: 150,
      render: (val, record: Record<string, any>) => {
        return (
          <span>
            {(val || record.filename || '').split('-').slice(1).join('-')}
          </span>
        );
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      render: (val, record: Record<string, any>) => {
        const { href = 'javaScript:void(0);' } = record || {};
        return (
          <Space>
            <a
              onClick={() => {
                copy(val.replace(/#.+$/, ''));
              }}
            >
              copy
            </a>
            <a
              onClick={() => {
                window.open(location.origin + '/text/comment?v=' + href);
              }}
            >
              cmt
            </a>
            <a href={href} target="_blank">
              {val}
            </a>
          </Space>
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
        initialValues={{
          downloadFilename: '沥水盒',
          type: 'favorite_collection',
          limitStart: 0,
          limitEnd: 3,
        }}
        // wrapperCol={{span: 0, offset: 0}}
        // labelCol={{ span: 0, offset: 0 }}
        colon={false}
      >
        <Form.Item>
          <Button type="primary" htmlType="submit">
            下载
          </Button>
        </Form.Item>
        <Form.Item name="userURL" label="link">
          <Input />
        </Form.Item>

        {/* <Form.Item name="filter" label="包含文字筛选">
          <Input />
        </Form.Item> */}

        <Form.Item name="downloadFilename" label="文件夹名">
          <Input style={{ width: '105px' }} />
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
          <Radio.Group style={{ width: '245px' }}>
            <Radio.Button value="favorite_collection">收藏</Radio.Button>
            <Radio.Button value="like">喜欢</Radio.Button>
            <Radio.Button value="post">作品</Radio.Button>
            <Radio.Button value="record">历史</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="button"
            onClick={() => {
              listRun({});
            }}
          >
            查询
          </Button>
          <Button
            htmlType="button"
            onClick={() => {
              copy(
                JSON.stringify(
                  listData.map((e: any) => {
                    return { label: '同行/' + e.userName, value: e.userLink };
                  }),
                ).slice(1, -1) + ',',
              );
            }}
          >
            copyUser
          </Button>
        </Form.Item>
      </Form>
      <Table
        columns={columns}
        pagination={false}
        scroll={{ y: 500 }}
        dataSource={listData || []}
      />
    </div>
  );
}
