import { addDays, format, isValid, subDays } from 'date-fns';
import { Between } from 'typeorm';

export const findDateQuery = (date: Date, from: string, to: string) =>
  // Default get from 10 days ago from now and to 10 days later from now, can change in future
  Between(
    isValid(new Date(from)) ? from : format(subDays(date, 10), 'yyyy-MM-dd'),
    isValid(new Date(to)) ? to : format(addDays(date, 10), 'yyyy-MM-dd'),
  );
