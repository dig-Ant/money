import { request, api } from '@/utils';

const { EXEC_DY_USERS_LIKE } = api;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default {
  namespace: 'textPage',
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
  },
  subscriptions: {
    setups(action) {
      console.log('action:11 ', action);
      const { history, dispatch } = action;

      // history.listen((location) => {

      // });
    },
  },
};
