import React, { useState, useEffect } from 'react';
import { useSelector, useRequest, useDispatch, useLocation } from 'umi';
import {
  Space,
  Table,
  Form,
  Button,
  Input,
  Select,
  Cascader,
  message,
  Radio,
  Modal,
} from 'antd';
import request from '@/utils/request';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { EXEC_DY_FOLLOW_list } from '@/utils/api';

interface DataType {
  _id: string;
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

export default function followList() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [current, setCurrent] = useState([]);
  const { run } = useRequest(
    (data) => {
      return request(EXEC_DY_FOLLOW_list, {
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
  const {
    run: listRun,
    data: listData = [],
    error: listError,
    loading: listLoading,
  } = useRequest(
    (data) => {
      return request(EXEC_DY_FOLLOW_list, {
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

  const columns: ColumnsType<DataType> = [
    {
      title: '用户',
      dataIndex: 'userName',
      render: (val, record: any) => {
        const { userLink, svgHtml } = record;
        const a = () => {
          return { __html: svgHtml };
        };
        return (
          <a href={userLink}>
            <div dangerouslySetInnerHTML={a()}></div>
            {val}
          </a>
        );
      },
    },
    {
      title: 'comment',
      dataIndex: 'comment',
    },
    {
      title: '_id',
      dataIndex: '_id',
    },
    {
      title: 'activeTime',
      dataIndex: 'activeTime',
    },
    {
      title: 'createdAt',
      dataIndex: 'createdAt',
      render: (val) => moment(val).format('YYYY-MM-DD HH:mm:ss').slice(5, 16),
    },
  ];

  const onFinish = (values: Record<string, any>) => {
    console.log('values: ', values);

    run({
      ...values,
    });
  };
  return (
    <div>
      <Table
        scroll={{ x: true, y: 500 }}
        columns={columns}
        pagination={false}
        dataSource={listData}
        rowKey="_id"
      />
    </div>
  );
}
