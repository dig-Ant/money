interface Option {
  value: string | number;
  label: string;
  children?: Option[];
}
export const agedUserPageList: Option[] = [
  {
    label: 'all',
    value: 'all',
    children: [
      {
        label: '兔姐姐',
        value:
          'https://www.douyin.com/user/MS4wLjABAAAAQYewMumiY0tQke_VRnMKxp2hPASHyJe4YJNOMrOS70j23RR2Jbf5YCn4NdRYTdzG',
      },
      {
        label: '世外丹云一陈家大姐',
        value:
          'https://www.douyin.com/user/MS4wLjABAAAAPTkq3uJcJMbeqwgIvRJQ5nZ-qV4xWGQYNHScBeoz_ss',
      },
      {
        label: '周姐',
        value:
          'https://www.douyin.com/user/MS4wLjABAAAA6tn5qhmpIB2PaHhGUQxZN8at2dkw30cM_vwPAt61AAcrx6kMpfBmYHOHsxgaGop_',
      },
      {
        label: '兰兰音乐',
        value:
          'https://www.douyin.com/user/MS4wLjABAAAA6mIvOmAFmzw7-3KxelgzEsBcAnvixrvMDg6wrXUg4fGIvUTpKEdRmDR_jrteAj3e',
      },
    ],
  },
];
