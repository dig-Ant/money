import React, { useState, useEffect } from 'react';
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
  Radio,
} from 'antd';
import request from '@/utils/request';
import { GET_DY_USERS, GET_DY_USERS_LIST } from '@/utils/api';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
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

export default function searchUser() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const model = useSelector((state) => state.searchUserModal);
  console.log('model: ', model);
  const {
    run,
    data = {},
    error,
    loading,
  } = useRequest(
    (data) => {
      return request(GET_DY_USERS, {
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
  const {
    run: listRun,
    data: listData = {},
    error: listError,
    loading: listLoading,
  } = useRequest(
    (data) => {
      return request(GET_DY_USERS_LIST, {
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
    listRun({});
  }, []);

  const columns: ColumnsType<DataType> = [
    {
      title: '视频标题',
      dataIndex: 'title',
      width: 240,
      // render: (text) => text,
    },
    {
      title: '筛选类型',
      dataIndex: 'userType',
      width: 240,
      render: (text) => (text === 'user' ? '用户' : '同行'),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      render: (val) => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '视频点赞',
      dataIndex: 'like',
      width: 100,
    },
    {
      title: '用户',
      dataIndex: 'user',
      render: (val, record: Record<string, any>) => {
        const { src = 'javaScript:void(0);', name = '' } = record || {};
        return <a href={src}>{name}</a>;
      },
    },
    {
      title: '用户粉丝',
      dataIndex: ['user', 'fans'],
      width: 100,
    },
    {
      title: '用户点赞',
      dataIndex: ['user', 'like'],
      width: 100,
    },
    {
      title: '所属有效用户',
      dataIndex: 'commentList',
      render: (val) => {
        return (val && val.length) || '0';
      },
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 140,
      render: (_, record) => {
        const { _id } = record || {};
        return (
          <Space size="middle">
            <a
              onClick={() => {
                dispatch({
                  type: 'searchUserModal/batchLike',
                  payload: { _id },
                });
              }}
            >
              批量点赞
            </a>
            <a>删除</a>
          </Space>
        );
      },
    },
  ];
  const { list = [], total, pageSize, page } = listData;
  console.log('list: ', list, listError);
  const onFinish = (values: Record<string, any>) => {
    console.log('values: ', values);
    run(values);
  };
  return (
    <div>
      <Form
        {...layout}
        layout="inline"
        form={form}
        className="list-filter"
        onFinish={onFinish}
        initialValues={{
          isLogin: false,
          type: 'like',
          limitLen: 1,
          commentLimitLen: 100,
          userType: 'user',
        }}
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
          name="commentLimitLen"
          label="初始评论条数"
          // rules={[{ required: true, message: '请输入最近几条' }]}
        >
          <InputNumber precision={0} style={{ width: '100%' }} />
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
        <Form.Item
          label="是否登录"
          name="isLogin"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Radio.Group>
            <Radio.Button value={true}>登录</Radio.Button>
            <Radio.Button value={false}>不登录</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="筛选用户类型"
          name="userType"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Radio.Group>
            <Radio.Button value={'business'}>同行</Radio.Button>
            <Radio.Button value={'user'}>用户</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            运行查找
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            onClick={() => {
              form.validateFields().then((value) => {
                listRun({});
              });
            }}
          >
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
      <Table
        scroll={{ x: true }}
        columns={columns}
        dataSource={list}
        // pagination={{
        //   total,
        //   pageSize,
        //   current: page,
        //   onChange: (page, pageSize) => {
        //     dispatch(listRun({ page, pageSize }));
        //   },
        // }}
      />
    </div>
  );
}
