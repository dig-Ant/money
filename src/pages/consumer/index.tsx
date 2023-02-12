import React, { useState, useEffect } from 'react';
import { useSelector, useRequest, useDispatch } from 'umi';
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
import { GET_DY_USERS, GET_DY_USERS_LIST } from '@/utils/api';
import { consumerUserPageList, copy, transformUrl } from '@/utils/common';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { modeOptions } from '@/utils/userPageList';

const userType = 'consumer';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [current, setCurrent] = useState([]);

  const { run } = useRequest(
    (data) => {
      return request(GET_DY_USERS, {
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
        return;
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
    {
      title: 'action',
      render: (_, record) => {
        const { _id } = record || {};
        return (
          <a
            onClick={() => {
              dispatch({
                type: 'consumerPage/batchLike',
                payload: { userType, _id },
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
      title: '_id',
      dataIndex: '_id',
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
      width: 25,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      width: 25,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      width: 25,
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
    {
      title: '第一条视频',
      dataIndex: 'firstVideoSrc',
      width: 350,
      render: (val, record: any) => {
        const { videoTitles = [], firstVideoSrc } = record || {};
        const text = (videoTitles[0] || '').split('\n').slice(-1)[0] || '';
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
  let { list = [] } = listData;
  list = list.map((e: any) => {
    if (e.commentList) {
      e.commentList = e.commentList.filter((e: any) => {
        return e.age && e.age.replace('岁', '') - 0 < 40;
      });
    }
    return e;
  });
  console.log('list: ', list, listError);
  const onFinish = (values: Record<string, any>) => {
    console.log('values: ', values);

    run({
      ...values,
      userURL: transformUrl((values.userURL || [])[1]),
      userType,
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
          isLogin: false,
          type: 'like',
          limitLen: 1,
          commentLimitLen: 270,
        }}
        colon={false}
      >
        <Form.Item>
          <Button type="primary" htmlType="submit">
            获取
          </Button>
        </Form.Item>
        <Form.Item name="userURL">
          <Cascader options={consumerUserPageList} placeholder="userURL" />
        </Form.Item>
        <Form.Item label="主页前" name="limitLen">
          <Input style={{ width: '42px' }} />
        </Form.Item>
        <Form.Item name="type" label="条">
          <Radio.Group>
            <Radio.Button value="post">作品</Radio.Button>
            <Radio.Button value="like">喜欢</Radio.Button>
            <Radio.Button value="favorite_collection">收藏</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="link" label="或link">
          <Input style={{ width: '155px' }} />
        </Form.Item>
        <Form.Item name="commentLimitLen" label="的">
          <Input style={{ width: '55px' }} />
        </Form.Item>
        <Form.Item label="条评论者">
          <Button
            type="primary"
            onClick={() => {
              form.validateFields().then((value) => {
                listRun({ userType });
              });
            }}
          >
            查询
          </Button>
        </Form.Item>
        <Form.Item name="mode">
          <Radio.Group>
            {modeOptions.map((e: any) => {
              return (
                <Radio value={e.value} key={e.value}>
                  {e.label}
                </Radio>
              );
            })}
          </Radio.Group>
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
        >
          copyAll
        </Button>
        <Table
          scroll={{ y: '75vh' }}
          columns={commentCols}
          rowKey="_id"
          dataSource={current}
        />
      </Modal>
    </div>
  );
}
