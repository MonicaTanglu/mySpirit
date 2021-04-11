// 格式化时间
const formatTime = (format = 'yyyyMMddhhmmss', timeStr) => {
  var date = getDate(timeStr);
  var formateArr = ['y', 'M', 'd', 'h', 'm', 's'];
  var returnArr = [];
  // var time = time.replace(getRegExp('-', 'g'), '/');

  returnArr.push(date.getFullYear());
  returnArr.push(date.getMonth() + 1);
  returnArr.push(date.getDate());

  returnArr.push(date.getHours());
  returnArr.push(date.getMinutes());
  returnArr.push(date.getSeconds());

  for (i = 0, l = returnArr.length; i < l; i++) {
    format = format.replace(getRegExp(formateArr[i] + '+'), returnArr[i]);
  }
  return format;
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
const getRandomTime = () => {
  const date = new Date()
  const str = date.getFullYear() + '' + date.getMonth() + '' + date.getDay() + (Math.random() * 10000).toFixed(0)
  return str
}


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
  getRandomTime,
  splitDate,
  formatDay,
  isMobilePhoneNumber,
  isIdCard,
  trim
};