const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const getSuffix = day => {
  if(day === 1) return 'st';
  else if(day === 2) return 'nd';
  else if(day === 3) return 'rd';
  else if(day >= 4 && day <= 19) return 'th';
  else if(day === 21) return 'st';
  else if(day === 22) return 'nd';
  else if(day === 23) return 'rd';
  else if(day >= 24 && day <= 30) return 'th';
  else if(day === 31) return 'st';

  return '';
}

const getReadableDate = (date) => {
  if(typeof date === 'number') date = new Date(date);
  // if(!date) date = new Date();
  
  return `${date.getDate()}${getSuffix(date.getDate())} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export default getReadableDate;