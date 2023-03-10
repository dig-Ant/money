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
import { copy, transformUrl } from '@/utils/common';

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
  console.log('listData: ', listData);
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
      title: '??????',
      dataIndex: 'name',
      width: 150,
      render: (val, record: Record<string, any>) => {
        return <span>{(val || record.filename || '').split('-')[0]}</span>;
      },
    },
    {
      title: '???',
      dataIndex: 'like',
      defaultSortOrder: 'descend',
      width: 100,
      sorter: (a: any, b: any) => a.like - b.like,
    },
    {
      title: '????????????',
      dataIndex: 'time',
      defaultSortOrder: 'descend',
      sorter: (a: any, b: any) => a.publishTime - b.publishTime,
      width: 150,
      render: (val) => <span>{val && val.slice(7)}</span>,
    },
    {
      title: '????????????',
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
      title: '??????',
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
          downloadFilename: '?????????',
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
            ??????
          </Button>
        </Form.Item>
        <Form.Item name="userURL" label="link">
          <Input />
        </Form.Item>

        {/* <Form.Item name="filter" label="??????????????????">
          <Input />
        </Form.Item> */}

        <Form.Item name="downloadFilename" label="????????????">
          <Input style={{ width: '105px' }} />
        </Form.Item>

        <Form.Item name="limitStart" label="start">
          <Input style={{ width: '45px' }} />
        </Form.Item>
        <Form.Item name="limitEnd" label="end">
          <Input style={{ width: '45px' }} />
        </Form.Item>
        <Form.Item
          label="??????"
          name="type"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          <Radio.Group style={{ width: '245px' }}>
            <Radio.Button value="favorite_collection">??????</Radio.Button>
            <Radio.Button value="like">??????</Radio.Button>
            <Radio.Button value="post">??????</Radio.Button>
            <Radio.Button value="record">??????</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="button"
            onClick={() => {
              listRun({});
            }}
          >
            ??????
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
