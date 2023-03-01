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
  Modal,
} from 'antd';
import request from '@/utils/request';
import { EXEC_DY_LIKE } from '@/utils/api';

export default function like() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const model = useSelector((state: any) => state.searchPage);
  const {
    run,
    data = {},
    error,
    loading,
  } = useRequest(
    (data) => {
      return request(EXEC_DY_LIKE, {
        method: 'post',
        data,
      }).then((res) => res?.data);
    },
    {
      manual: true,
      onSuccess: (result, params) => {
        console.log('result, params: ', result, params);
        if (result.success) {
          message.success(`The username was changed to "${params[0]}" !`);
        }
      },
    },
  );

  const onFinish = (values: Record<string, any>) => {
    run({ ...values });
  };
  return (
    <div>
      <Form
        layout="inline"
        form={form}
        className="list-filter"
        onFinish={onFinish}
        initialValues={{
          isLogin: false,
          type: 'like',
          limitLen: 10,
        }}
        colon={false}
      >
        <Form.Item>
          <Button type="primary" htmlType="submit">
            评论
          </Button>
        </Form.Item>
        <Form.Item label="前" name="limitLen">
          <Input style={{ width: '42px' }} />
        </Form.Item>
        <Form.Item name="type" label="条">
          <Radio.Group>
            {/* <Radio.Button value="post">作品</Radio.Button> */}
            <Radio.Button value="like">喜欢</Radio.Button>
            <Radio.Button value="favorite_collection">收藏</Radio.Button>
            <Radio.Button value="record">历史</Radio.Button>
          </Radio.Group>
        </Form.Item>
      </Form>
    </div>
  );
}
