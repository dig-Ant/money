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
import {
  GET_DY_USERS,
  GET_DY_USERS_LIST,
  GET_DY_USERS_NAME,
} from '@/utils/api';
import {
  consumerUserPageList,
  businessUserPageList,
  agedUserPageList,
  copy,
  transformUrl,
} from '@/utils/common';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
const createArr = function (length: number) {
  return new Array(Math.ceil(length / 15)).fill(1);
};
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
  const [searchForm] = Form.useForm();
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
  const { run: userRun, data: userList = [] } = useRequest(
    (data) => {
      return request(GET_DY_USERS_NAME, {
        method: 'post',
        data,
      }).then((res) => {
        return res?.data;
      });
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
    userRun({ userType });
    setTimeout(() => {
      listRun({ userType });
    }, 1000);
  }, []);
  // console.log(userList);
  const columns: ColumnsType<DataType> = [
    {
      title: '消N',
      width: 150,
      dataIndex: 'commentList',
      render: (val, record: any) => {
        const num = (val && val.length) || 0;
        const commentList = val || [];
        const commentNUM = createArr(commentList.length);
        return (
          <div>
            <a
              onClick={() => {
                console.log(val);
                num && setIsModalOpen(true);
                setListType('commentList');
                seID(record._id);
                setCurrent(commentList.filter((e) => !e.isLiked));
              }}
            >
              {num}
            </a>
            &nbsp; &nbsp;
            {commentNUM.map((e, index) => {
              const startI = index * 15 + 15;
              const endI = startI + 15;
              let allCmted = undefined;
              let cmtLiked = commentList
                .slice(startI, endI)
                .map((e: any) => e.isLiked);
              cmtLiked = [...new Set(cmtLiked)];
              if (cmtLiked.length == 1 && cmtLiked[0] == true) {
                allCmted = true;
              } else if (cmtLiked.length == 1 && cmtLiked[0] == false) {
                allCmted = false;
              } else {
                allCmted = undefined;
              }
              let color =
                allCmted === true
                  ? 'grey'
                  : allCmted === false
                  ? 'blue'
                  : 'orange';
              return (
                <a
                  style={{ color }}
                  onClick={() => {
                    dispatch({
                      type: 'consumerPage/batchLike',
                      payload: {
                        userType,
                        listType: 'commentList',
                        _id: record._id,
                        index,
                        list: e[commentList],
                      },
                    });
                  }}
                >
                  评论{index}&nbsp; &nbsp;
                </a>
              );
            })}
          </div>
        );
      },
    },
    {
      title: '同N',
      width: 150,
      dataIndex: 'businessList',
      render: (val, record: any) => {
        const num = (val && val.length) || 0;
        const businessList = val || [];
        const commentNUM = createArr(businessList.length);
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
            &nbsp; &nbsp;
            {commentNUM.map((e, index) => {
              return (
                <a
                  onClick={() => {
                    dispatch({
                      type: 'consumerPage/batchLike',
                      payload: {
                        userType,
                        listType: 'businessList',
                        _id: record._id,
                        index,
                      },
                    });
                  }}
                >
                  评论{index}&nbsp; &nbsp;
                </a>
              );
            })}
          </div>
        );
      },
    },
    {
      title: '关N',
      width: 150,
      dataIndex: 'followList',
      render: (val, record: any) => {
        const num = (val && val.length) || 0;
        const followList = val || [];
        const commentNUM = createArr(followList.length);
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
            &nbsp; &nbsp;
            {commentNUM.map((e, index) => {
              return (
                <a
                  onClick={() => {
                    dispatch({
                      type: 'consumerPage/batchLike',
                      payload: {
                        userType,
                        listType: 'followList',
                        _id: record._id,
                        index,
                      },
                    });
                  }}
                >
                  评论{index}&nbsp; &nbsp;
                </a>
              );
            })}
          </div>
        );
      },
    },
    {
      title: '发布时间',
      dataIndex: 'time',
      render: (val, record: Record<string, any>) => {
        return <span>{(val || '').slice(5)}</span>;
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
          <Space>
            <a href={href}>
              {name || ''}-{likeNum}-{title}
            </a>
            &nbsp;
            <a
              href="javaScript:void(0);"
              onClick={() => {
                copy(title);
              }}
            >
              copy
            </a>
          </Space>
        );
      },
    },
    {
      title: 'action',
      width: 170,
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
      title: '最近活跃',
      dataIndex: 'activeTime',
      width: 80,
    },
    {
      title: '已赞',
      dataIndex: 'isLiked',
      width: 50,
      render: (val, render: any) => {
        let res = '';
        if (val == 'true' || val == true) {
          res = '已赞';
        }
        return <div>{res}</div>;
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
        const { svgHtml, userLink } = render;
        const a = () => {
          return { __html: svgHtml };
        };
        return (
          <div>
            <div dangerouslySetInnerHTML={a()}></div>
            <a href={userLink}>{userName}</a>
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
          <a
            onClick={() => {
              dispatch({
                type: 'consumerPage/deleteSingleUser',
                payload: { userType, _id, listType, userName: record.userName },
              }).then(() => {
                // listRun({ userType });
              });
            }}
          >
            a
          </a>
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
            {userType == 'business' ? (
              <Button
                type="link"
                onClick={() => {
                  request(GET_DY_USERS, {
                    method: 'post',
                    data: {
                      link: firstVideoSrc,
                      userType,
                      commentLimitLen: 100,
                    },
                  });
                }}
              >
                获取用户
              </Button>
            ) : (
              ''
            )}
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
                  window.location.host + '/text/keyword?v=' + textList.join(''),
                );
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
                    window.open(window.location.host + '/text/keyword?v=' + e);
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

  list = list.map((e: any, i: number) => {
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
          if (
            e.svgHtml &&
            !e.svgHtml.includes('男') &&
            (e.svgHtml.includes('woman') || !e.svgHtml.includes('>')) &&
            e.age < 40
          ) {
            return true;
          } else {
            return false;
          }
        })
        .filter((e: any) => {
          return !e.isLiked;
        });

      if (i == 0) {
        console.log(e.commentList.map((e) => e.svgHtml));
      }
    }
    return e;
  });

  list.reduce((prev: any, curr: any) => {
    if (curr.commentList) {
      prev += curr.commentList.length;
    }
    return prev;
  }, 0);
  // console.log('list: ', list, listError);
  const onFinish = (values: Record<string, any>) => {
    console.log('values: ', values);

    run({
      ...values,
      userURL: transformUrl((values.userURL || [])[1]),
      userType,
    });
  };
  const onSearchFinish = (values: Record<string, any>) => {
    console.log('values: ', values);

    listRun({
      ...values,
      userType,
    });
  };
  return (
    <div>
      <div style={{ display: 'flex' }}>
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
            <Button type="primary" htmlType="submit" size="small">
              获取
            </Button>
          </Form.Item>
          <Form.Item name="userURL">
            <Cascader
              options={CascaderOptions}
              size="small"
              placeholder="userURL"
            />
          </Form.Item>
          <Form.Item label="主页第" name="index">
            <Input style={{ width: '42px' }} size="small" />
          </Form.Item>
          <Form.Item name="type" label="条">
            <Radio.Group size="small">
              <Radio.Button value="post">作品</Radio.Button>
              <Radio.Button value="like">喜欢</Radio.Button>
              <Radio.Button value="favorite_collection">收藏</Radio.Button>
              <Radio.Button value="record">历史</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="link" label="或link">
            <Input style={{ width: '125px' }} size="small" />
          </Form.Item>
          <Form.Item name="commentLimitLen">
            <Input style={{ width: '47px' }} size="small" />
          </Form.Item>
        </Form>
        <Form layout="inline" form={searchForm} onFinish={onSearchFinish}>
          <Form.Item name="user" label="条评论者,用户">
            <Select style={{ width: 120 }} options={userList} size="small" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="small">
              查询
            </Button>
          </Form.Item>
        </Form>
      </div>
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
            console.log(current);
            copy(
              JSON.stringify(
                current.map((e: any) => {
                  return (e.videoTitles || [''])[0]
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
          pagination={false}
        />
      </Modal>
    </div>
  );
}
