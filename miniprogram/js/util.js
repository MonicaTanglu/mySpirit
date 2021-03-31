// 格式化时间
const formatTime = (date, splitString = '/') => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return (
    [year, month, day].map(formatDay).join(splitString) +
    ' ' + [hour, minute, second].map(formatDay).join(':')
  );
};

const trim = (v) => {
  v = v.toString()
  return v.replace(/\s+/g, '')
}
// 格式化数字
const formatDay = (n) => {
  n = n.toString();
  return n[1] ? n : '0' + n;
};

// 分割日期
const splitDate = (date, splitString = '-') => {
  let arr = date.split(splitString);
  let year = Number(arr[0]),
    month = Number(arr[1]),
    day = Number(arr[2]);
  return {
    year,
    month,
    day,
  };
};


const REGEXP = /^1\d{10}$/;

// 判断是否为手机号码
const isMobilePhoneNumber = (number) => {
  return REGEXP.test(number);
};
const isIdCard = (value) => {
  return /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value)
}


module.exports = {
  formatTime,
  splitDate,
  formatDay,
  isMobilePhoneNumber,
  isIdCard,
  trim
};