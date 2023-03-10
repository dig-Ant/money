interface Option {
  value: string | number;
  label: string;
  children?: Option[];
}

export const businessUserPageList: Option[] = [
  {
    value: '居家',
    label: '居家',
    children: [
      {
        label: '乐林好物',
        value:
          'https://www.douyin.com/user/MS4wLjABAAAAWHKVcRzaBT0cB6Imk39ABPqsZTIHamZkcFDmrhRFt6s',
      },
      {
        label: '乔乔好物',
        value:
          'https://www.douyin.com/user/MS4wLjABAAAAc1psH2X0JDFrH3sBzn7a3Z60FzNbkgyPs1VOrmTukDddwuD_Cb5u5Pl7i0zaLa1v',
      },
    ],
  },
  {
    value: '全品类',
    label: '全品类',
    children: [
      {
        label: '乔妹好物',
        value:
          'https://www.douyin.com/user/MS4wLjABAAAAtdTddQ9ISD6FfJ0kHEkorbjISQeZnhF6rUqHZOzuHGE',
      },
      {
        label: '小颖好物',
        value:
          'https://www.douyin.com/user/MS4wLjABAAAAIffNageL7ftKI-ublUZs3v1eGu8T1VW2rzjXHKaZVxTfEhdDvyLtt-0yj2p2HqHr',
      },
      {
        label: '大开好物分享',
        value:
          'https://www.douyin.com/user/MS4wLjABAAAAs8eex9FDtgSNqmTg6ICk9xtQQ497nzVOWuG52_NQwluwS5D74cbLv6wA9i7X3dfp',
      },
      {
        label: '思娇好物',
        value:
          'https://www.douyin.com/user/MS4wLjABAAAAOw8CezlYWY9b5x_NAvzYgv1CRWgF01CzjXieZ18yifRaWuBhPHPZN6xDC5k7gM8Z',
      },
      {
        label: '七七好物',
        value:
          'https://www.douyin.com/user/MS4wLjABAAAAssBPJ0HHlMTNyXhd4gMVAlTcT5Jz0Zo_8Pc4tS1ef78',
      },
      {
        label: '云云好物',
        value:
          'https://www.douyin.com/user/MS4wLjABAAAA2i1AhWAcPVZX3j5uwmcCuNmCYx6XOkvC5FXJYZxHDr8',
      },
    ],
  },
  {
    value: '年轻品',
    label: '年轻品',
    children: [
      {
        label: '袁妹妹',
        value:
          'https://www.douyin.com/user/MS4wLjABAAAAxph_xYxXF1qd3tdm4BctBUzu-1w5bTtdwzPLayvyoCY',
      },
      {
        label: '小炎好物',
        value:
          'https://www.douyin.com/user/MS4wLjABAAAAD9YaF2w63nxhkoXGoEKhMX7ofVmZNS3O1735go_gnaM',
      },
    ],
  },
];
