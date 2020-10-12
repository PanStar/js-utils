/**
 * 每隔一段时间判断条件是否满足，条件满足时执行函数
 * @param {Function} callFunc 条件满足时执行的函数
 * @param {Function} condition 获取条件是否满足 默认为满足
 * @param {Number} interval 时间间隔 单位毫秒 默认为 100ms
 * @param {Number} timeout 超时时间 单位毫秒 默认为 100000ms
 */
export function delay (callFunc, condition = () => true, interval = 100, timeout = 100000) {
  timeout -= interval;
  let _delay = (callFunc, condition, interval) => {
    let TIMER = null;
    TIMER = setTimeout(() => {
      if (condition()) {
        clearTimeout(TIMER);
        callFunc();
      } else if (timeout < 0) {
        console.error('执行超时', condition, callFunc);
      } else {
        _delay(callFunc, condition, interval, timeout);
      }
    }, interval);
  };
  if (condition()) { // 先判断是否满足条件
    callFunc();
  } else {
    _delay(callFunc, condition, interval, timeout);
  }
}

/**
 * 根据指定key找出所有父节点
 * @param {*} value 要查找的值
 * @param {Array} treeData 树数据
 * @param {String} key 要指定的key 默认为 id
 * @param {Array} data 父节点数据
 * @param {Boolean} bFind 是否已找到
 */
export function getAllParentsByKey (value, treeData = [], key = 'id', data = [], bFind = false) {
  if (bFind) return data;
  let result = { bFind, data };

  try {
    treeData.forEach(i => {
      /* eslint-disable */
      if (result.bFind) throw 'Find it!'; // 退出循环
      /* eslint-enable */
      if (i[key] === value) {
        result.bFind = true;
      } else if (i.children && i.children.length > 0) {
        result = getAllParentsByKey(value, i.children, key, data);
        if (result.bFind) {
          result.data.push(i);
        }
      }
    });
  } catch (e) {
    //
  }
  return result;
}

/**
 * 连接数组(多参数)
 * @param  {...any} arr 要连接的数组
 * @returns {Array}
 */
export function arrayConcat (...arr) {
  return arr.reduce((a, i) => { Array.prototype.push.apply(a, Array.prototype.concat(i)); return a; }, []);
}
/**
 * 深拷贝
 * @param {Object} o 要深拷贝的对象
 */
export function deepCopy (o) {
  if (o instanceof Array) {
    let n = [];
    for (let i = 0; i < o.length; ++i) {
      n[i] = deepCopy(o[i]);
    }
    return n;
  } else if (o instanceof Function) {
    let n = new Function('return ' + o.toString())();
    return n;
  } else if (o instanceof Object) {
    let n = {};
    for (let i in o) {
      n[i] = deepCopy(o[i]);
    }
    return n;
  } else {
    return o;
  }
}
/** *************************** 数据结构转换 *****************************/
/**
 * 数组转Map
 * @param {Array} arr 要转换的数组
 * @param {String} key Map的key
 * @returns {Object}
 */
export function arrayToMap (arr = [], key) {
  let map = {};
  arr.forEach(i => { map[i[key] || i] = i; });
  return map;
}
/**
 * Map转数组
 * @param {Object} map
 */
export function mapToArray (map = {}) {
  let arr = [];
  for (let key in map) {
    arr.push(map[key]);
  }
  return arr;
}
/**
 * 数组转树结构
 * @param {Array} items 普通数组
 * @param {Object} config 配置 { id, pId }
 * @returns {Array}
 */
export function arrayToTree (items, config = {}) {
  const { id = 'id', pId = 'parentId', children = 'children' } = config;
  if (items.length === 1) { // 只有一个数据时直接返回
    return items;
  }
  const rootItems = [];
  const childrenItems = {};
  const lookup = {};
  for (const item of items) {
    const itemId = item[id];
    const parentId = item[pId];

    if (!Object.prototype.hasOwnProperty.call(lookup, itemId)) {
      lookup[itemId] = { [children]: [], ...item };
    }

    const TreeItem = {...item, ...lookup[itemId]};
    if (!parentId && parentId !== 0) { // 根节点
      rootItems.push(TreeItem);
    } else {
      if (!Object.prototype.hasOwnProperty.call(lookup, parentId)) {
        lookup[parentId] = { [children]: [] };
        lookup[parentId][id] = parentId;
      }
      lookup[parentId][children].push(TreeItem);
      childrenItems[itemId] = TreeItem;
    }
  }
  if (rootItems.length === 0) { // 没有统一根节点
    for (const key in lookup) {
      if (!Object.prototype.hasOwnProperty.call(childrenItems, key)) {
        rootItems.push(lookup[key]);
      }
    }
  }
  return rootItems;
}

