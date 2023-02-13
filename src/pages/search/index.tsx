import React, { useEffect, useState } from 'react';
import { connect, useSelector, useRequest, useDispatch } from 'umi';
import parse from 'query-string';
import { copy } from '@/utils/common';

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
    render: (val, render: any) => {
      const {
        user,
        userLink = 'javaScript:void(0);',
        like,
        title,
        createDate,
      } = render;
      const textList = title.split(/[#|\s]/);
      return (
        <div>
          <a href={userLink}>link</a>
          <Button
            type="link"
            size="small"
            onClick={() => {
              window.open(location.origin + '/comment?v=' + userLink);
            }}
          >
            获取评论
          </Button>
          {user}
          <Button
            type="link"
            size="small"
            style={{ padding: 0 }}
            onClick={() => {
              copy(textList.join(''));
            }}
          >
            total
          </Button>
          {textList.map((e: string, i: number) => {
            return (
              <Button
                type="link"
                size="small"
                style={{ padding: 0 }}
                key={i}
                onClick={() => {
                  copy(e);
                }}
              >
                {e}
              </Button>
            );
          })}
          -{createDate}
        </div>
      );
    },
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
          <Input style={{ width: '45px' }} />
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
              const res = list.map(({ title }) => {
                const textList = title.split(/[#|\s]/);
                return textList.join();
              });
              copy(JSON.stringify(res));
            }}
          >
            copy
          </Button>
        </Form.Item>
      </Form>
      <Table scroll={{ x: true }} columns={columns} dataSource={list} />
    </div>
  );
}
