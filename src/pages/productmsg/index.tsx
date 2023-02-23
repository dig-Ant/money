import React, { useEffect, useState } from 'react';
import { connect, useSelector, useRequest, useDispatch } from 'umi';

import { Table, Tag, Form, Button, Input, Space, Modal, Select } from 'antd';
import request from '@/utils/request';
import {
  GET_DY_PRODUCTMSG,
  GET_DY_PRODUCT_USER,
  GET_DY_PRODUCT_MSG_LIST,
} from '@/utils/api';
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
  const [searchForm] = Form.useForm();
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
        return;
      },
    },
  );
  let { run: getUser, data: userList=[] } = useRequest(
    (data) => {
      return request(GET_DY_PRODUCT_USER, {
        method: 'post',
        data,
      }).then((res) => res?.data.map((e) => ({ label: e, value: e })) || []);
    },
    {
      manual: true,
      onSuccess: (result, params) => {
        return;
      },
    },
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [current, setCurrent] = useState([]);
  console.log('data: ', loading, data);
  userList = userList || [];
  console.log('userList: ', userList);
  const onFinish = (values: Record<string, any>) => {
    console.log('values: ', values);
    run(values);
  };
  let { run: listRun, data: listData = {} } = useRequest(
    (data) => {
      return request(GET_DY_PRODUCT_MSG_LIST, {
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
  const onSearch = (values: Record<string, any>) => {
    console.log('values: ', values);
    listRun(values);
  };
  // console.log(listData);
  console.log('userList: ', userList);
  useEffect(() => {
    getUser({ user: userList && userList[1] });
  }, []);

  const columns: ColumnsType<DataType> = [
    {
      title: '用户',
      dataIndex: 'title',
      render: (val, record: any) => {
        const { href } = record;
        return <a href={href}>{val}</a>;
      },
    },
    {
      title: 'likeNum',
      dataIndex: 'likeNum',
      defaultSortOrder: 'descend',
      sorter: (a: any, b: any) => a.likeNum - b.likeNum,
    },
  ];
  const videoCols: ColumnsType<DataType> = [
    {
      title: '视频标题',
      dataIndex: 'title',
      width: 285,
      render: (val, render: any) => {
        const { fans, like } = render;
        return <a href={render.href}>{val}</a>;
      },
    },
    {
      title: 'likeNum',
      dataIndex: 'likeNum',
      width: 65,
      defaultSortOrder: 'descend',
      sorter: (a: any, b: any) => a.likeNum - b.likeNum,
    },
    {
      title: '粉丝-赞',
      dataIndex: 'userName',
      width: 55,
      render: (val, render: any) => {
        const { fans, like } = render;
        return (
          <div>
            粉丝{fans}个，获{like}个赞
          </div>
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
        onFinish={onFinish}
        initialValues={{ type: 'favorite_collection' }}
        colon={false}
      >
        <Form.Item name="url" label="link">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            获取
          </Button>
        </Form.Item>
      </Form>
      <Form
        layout="inline"
        form={searchForm}
        className={styles.filter}
        onFinish={onSearch}
        initialValues={{ type: 'favorite_collection' }}
        colon={false}
      >
        {/* <Form.Item name="user" label="user">
          <Select style={{ width: 120 }} options={userList} />
        </Form.Item> */}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Form.Item>
      </Form>
      <Table columns={columns} pagination={false} dataSource={listData || []} />
      <Modal
        title=""
        width="85%"
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
          pagination={false}
          scroll={{ y: '75vh' }}
          columns={videoCols}
          rowKey="_id"
          dataSource={current}
        />
      </Modal>
    </div>
  );
}
