import { request, api } from '@/utils';
import {
  EXEC_DY_DELETE,
  EXEC_DY_DELETE_SINGLE,
  EXEC_DY_VIDEPMSG,
} from '@/utils/api';

const { EXEC_DY_USERS_LIKE } = api;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default {
  namespace: 'consumerPage',
  state: {
    num: 0,
  },
  reducers: {
    add(state: any) {
      state.num += 1;
    },
  },
  effects: {
    *batchLike({ payload }: any, { call, put }: any) {
      yield call(() =>
        request(EXEC_DY_USERS_LIKE, { method: 'post', data: payload }),
      );
    },
    *getVideoMsg({ payload }: any, { call, put }: any) {
      yield call(() =>
        request(EXEC_DY_VIDEPMSG, { method: 'post', data: payload }),
      );
    },
    *delete({ payload }: any, { call, put }: any) {
      yield call(() =>
        request(EXEC_DY_DELETE, { method: 'post', data: payload }),
      );
    },
    *deleteSingleUser({ payload }: any, { call, put }: any) {
      yield call(() =>
        request(EXEC_DY_DELETE_SINGLE, { method: 'post', data: payload }),
      );
    },
  },
  subscriptions: {
    setups(action) {
      const { history, dispatch } = action;

      // history.listen((location) => {

      // });
    },
  },
};
