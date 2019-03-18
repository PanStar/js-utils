# js-utils

This is a Js Functions Library

## Install(npm)

`npm install js-utils-lib`

## How to use

## delay

`delay(callFunc: Function, condition?: Function, interval?: number): void`
>每隔一段时间判断条件是否满足，条件满足时执行函数

### API

参数 | 说明 | 类型 | 默认值
---|---|---|---
callFunc | 条件满足时执行的函数 | Function | 0
condition | 获取条件是否满足 | Function | 默认为满足
interval | 时间间隔，单位 毫秒 | Number | 100

### Demo

```js
import { delay } from 'js-utils-lib'
let bool = false
let f = () => console.log('do somethings')
let c = () => (console.log(bool), bool)
setTimeout(() => bool = true, 2000)
delay(f, c)
```

## getAllParentsByKey

`function getAllParentsByKey(value: any, treeData?: any[], key: string, data?: any[], bFind?: boolean): any[] | {bFind: boolean, data: any[]}`
>根据指定key找出所有父节点

### API

参数 | 说明 | 类型 | 默认值
---|---|---|---
value | 要查找的值 | Number | -
key | 要指定的key | Function | 'id'
treeData | 树数据 | Array | []
data | 父节点数据 | Array | []
bFind | 是否已找到 | Boolean | false

### Demo

```js
import { getAllParentsByKey } from 'js-utils-lib'
let treeData = [
  {
    id: '1',
    children: [
      {
        id: '1-1',
        children: [
          {
            id: '1-1-1',
          }
        ]
      }
    ]
  },
  {
    id: '2',
    children: [
      {
        id: '2-1'
      },
      {
        id: '2-2',
        children: [
          {
            id: '2-2-1',
          }
        ]
      }
    ]
  }
];
getAllParentsByKey('1-1-1', treeData)
```

## treeToArray

`treeToArray(treeData: any[], isDeep: boolean): any[]`
>树结构转数组

### API

参数 | 说明 | 类型 | 默认值
---|---|---|---
treeData | 树结构数组 | Date | []
isDeep | 是否深拷贝 | Boolean | false

## formatDate

`formatDate(date?: Date, fmt?: string): string`
>格式化时间 将 Date 转化为指定格式的String

### API

参数 | 说明 | 类型 | 默认值
---|---|---|---
date | 要转换的数据 | Date | new Date()
fmt | 指定格式 | String | 默认为'yyyy-MM-dd hh:mm:ss.S'
### Demo

```js
  import { formatDate } from 'js-utils-lib'
  console.log(formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss.S'))
```

## formatStringEllipsis

`formatStringEllipsis(data: string, head: number, tail: number, maxLength: number): string`
>将较长的字符串 中间部分用...代替

### API

参数 | 说明 | 类型 | 默认值
---|---|---|---
data | 要格式化的字符串 | String | -
head | 头部长度 | Number | 3
tail | 尾部长度 | Number | 3
maxLength | 超过 maxLength 时才格式化，不传则不筛选 | Number | -

### Demo

```js
  import { formatStringEllipsis } from 'js-utils-lib'
  console.log(formatStringEllipsis('12345678901234567890'))
```
