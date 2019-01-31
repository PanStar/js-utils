# js-utils
This is a Js Functions Library

# Install(npm)
`npm install js-utils-lib`

# How to use
## delay
>每隔一段时间判断条件是否满足，条件满足时执行函数

### API
参数 | 说明 | 类型 | 默认值
---|---|---|---
callFunc | 条件满足时执行的函数 | Function | 0
condition | 获取条件是否满足 | Function | 默认为满足
interval | 时间间隔，单位 毫秒 | Number | 100
### Demo
```
import { delay } from 'js-utils-lib'
let bool = false
let f = () => console.log('do somethings')
let c = () => (console.log(bool), bool)
setTimeout(() => bool = true, 2000)
delay(f, c)
```

## formatDate
>格式化时间 将 Date 转化为指定格式的String

### API
参数 | 说明 | 类型 | 默认值
---|---|---|---
date | 要转换的数据 | Date | new Date()
fmt | 指定格式 | String | 默认为'yyyy-MM-dd hh:mm:ss.S'
### Demo
```
  import { formatDate } from 'js-utils-lib'
  console.log(formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss.S'))
```
