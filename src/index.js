/**
 * 每隔一段时间判断条件是否满足，条件满足时执行函数
 * @param {Function} callFunc 条件满足时执行的函数
 * @param {Function} condition 获取条件是否满足 默认为满足
 * @param {Number} interval 时间间隔 单位毫秒 默认为 100ms
 */
export function delay (callFunc, condition = () => true, interval = 100) {
  let _delay = (callFunc, condition, interval) => {
    let TIMER = null;
    TIMER = setTimeout(() => {
      if (condition()) {
        clearTimeout(TIMER);
        callFunc();
      } else {
        _delay(callFunc, condition, interval);
      }
    }, interval);
  };
  if (condition()) { // 先判断是否满足条件
    callFunc();
  } else {
    _delay(callFunc, condition, interval);
  }
}

/***************************** 数据结构转换 *****************************/
/**
 * 数组转树结构
 * @param {Array} items 普通数组
 * @param {Object} config 配置 { id, pId }
 * @returns {Array}
 */
export function arrayToTree (items, config = {}) {
  const { id = 'id', pId = 'parentId' } = config
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
      lookup[itemId] = { children: [], ...item };
    }

    const TreeItem = {...item, ...lookup[itemId]};
    if (!parentId && parentId !== 0) { // 根节点
      rootItems.push(TreeItem);
    } else {
      if (!Object.prototype.hasOwnProperty.call(lookup, parentId)) {
        lookup[parentId] = { children: [] };
        lookup[parentId][id] = parentId;
      }
      lookup[parentId].children.push(TreeItem);
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

/***************************** 数据格式化 *****************************/
/**
 * 字符串反转
 * @param {String} data 要转换的数据
 */
export function reverse (data) {
  if (typeof data === 'string') {
    return data.split("").reverse().join("")
  }
  return data
}
/**
 * 连字符转驼峰
 * @param {String} data 要转换的数据
 */
export function hyphenToHump (data) {
  if (typeof data === 'string') {
    return data.replace(/-(\w)/g, (...args) => args[1].toUpperCase())
  }
  return data
}
/**
 * 驼峰转连字符
 * @param {String} data 要转换的数据
 */
export function humpToHyphen (data) {
  if (typeof data === 'string') {
    return data.replace(/([A-Z])/g, '-$1').toLowerCase()
  }
  return data
}

/**
 * 格式化时间 将 Date 转化为指定格式的String
 * @param {Date} date 要转换的数据
 * @param {String} fmt 指定格式 默认为 'yyyy-MM-dd hh:mm:ss.S'
 */
export function formatDate (date = new Date(), fmt = 'yyyy-MM-dd hh:mm:ss.S') {
  const that = date;
  var o = {
    "M+" : that.getMonth()+1,                 //月份
    "d+" : that.getDate(),                    //日
    "h+" : that.getHours(),                   //小时
    "m+" : that.getMinutes(),                 //分
    "s+" : that.getSeconds(),                 //秒
    "q+" : Math.floor((that.getMonth()+3)/3), //季度
    "S"  : that.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt)){
    fmt=fmt.replace(RegExp.$1, (that.getFullYear()+"").substr(4 - RegExp.$1.length));
  }
  for(var k in o){
    if(new RegExp("("+ k +")").test(fmt)){
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    }
  }
  return fmt;
}

export default {
  version: '0.0.1',
  delay,
  arrayToTree,
  treeToArray,
  formatDate,
  hyphenToHump,
  humpToHyphen
};
