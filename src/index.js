/**
 * 每隔一段时间判断条件是否满足，条件满足时执行函数
 * @param {Function} callFunc 条件满足时执行的函数
 * @param {Function} condition 获取条件是否满足 默认为满足
 * @param {Number} interval 时间间隔 单位毫秒 默认为 100ms
 */
function delay (callFunc, condition = () => true, interval = 100) {
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

/**
 * 数组转树结构
 * @param {Array} items 普通数组
 * @param {Object} config 配置 { id, pId, pName}
 * @returns {Array}
 */
function arrayToTree (items, config = {}) {
  return _arrayToTree(items, config);
}
function _arrayToTree (items = [], { id = 'id', pId = 'parentId', pName = 'parentName' }) {
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
function treeToArray (treeData = [], isDeep) {
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

export default {
  version: '0.0.1',
  delay,
  arrayToTree,
  treeToArray
};
