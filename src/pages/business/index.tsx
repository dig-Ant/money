import React, { useState, useEffect } from 'react';
import { connect, useSelector, useRequest, useDispatch } from 'umi';

import {
  Space,
  Table,
  Tag,
  Form,
  Button,
  Input,
  Select,
  InputNumber,
  message,
  notification,
  Radio,
  Modal,
} from 'antd';
import request from '@/utils/request';
import { GET_DY_USERS, GET_DY_USERS_LIST } from '@/utils/api';
import { businessUserPageList, copy } from '@/utils/common';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import styles from './index.less';
const userType = 'business';
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
    listRun({ userType });
  }, []);

  const columns: ColumnsType<DataType> = [
    {
      title: 'business',
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
      key: 'action',
      fixed: 'right',
      render: (_, record) => {
        const { _id } = record || {};
        return (
          <Space size="middle">
            <a
              onClick={() => {
                dispatch({
                  type: 'businessPage/batchLike',
                  payload: { userType, _id },
                });
              }}
            >
              赞
            </a>
            <a
              onClick={() => {
                dispatch({
                  type: 'businessPage/getVideoMsg',
                  payload: { userType, _id },
                });
              }}
            >
              获取主页视频信息
            </a>
            {/* <a>删除</a> */}
          </Space>
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
          name = '',
        } = record || {};
        return (
          <a href={href}>
            {name || ''}-{likeNum}-{title}
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
          <div>{val.replace('男', '').replace('女', '').replace('岁', '')}</div>
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
  let { list = [], total, pageSize, page } = listData;
  list = list
    .filter((e: any) => e.commentList && e.commentList.length > 0)
    .map((e: any) => {
      e.commentList = e.commentList.filter((e: any) => {
        return e.age && e.age.replace('岁', '') - 0 < 40;
      });
      return e;
    });
  console.log('list: ', list, listError);
  const onFinish = (values: Record<string, any>) => {
    console.log('values: ', values);
    run({ ...values, userType });
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
          // url: 'https://www.douyin.com/user/MS4wLjABAAAAc1psH2X0JDFrH3sBzn7a3Z60FzNbkgyPs1VOrmTukDddwuD_Cb5u5Pl7i0zaLa1v',
          commentLimitLen: 270,
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
        {/* <Form.Item>
          <Button
            htmlType="button"
            onClick={() => {
              form.resetFields();
            }}
          >
            重置
          </Button>
        </Form.Item> */}
        <Form.Item name="url">
          <Select
            defaultValue=""
            style={{ width: 120 }}
            options={businessUserPageList}
          />
        </Form.Item>

        {/* <Form.Item name="filter" label="包含文字筛选">
          <Input />
        </Form.Item> */}

        {/* <Form.Item name="downloadFilename" label="文件夹名">
          <Input />
        </Form.Item> */}

        {/* <Form.Item
          label=""
          name="isLogin"
          labelCol={{ span: 0 }}
          wrapperCol={{ span: 24 }}
        >
          <Radio.Group>
            <Radio.Button value={true}>登录</Radio.Button>
            <Radio.Button value={false}>不登录</Radio.Button>
          </Radio.Group>
        </Form.Item> */}
        {/* <Form.Item
          label="筛选用户类型"
          name="userType"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Radio.Group>
            <Radio.Button value={'business'}>同行</Radio.Button>
            <Radio.Button value={'user'}>用户</Radio.Button>
          </Radio.Group>
        </Form.Item> */}
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
