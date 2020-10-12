const regNumAndEn = /([^a-zA-Z0-9])/im; // 纯数字和字母
const regSpecialEn = /[`~!@#$%^&*()_+<>?:"{},./;'[\]]/im; // 英文特殊字符
const regSpecialCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im; // 中文特殊字符
const regEmail = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/; // 电子邮箱
const regPhone = /^((13)|(14)|(15)|(17)|(18))\\d{9}$/; // 电话号码
const regHttp = /^((http|https):\/\/)/; // 网址
const regCarNumber = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/; // 车牌号码

/**
 * 判断是否是整数
 * @param {Number} num 要判断的值
 * @returns {Boolean}
 */
export function isNumber (num) {
  return isNaN(num) ? true : Number(num) === parseInt(num);
}

/**
 * 判断是否为null 包括 null undefined 'null' 'undefined' 'NULL' 'UNDEFINED'
 * @param {*} value 要判断的值
 * @returns {Boolean}
 */
export function isNull (value) {
  return !!('' + value).trim().match(/^(null)$|^(undefined)$/i);
}

/**
 * 判断是否为空 包括 null undefined 'null' 'undefined' 'NULL' 'UNDEFINED' '' {} '{}' [] '[]'
 * @param {*} value 要判断的值
 * @returns {Boolean}
 */
export const isEmpty = (value) => {
  if (isNull(value)) {
    return true;
  } else if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  } else {
    value = ('' + value).trim();
    return value === '' || value === '{}' || value === '[]';
  }
};

// 判断是否只包含数字或者字母
export const onlyNumAndEn = value => regNumAndEn.test(value) ? '只能包含数字或者字母' : '';
// 判断是否包含特殊字符
export const noSpecial = value => (regSpecialEn.test(value) || regSpecialCn.test(value)) ? '不能包含特殊字符' : '';
// 校验电子邮箱
export const email = value => !regEmail.test(value) ? '请输入有效的邮箱' : '';
// 校验手机号码
export const phone = value => !regPhone.test(value) ? '请输入正确的手机号' : '';
// 校验网址
export const http = value => !regHttp.test(value) ? '请输入有效网址' : '';
// 校验车牌号码
export const carNumber = value => !regHttp.test(value) ? '请输入正确的车牌号码' : '';
/**
 * 验证长度
 * @param {Number} min 最小长度 -1时不做限制
 * @param {Number} max 最大长度 -1时不做限制
 * @param {Number} text 数据名称
 * @param {Boolean} checkChinese 是否检查汉字长度
 */
export const length = (min, max, text = '', checkChinese = false) => value => {
  let length = isEmpty(value) ? 0 : value.length;
  let str = '';
  if (checkChinese && length > 0) {
    str = value.replace(/[^\u4e00-\u9fa5]/g, ''); // 筛选出汉字
    length += str.length * 2; // utf-8中 一个汉字占3个字节
    str = '(注：一个汉字占3个字节)';
  }
  if (min === max && length !== min) {
    return `${text}长度应为${min} ${str}`;
  } else if (length < min && min !== -1) {
    return `${text}最小长度不能小于${min} ${str}`;
  } else if (length > max && max !== -1) {
    return `${text}最大长度不能超过${max} ${str}`;
  }
  return '';
};

// 规则校验
export const validateRule = validate => (rule, value, callback) => {
  let result = validate(value);
  if (result) {
    return callback(new Error(result));
  }
  return callback();
};
// 不包含特殊符号
export const validateNoSpecial = validateRule(noSpecial);
// 只能包含数字或者字母
export const validateOnlyNumAndEn = validateRule(onlyNumAndEn);
// 验证长度
export const validateLength = (min, max, text, checkChinese) => validateRule(length(min, max, text, checkChinese));
// ...

export const IdCodeValid = (rule, value, callback) => {
  // 身份证号合法性验证
  // 支持15位和18位身份证号
  // 支持地址编码、出生日期、校验位验证
  var city = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江 ',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北 ',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏 ',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外 '
  };
  if (isEmpty(value)) { // 空数据不做判断
    return callback();
  }
  if (!/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/.test(value)) {
    return callback(new Error('请输入正确的证件号码'));
  } else if (!city[value.substr(0, 2)]) {
    return callback(new Error('请输入正确的证件号码'));
  } else {
    // 18位身份证需要验证最后一位校验位
    if (value.length == 18) {
      value = value.split('');
      // ∑(ai×Wi)(mod 11)
      // 加权因子
      var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      // 校验位
      var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
      var sum = 0;
      var ai = 0;
      var wi = 0;
      for (var i = 0; i < 17; i++) {
        ai = value[i];
        wi = factor[i];
        sum += ai * wi;
      }
      if (parity[sum % 11] != value[17].toUpperCase()) {
        return callback(new Error('请输入正确的证件号码'));
      }
    }
  }
  return callback();
};
export const isChina = (rule, value, callback) => {
  var myreg = new RegExp('^[\u4e00-\u9fa5]+$');
  if (!myreg.test(value)) {
    return callback(new Error('请输入中文'));
  }
  return callback();
};
export const noChina = (rule, value, callback) => {
  var myreg = new RegExp('[\u4e00-\u9fa5]');
  if (myreg.test(value)) {
    return callback(new Error('不能输入中文'));
  }
  return callback();
};
