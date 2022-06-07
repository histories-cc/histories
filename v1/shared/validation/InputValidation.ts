import validator from 'validator';

import { minYearConstant } from '../../shared/constants/constants';

export const IsValidBio = (bio?: string | null): boolean => {
  return (bio || ' ').length < 512;
};

export const IsValidComment = (comment: string): boolean => {
  return comment.length > 0 && comment.length < 512;
};

export const IsValidUsername = (username: string): boolean => {
  return (
    validator.isAlphanumeric(username) &&
    username.length >= 1 &&
    username.length < 256
  );
};

export const IsValidName = (name: string): boolean => {
  return (
    validator.isAlphaLocales.find((locale) =>
      validator.isAlphanumeric(name, locale)
    ) != null &&
    name.length > 2 &&
    name.length < 256
  );
};

interface IIsValidHistoricalDate {
  startDay?: number | null;
  startMonth?: number | null;
  startYear: number;
  endDay?: number | null;
  endMonth?: number | null;
  endYear: number;
}

export const IsValidHistoricalDate = ({
  startDay,
  startMonth,
  startYear,
  endDay,
  endMonth,
  endYear,
}: IIsValidHistoricalDate): IIsValidHistoricalDate => {
  // if month isn't known don't fill the day
  const newStartDay = startMonth == null ? null : startDay;
  const newEndDay = endMonth == null ? null : endDay;

  // validate start month and year
  if (
    (startMonth != null && (startMonth < 1 || startMonth > 12)) ||
    startYear < minYearConstant ||
    startYear > new Date().getFullYear()
  )
    throw new Error('Invalid date');

  // validate end month and year
  if (
    (endMonth != null && (endMonth < 1 || endMonth > 12)) ||
    endYear < minYearConstant ||
    endYear > new Date().getFullYear()
  )
    throw new Error('Invalid date');

  if (
    newStartDay != null &&
    isNaN(new Date(`${startMonth}-${startDay}-${startYear}`).valueOf())
  )
    throw new Error('Invalid date');

  if (
    newEndDay != null &&
    isNaN(new Date(`${endMonth}-${endDay}-${endYear}`).valueOf())
  )
    throw new Error('Invalid date');

  if (
    new Date(`${startMonth}-${startDay}-${startYear}`) >
    new Date(`${endMonth}-${endDay}-${endYear}`)
  )
    return {
      startDay: newEndDay,
      startMonth: endMonth,
      startYear: endYear,
      endDay: newStartDay,
      endMonth: startMonth,
      endYear: startYear,
    };
  else
    return {
      startDay: newStartDay,
      startMonth,
      startYear,
      endDay: newEndDay,
      endMonth,
      endYear,
    };
};
