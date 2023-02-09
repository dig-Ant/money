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
import { GET_DY_TEXT } from '@/utils/api';
import { copy } from '@/utils/common';
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
  const model = useSelector((state: any) => state.searchPage);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [current, setCurrent] = useState([]);

  console.log('model: ', model);
  const {
    run,
    data = {},
    error,
    loading,
  } = useRequest(
    (data) => {
      return request(GET_DY_TEXT, {
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
  const { list = [] } = data;
  const columns: ColumnsType<DataType> = [
    {
      title: '文案',
      dataIndex: 'title',
      render: (val, record: Record<string, any>) => {
        const { title = '' } = record || {};
        let textList = title.split(/[#|\s]/);
        return (
          <div>
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
          </div>
        );
      },
    },
  ];

  const commentCols: ColumnsType<DataType> = [
    {
      title: '用户名',
      dataIndex: 'userName',
      width: 60,
      render: (val, render: any) => {
        const { gender, fans, age, like } = render;
        return (
          <div>
            <a href={render?.userLink}>{val}</a>-性别{gender}-{age}-粉丝{fans}
            个-获
            {like}赞
          </div>
        );
      },
    },
    {
      title: '第一条视频',
      dataIndex: 'firstVideoSrc',
      width: 350,
      render: (val, record) => {
        const { videoTitles = [], firstVideoSrc } = val || {};
        const text = videoTitles[0].split('\n').slice(-1)[0] || '';
        const textList = text.split(/[#|\s]/);
        return (
          <Space>
            <a href={firstVideoSrc} target="_blank">
              link
            </a>
            <Button
              type="link"
              onClick={() => {
                copy(textList.join(''));
                window.open(location.origin + '/search?v=' + textList.join(''));
              }}
            >
              total
            </Button>
            {/* {text} */}
            {textList.map((e: string, i: number) => {
              return (
                <Button
                  type="link"
                  size="small"
                  style={{ padding: 0 }}
                  key={i}
                  onClick={() => {
                    copy(e);
                    window.open(location.origin + '/search?v=' + e);
                  }}
                >
                  {e}
                </Button>
              );
            })}
          </Space>
        );
      },
    },
  ];
  const onFinish = (values: Record<string, any>) => {
    console.log('values: ', values);
    run({ ...values, userType: 'business' });
  };
  return (
    <div>
      <Form
        layout="inline"
        form={form}
        className="list-filter"
        onFinish={onFinish}
        initialValues={{
          // url: 'https://www.douyin.com/user/MS4wLjABAAAAXceYJEb9XGH8zmgd8FSurkqWCZVeHRzycGB0LHmuiaP0ewYxT20MuOQBwXsw1soV/',
          isLogin: false,
          type: 'post',
          limitLen: 100,
          commentLimitLen: 100,
        }}
        colon={false}
      >
        <Form.Item>
          <Button type="primary" htmlType="submit">
            获取
          </Button>
        </Form.Item>
        <Form.Item label="前" name="limitLen">
          <Input style={{ width: '42px' }} />
        </Form.Item>
        <Form.Item name="type" label="条">
          <Radio.Group>
            <Radio.Button value="post">作品</Radio.Button>
            <Radio.Button value="like">喜欢</Radio.Button>
            <Radio.Button value="favorite_collection">收藏</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="commentLimitLen" label="的文案">
          {/* <Input style={{ width: '55px' }} /> */}
        </Form.Item>
        <Form.Item name="url" label="url">
          <Input style={{ width: '55px' }} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            onClick={() => {
              console.log(list);

              copy(JSON.stringify(list.map((e: any) => e.title)));
            }}
          >
            copy
          </Button>
        </Form.Item>
      </Form>
      <Table
        scroll={{ x: true }}
        columns={columns}
        dataSource={list}
        rowKey="_id"
      />
      <Modal
        title=""
        width="85%"
        // height="90%"
        open={isModalOpen}
        onOk={() => {
          setIsModalOpen(false);
        }}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        footer={null}
      >
        <Table
          scroll={{ y: '75vh' }}
          columns={commentCols}
          dataSource={current}
          rowKey="_id"
        />
      </Modal>
    </div>
  );
}
