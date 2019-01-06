import moment from 'moment';

let util = {};

util.inOf = function (arr, targetArr) {
  let res = true;
  arr.forEach(item => {
    if (targetArr.indexOf(item) < 0) {
      res = false;
    }
  });
  return res;
};

util.oneOf = function (ele, targetArr) {
  if (targetArr.indexOf(ele) >= 0) {
    return true;
  } else {
    return false;
  }
};

util.handleTitle = function (vm, item) {
  if (typeof item.title === 'object') {
    return vm.$t(item.title.i18n);
  } else {
    return item.title;
  }
};

util.getMinTime = function (date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

util.getMaxTime = function (date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
}

util.getTimeString = function(date, format = 'YYYY-MM-DD HHmm') {
  if(date == '') {
    return ''
  }
  return moment(date).format(format);
}

util.formatDuration = function(durationMs) {
  if (parseInt(durationMs, 10) >= 1000) {
    return `${parseInt(durationMs, 10) / 1000} s`;
  }
  return `${durationMs} ms`;
}

export default util;
