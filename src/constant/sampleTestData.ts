import { format, subDays, addDays } from 'date-fns';
export const DAYOFF_SAMPLE_TEST_DATA = [
  {
    date: format(addDays(new Date(), 15), 'yyyy-MM-dd'),
    reasons: 'Đau pụng ',
    type: 1,
  },
  {
    date: format(addDays(new Date(), 15), 'yyyy-MM-dd'),
    reasons: 'Đau đầu',
    type: 2,
  },
  {
    date: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    reasons: 'Đau răng',
    type: 1,
  },
  {
    date: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
    reasons: 'Đau chân',
    type: 2,
  },
  {
    date: format(subDays(new Date(), 15), 'yyyy-MM-dd'),
    reasons: 'Đau tay',
    type: 1,
  },
];
// Default
export const DAYOFF_SAMPLE_TEST_RESULT_CASE_1 = [
  DAYOFF_SAMPLE_TEST_DATA[3],
  DAYOFF_SAMPLE_TEST_DATA[2],
];
// Order by ID ASC
export const DAYOFF_SAMPLE_TEST_RESULT_CASE_2 = [
  DAYOFF_SAMPLE_TEST_DATA[2],
  DAYOFF_SAMPLE_TEST_DATA[3],
];

// Order by DATE DESC
export const DAYOFF_SAMPLE_TEST_RESULT_CASE_3 = [
  DAYOFF_SAMPLE_TEST_DATA[3],
  DAYOFF_SAMPLE_TEST_DATA[2],
];
// Order by DATE DESC
// FROM COVER ALL
export const DAYOFF_SAMPLE_TEST_RESULT_CASE_4 = [
  DAYOFF_SAMPLE_TEST_DATA[4],
  DAYOFF_SAMPLE_TEST_DATA[3],
  DAYOFF_SAMPLE_TEST_DATA[2],
];
// Order by DATE DESC
// TO COVER ALL
export const DAYOFF_SAMPLE_TEST_RESULT_CASE_5 = [
  DAYOFF_SAMPLE_TEST_DATA[3],
  DAYOFF_SAMPLE_TEST_DATA[2],
  DAYOFF_SAMPLE_TEST_DATA[1],
  DAYOFF_SAMPLE_TEST_DATA[0],
];
// Order by DATE DESC
// FROM - TO COVER ALL
export const DAYOFF_SAMPLE_TEST_RESULT_CASE_6 = [
  DAYOFF_SAMPLE_TEST_DATA[4],
  DAYOFF_SAMPLE_TEST_DATA[3],
  DAYOFF_SAMPLE_TEST_DATA[2],
  DAYOFF_SAMPLE_TEST_DATA[1],
  DAYOFF_SAMPLE_TEST_DATA[0],
];
// Order by DATE DESC
// FROM - TO COVER ALL
// LIMIT 2 - PAGE 2
export const DAYOFF_SAMPLE_TEST_RESULT_CASE_7 = [
  DAYOFF_SAMPLE_TEST_DATA[2],
  DAYOFF_SAMPLE_TEST_DATA[1],
];
