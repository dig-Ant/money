import { request } from '@/utils';
import { EXEC_DY_DOWNLIST } from '@/utils/api';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default {
  namespace: 'downloadPage',
  state: {
    num: 0,
  },
  reducers: {
    add(state: any) {
      state.num += 1;
    },
  },
  effects: {
    *addAsync(_action: any, { put }: any) {
      yield delay(1000);
      yield put({ type: 'add' });
    },
    *getDownloadList({ payload }: any, { call, put }: any) {
      yield call(() =>
        request(EXEC_DY_DOWNLIST, { method: 'post', data: payload }),
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