/**
 * 树结构转数组
 * @param {Array} treeData 树结构数组
 * @param {Boolean} isDeep 是否深拷贝
 * @returns {Array}
 */
export function treeToArray (treeData = [], isDeep) {
  let ls = isDeep ? JSON.parse(JSON.stringify(treeData)) : treeData;
  let items = [];
  ls.forEach(item => {
    if (item.children) {
      items.push(...treeToArray(item.children));
    }
    items.push(item);
  });
  return items;
}

/** *************************** 数据格式化 *****************************/

/**
 * 将值转换成布尔值
 * @param {Boolean} bool 要转换的值
 */
export const toBoolean = bool => bool + '' === 'true';

/**
 * 字符串反转
 * @param {String} data 要转换的数据
 */
export function reverse (data) {
  if (typeof data === 'string') {
    return data.split('').reverse().join('');
  }
  return data;
}
/**
 * 将较长的字符串 中间部分用...代替
 * @param {String} data 要格式化的字符串
 * @param {Number} head 头部长度
 * @param {Number} tail 尾部长度
 * @param {Boolean} calcChina 是否计算中文
 * @param {Number} maxLength 超过 maxLength 时才格式化，不传则不筛选
 */
export function formatStringEllipsis (data = '', head = 3, tail = 3, calcChina = false, maxLength) {
  if (calcChina) {
    head = getLengthForChina(data, head);
    tail = getLengthForChina(data, tail, true);
  }
  if (typeof data === 'string') {
    const reg = new RegExp(`^(.{${head}})(.*)(.{${tail}})$`);
    if (maxLength !== void 0 && data.length <= maxLength) {
      return data;
    }
    return data.replace(reg, '$1...$3');
  }
  return data;
}
/**
 * 转换字符长度 按两个非英文或数字占一个字符长度
 * @param {String} data 要格式化的字符串
 * @param {Number} length 要计算的长度
 * @param {Boolean} bTail 是否从尾部开始
 */
export function getLengthForChina (data = '', length = 0, bTail) {
  let char = bTail ? data.substr(-length * 2).split('').reverse() : data.substr(0, length * 2).split('');
  let len = 0;
  let max = length * 4;
  return char.map(i => i.charCodeAt().toString(16)).filter(i => {
    len += i.length;
    return len <= max;
  }).length;
}
/**
 * 连字符转驼峰
 * @param {String} data 要转换的数据
 */
export function hyphenToHump (data) {
  if (typeof data === 'string') {
    return data.replace(/-(\w)/g, (...args) => args[1].toUpperCase());
  }
  return data;
}
/**
 * 驼峰转连字符
 * @param {String} data 要转换的数据
 */
export function humpToHyphen (data) {
  if (typeof data === 'string') {
    return data.replace(/([A-Z])/g, '-$1').toLowerCase();
  }
  return data;
}

/**
 * 格式化时间 将 Date 转化为指定格式的String
 * @param {Date} date 要转换的数据
 * @param {String} fmt 指定格式 默认为 'yyyy-MM-dd hh:mm:ss.S'
 */
export function formatDate (date = new Date(), fmt = 'yyyy-MM-dd hh:mm:ss.S') {
  const that = date;
  var o = {
    'M+': that.getMonth() + 1, // 月份
    'd+': that.getDate(), // 日
    'h+': that.getHours(), // 小时
    'm+': that.getMinutes(), // 分
    's+': that.getSeconds(), // 秒
    'q+': Math.floor((that.getMonth() + 3) / 3), // 季度
    'S': that.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (that.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }
  return fmt;
}

export default {
  version: '0.0.6',
  delay,
  getAllParentsByKey,

  arrayToMap,
  mapToArray,
  arrayToTree,
  treeToArray,

  formatDate,
  formatStringEllipsis,
  hyphenToHump,
  humpToHyphen
};
