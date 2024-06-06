export const formatDate = (date) => {
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  return formattedDate;
};

export const formatDate2 = (date) => {
  const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
  return formattedDate;
};

export const addDays = (date, days) => {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + days);
  return newDate;
};
