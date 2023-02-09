

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default {
  namespace: 'yunyunPage',
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
  },
  subscriptions: {
    setups(action) {
      console.log('action:11 ', action);
      const { history, dispatch } = action;

      // history.listen((location) => {
       
      // });
    },
  }
};
        