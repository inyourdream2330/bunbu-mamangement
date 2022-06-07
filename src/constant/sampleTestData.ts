import { format } from 'date-fns';
export const DAYOFF_SAMPLE_TEST_DATA = [
  {
    date: '2022-01-01',
    reasons: 'Đau pụng ',
    type: 1,
  },
  {
    date: '2022-09-09',
    reasons: 'Đau đầu',
    type: 2,
  },
  {
    date: format(new Date(), 'yyyy-MM-dd'),
    reasons: 'Đau răng',
    type: 1,
  },
  {
    date: '2022-05-11',
    reasons: 'Đau chân',
    type: 2,
  },
  {
    date: '2022-05-11',
    reasons: 'Đau tay',
    type: 1,
  },
];
