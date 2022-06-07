const ValidateDate = (
  date: number
): {
  error: string | null;
} => {
  if (date === null || date === undefined || isNaN(date))
    return { error: 'Invalid date' };

  // if date is newer than current date or older than year 385
  if (date < -50000000000000 || date > new Date().getTime())
    return { error: 'Invalid date' };
  else return { error: null };
};

export default ValidateDate;
