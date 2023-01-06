/**
 *
 * @param {*} fn 遍历执行的函数
 * @param {*} data 遍历传给每一项
 * @param {*} limitNum 一次执行的任务数量
 * @returns
 *
 * 举例
 * limitExec(
  async (data, i) => {
    try {
      const s = await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (i % 2 === 0) {
            resolve(data);
          } else {
            reject(data);
          }
        }, Math.round(Math.random() * 6000));
      });
      console.log(s);
      return s;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
  3,
);
 */
const limitExec = async (fn, data, limitNum = 5) => {
  if (!Array.isArray(data)) {
    console.error('limitExec data不是数组');
    return null;
  }
  let res = [];
  const fns = [];
  for (let i = 0; i < data.length; i++) {
    // j所在queue中的位置
    fns[i] = async (j) => {
      try {
        const fnRes = await fn(data[i], i);
        res[i] = fnRes;
      } catch (error) {
        res[i] = error;
      }
      return j;
    };
  }

  const queue = fns.splice(0, limitNum).map((fn, i) => fn(i));
  while (fns.length) {
    await Promise.race(queue).then((i) => {
      if (fns.length) {
        queue[i] = fns.shift()(i);
      }
    });
  }
  await Promise.allSettled(queue);
  return res;
};

module.exports = {
  limitExec,
};
