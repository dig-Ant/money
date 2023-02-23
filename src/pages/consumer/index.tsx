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
import { GET_DY_USERS, GET_DY_USERS_LIST } from '@/utils/api';
import {
  consumerUserPageList,
  businessUserPageList,
  agedUserPageList,
  copy,
  transformUrl,
} from '@/utils/common';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';

interface DataType {
  _id: string;
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
  const [listType, setListType] = useState('commentList');
  const [_id, seID] = useState('');
  const location = useLocation();
  const userType = location.pathname.slice(6);
  let CascaderOptions = consumerUserPageList;
  if (userType == 'consumer') {
    CascaderOptions = consumerUserPageList;
  } else if (userType == 'business') {
    CascaderOptions = businessUserPageList;
  } else if (userType == 'aged') {
    CascaderOptions = agedUserPageList;
  }
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
      title: '消N',
      width: 70,
      dataIndex: 'commentList',
      render: (val, record: any) => {
        const num = (val && val.length) || 0;
        const commentList = val || [];
        return (
          <div>
            <a
              onClick={() => {
                console.log(val.map((e) => `gender:${e.gender}-age:${e.age}`));

                num && setIsModalOpen(true);
                setListType('commentList');
                seID(record._id);
                setCurrent(commentList);
              }}
            >
              {num}
            </a>
            &nbsp; &nbsp; &nbsp;
            <a
              onClick={() => {
                dispatch({
                  type: 'consumerPage/batchLike',
                  payload: {
                    userType,
                    listType: 'commentList',
                    _id: record._id,
                  },
                });
              }}
            >
              评论
            </a>
          </div>
        );
      },
    },
    {
      title: '同N',
      width: 70,
      dataIndex: 'businessList',
      render: (val, record: any) => {
        const num = (val && val.length) || 0;
        const businessList = val || [];
        return (
          <div>
            <a
              onClick={() => {
                console.log(val.map((e) => `gender:${e.gender}-age:${e.age}`));
                num && setIsModalOpen(true);
                setListType('businessList');
                seID(record._id);
                setCurrent(businessList);
              }}
            >
              {num}
            </a>
            &nbsp; &nbsp; &nbsp;
            <a
              onClick={() => {
                dispatch({
                  type: 'consumerPage/batchLike',
                  payload: {
                    userType,
                    listType: 'businessList',
                    _id: record._id,
                  },
                });
              }}
            >
              评论
            </a>
          </div>
        );
      },
    },
    {
      title: '关N',
      width: 70,
      dataIndex: 'followList',
      render: (val, record: any) => {
        const num = (val && val.length) || 0;
        const followList = val || [];
        return (
          <div>
            <a
              onClick={() => {
                console.log(val.map((e) => `gender:${e.gender}-age:${e.age}`));
                num && setIsModalOpen(true);
                setListType('followList');
                seID(record._id);
                setCurrent(followList);
              }}
            >
              {num}
            </a>
            &nbsp; &nbsp; &nbsp;
            <a
              onClick={() => {
                dispatch({
                  type: 'consumerPage/batchLike',
                  payload: {
                    userType,
                    listType: 'followList',
                    _id: record._id,
                  },
                });
              }}
            >
              关注
            </a>
          </div>
        );
      },
    },
    {
      title: 'action',
      width: 100,
      render: (_, record) => {
        return (
          <Space size="middle">
            <a
              onClick={() => {
                dispatch({
                  type: 'consumerPage/delete',
                  payload: { userType, _id: record._id },
                }).then(() => {
                  listRun({ userType });
                });
              }}
            >
              删除
            </a>
            {userType === 'business' ? (
              <a
                onClick={() => {
                  dispatch({
                    type: 'businessPage/getVideoMsg',
                    payload: { userType, _id: record._id },
                  });
                }}
              >
                获取主页视频信息
              </a>
            ) : null}
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
      title: '头像',
      dataIndex: 'userImgSrc',
      width: 60,
      render: (val, render: any) => {
        return (
          <div>
            <img src={val} style={{ width: '50px', height: '50px' }} alt="" />
          </div>
        );
      },
    },
    {
      title: '评论',
      dataIndex: 'comment',
      width: 80,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      width: 60,
      render: (userName, render: any) => {
        const { svgHtml } = render;
        const a = () => {
          return { __html: svgHtml };
        };
        return (
          <div>
            <div dangerouslySetInnerHTML={a()}></div>
            <a>{userName}</a>
          </div>
        );
      },
    },
    {
      title: '性别',
      dataIndex: 'gender',
      width: 35,
    },
    // {
    //   title: '年龄',
    //   dataIndex: 'age',
    //   width: 35,
    // },
    {
      title: '操作',
      width: 35,
      render: (val, record: any) => {
        return (
          <div
            onClick={() => {
              dispatch({
                type: 'consumerPage/deleteSingleUser',
                payload: { userType, _id, listType, userName: record.userName },
              }).then(() => {
                // listRun({ userType });
              });
            }}
          >
            删除
          </div>
        );
      },
    },
    {
      title: '粉丝-赞',
      dataIndex: 'userName',
      width: 55,
      render: (val, render: any) => {
        const { fans, like } = render;
        return (
          <div>
            {fans}粉-{like}赞
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
                copy(
                  textList
                    .sort((a: any, b: any) => b.length - a.length)
                    .join(''),
                );
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
      e.commentList = e.commentList
        .map((f: any) => {
          if (f.gender) {
            const match = f.gender.match(/(\d+)岁/);
            if (match) f.age = match[1];
          }
          return f;
        })
        .filter((e: any) => {
          if (!e.age) return true;
          return e.age < 40;
        });
    }
    if (e.businessList) {
      e.businessList = e.businessList
        .map((f: any) => {
          if (f.gender) {
            const match = f.gender.match(/(\d+)岁/);
            if (match) f.age = match[1];
          }
          return f;
        })
        .filter((e: any) => {
          if (!e.age) return true;
          return e.age < 40;
        });
    }
    if (e.followList) {
      e.followList = e.followList
        .map((f: any) => {
          if (f.gender) {
            const match = f.gender.match(/(\d+)岁/);
            if (match) f.age = match[1];
          }
          return f;
        })
        .filter((e: any) => {
          if (!e.age) return true;
          return e.age < 40;
        });
    }
    return e;
  });

  list.reduce((prev: any, curr: any) => {
    if (curr.commentList) {
      prev += curr.commentList.length;
      console.log(
        curr.commentList.length,
        prev,
        moment(curr.createdAt).format('YYYY-MM-DD HH:mm:ss').slice(10, 16),
      );
    }
    return prev;
  }, 0);

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
          type: 'like',
          limitLen: 1,
          index: 0,
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
          <Cascader options={CascaderOptions} placeholder="userURL" />
        </Form.Item>
        <Form.Item label="主页第" name="index">
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
      </Form>
      <Table
        scroll={{ x: true, y: 500 }}
        columns={columns}
        pagination={false}
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
        >
          copyAll
        </Button>
        <Table
          scroll={{ y: '75vh' }}
          columns={commentCols}
          rowKey="_id"
          dataSource={current}
          pagination={false}
        />
      </Modal>
    </div>
  );
}
