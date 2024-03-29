import React, { useState, useEffect } from 'react';
import { connect, useSelector, useRequest, useDispatch } from 'umi';

import {
  Space,
  Table,
  Tag,
  Select,
  Cascader,
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
import { copy, transformUrl, liveUrl, liveUserPageList } from '@/utils/common';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import styles from './index.less';
const userType = 'live';
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
    listRun({ userType });
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
    // {
    //   title: '_id',
    //   dataIndex: '_id',
    // },
    {
      title: 'action',
      // key: 'action',
      // fixed: 'right',
      render: (_, record) => {
        const { _id } = record || {};
        return (
          <Space>
            <a
              onClick={() => {
                dispatch({
                  type: 'consumerPage/batchLike',
                  payload: { userType, _id, type: 'live' },
                });
              }}
            >
              赞
            </a>

            <a
              onClick={() => {
                dispatch({
                  type: 'consumerPage/delete',
                  payload: { userType, _id },
                }).then(() => {
                  listRun({ userType });
                });
              }}
            >
              删除
            </a>
          </Space>
        );
      },
    },
    {
      title: '直播链接',
      dataIndex: 'userURL',
      render: (val, record: Record<string, any>) => {
        return <a href={val}>link</a>;
      },
    },
    {
      title: 'createdAt',
      dataIndex: 'createdAt', //val//
      render: (val) => moment(val).format('YYYY-MM-DD HH:mm:ss').slice(5, 16),
    },
  ];

  const commentCols: ColumnsType<DataType> = [
    {
      title: '用户名',
      dataIndex: 'name',
      width: 25,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      width: 25,
      render: (val) => {
        let gender = '';
        if (val && val.includes('男')) gender = '男';
        if (val && val.includes('女')) gender = '女';
        return <div>{gender}</div>;
      },
    },
    {
      title: '年龄',
      dataIndex: 'age',
      width: 25,
      render: (val) => {
        return (
          <div>
            {(val || '').replace('男', '').replace('女', '').replace('岁', '')}
          </div>
        );
      },
    },
    {
      title: '粉丝-赞',
      dataIndex: 'userName',
      width: 55,
      render: (val, render: any) => {
        const { gender, fans, age, like } = render;
        return (
          <div>
            粉丝{fans}个，获{like}个赞
          </div>
        );
      },
    },
    {
      title: '第一条视频',
      dataIndex: 'firstVideoSrc',
      width: 350,
      render: (val, record: any) => {
        const { videoTitles = [], firstVideoSrc } = record || {};
        if (videoTitles && videoTitles.length > 0) {
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
                  copy(
                    textList
                      .sort((a: any, b: any) => b.length - a.length)
                      .join(''),
                  );
                  window.open(
                    location.origin + '/search?v=' + textList.join(''),
                  );
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
        }
      },
    },
  ];
  const { list = [], total, pageSize, page } = listData;
  console.log('list: ', list, listError);
  const onFinish = (values: Record<string, any>) => {
    console.log('values: ', values);

    run({
      ...values,
      userURL: transformUrl(values.userURL[1]),
      userType: 'consumer',
      type: 'live',
    });
  };
  return (
    <div>
      <Form
        layout="inline"
        form={form}
        className="list-filter"
        onFinish={onFinish}
        initialValues={{
          // userURL: 'https://live.douyin.com/216666217971?room_id=7196290829210618624',
          isLogin: false,
          type: 'like',
          limitLen: 1,
          commentLimitLen: 100,
        }}
        colon={false}
      >
        <Form.Item>
          <Button type="primary" htmlType="submit">
            获取
          </Button>
        </Form.Item>
        <Form.Item name="userURL">
          <Cascader options={liveUserPageList} placeholder="userURL" />
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
      </Form>
      <Table
        scroll={{ x: true, y: 500 }}
        columns={columns}
        dataSource={list}
        pagination={false}
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
                current
                  .map((e: any) => {
                    return e.videoTitles[0]
                      .split('\n')
                      .slice(-1)[0]
                      .split(/[#|\s]/)
                      .join(' ');
                  })
                  .sort((a: any, b: any) => b.length - a.length),
              ),
            );
          }}
          //
        >
          copyAll
        </Button>
        <Table
          scroll={{ y: '75vh' }}
          pagination={false}
          columns={commentCols}
          dataSource={current}
          rowKey="_id"
        />
      </Modal>
    </div>
  );
}
