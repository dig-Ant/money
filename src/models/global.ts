import request from '@/utils/request';
import { GRT_LINK, LOGIN_PUP, LOGOUT_PUP } from '@/utils/api';
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default {
  namespace: 'global',
  state: {},
  reducers: {
    test(state: any) {
      return { ...state };
    },
  },
  effects: {
    *loginPup(_action: any, { call, put }: any) {
      yield call(() => request(LOGIN_PUP, { method: 'post' }));
    },
    *logoutPup(_action: any, { call, put }: any) {
      yield call(() => request(LOGOUT_PUP, { method: 'post' }));
      // yield put({ type: 'add' });
    },
    *grtLink(_action: any, { call, put }: any) {
      yield call(() => request(GRT_LINK, { method: 'post' }));
      // yield put({ type: 'add' });
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
