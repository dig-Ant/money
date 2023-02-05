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
import { GET_DY_LIVE_USERS, GET_DY_LIVE_USERLIST } from '@/utils/api';
import { copy, transformUrl, liveUrl } from '@/utils/common';
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
      return request(GET_DY_LIVE_USERS, {
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
      return request(GET_DY_LIVE_USERLIST, {
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
      title: 'consumer',
      dataIndex: 'commentList',
      render: (val, record: any) => {
        const num = (val && val.length) || 0;
        const commentList = record?.commentList || [];
        return (
          <div>
            <a
              onClick={() => {
                num && setIsModalOpen(true);
                setCurrent(commentList);
              }}
            >
              {num}
            </a>
          </div>
        );
      },
    },
    {
      title: 'action',
      // key: 'action',
      // fixed: 'right',
      render: (_, record) => {
        const { _id } = record || {};
        return (
          <a
            onClick={() => {
              dispatch({
                type: 'consumerPage/batchLike',
                payload: { userType: 'consumer', _id, type: 'live' },
              });
            }}
          >
            赞
          </a>
        );
      },
    },
    {
      title: '视频信息',
      dataIndex: 'title',
      render: (val, record: Record<string, any>) => {
        const {
          href = 'javaScript:void(0);',
          title = '',
          likeNum = '',
          user = {},
        } = record || {};
        return (
          <a href={href}>
            {user.name || ''}-{likeNum}-{title}
          </a>
        );
      },
    },
    {
      title: 'createdAt',
      dataIndex: 'createdAt',
      render: (val) => moment(val).format('YYYY-MM-DD HH:mm:ss').slice(5, 16),
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
      dataIndex: 'userInfo',
      width: 350,
      render: (val, record: any) => {
        const { videoTitles = [], firstVideoSrc } = record || {};
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
  const { list = [], total, pageSize, page } = listData;
  console.log('list: ', list, listError);
  const onFinish = (values: Record<string, any>) => {
    console.log('values: ', values);

    run({
      ...values,
      url: transformUrl(values),
      userType: 'consumer',
      type: 'live',
    });
  };
  const { url, title } = liveUrl(2);
  return (
    <div>
      <Form
        layout="inline"
        form={form}
        className="list-filter"
        onFinish={onFinish}
        initialValues={{
          url,
          title,
          // url: 'https://live.douyin.com/216666217971?room_id=7196290829210618624',
          isLogin: false,
          type: 'like',
          limitLen: 1,
          commentLimitLen: 100,
        }}
        colon={false}
      >
        <Form.Item name="url">
          <Input placeholder="link" />
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
          <Button type="primary" htmlType="submit">
            获取
          </Button>
        </Form.Item>
      </Form>
      <Table
        scroll={{ x: true }}
        columns={columns}
        dataSource={list}
        rowKey="_id"
        // pagination={{
        //   total,
        //   pageSize,
        //   current: page,
        //   onChange: (page, pageSize) => {
        //     dispatch(listRun({ page, pageSize }));
        //   },
        // }}
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
        <Button
          type="link"
          onClick={() => {
            copy(
              JSON.stringify(
                current.map((e: any) => {
                  return e.videoTitles[0]
                    .split('\n')
                    .slice(-1)[0]
                    .split(/[#|\s]/)
                    .join(' ');
                }),
              ),
            );
          }}
          //
        >
          copyAll
        </Button>
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
