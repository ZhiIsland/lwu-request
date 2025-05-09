---
outline: deep
---

# 请求配置
这里是单次请求时的配置内容。

## task_id
+ **类型**: `string`
+ **默认值**: ` `
+ **是否必填**: 否
+ **描述**: 请求ID，做终止本次请求和过滤重复请求时需要。

## before
+ **类型**: `Function`
+ **默认值**: ` `
+ **是否必填**: 否
+ **描述**: 自定义请求前拦截。
  + `reject` 参数可以自定义抛出异常，需要 `v1.8.2` 及以上版本支持
  + `1.8.4` 及以上版本支持修改 `data` 参数，可以修改请求参数，返回新的参数，可以用于参数加密等场景。

## after
+ **类型**: `Function`
+ **默认值**: ` `
+ **是否必填**: 否
+ **描述**: 自定义请求后拦截。
  + `reject` 参数可以自定义抛出异常，需要 `v1.8.2` 及以上版本支持

## header
+ **类型**: `object`
+ **默认值**: `{}`
+ **是否必填**: 否
+ **描述**: 自定义请求header。

## method
+ **类型**: `'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'CONNECT' | 'HEAD' | 'OPTIONS' | 'TRACE'`
+ **默认值**: `'GET'`
+ **是否必填**: 否
+ **描述**: 请求方式

## timeout
+ **类型**：`number`
+ **默认值**: `6000`
+ **是否必填**: 否
+ **描述**：请求超时时间

## dataType
+ **类型**: `string`
+ **默认值**: `'json'`
+ **是否必填**: 否
+ **描述**: 如果设为 json，会对返回的数据进行一次 JSON.parse，非 json 不会进行 JSON.parse

## responseType
+ **类型**: `string`
+ **默认值**: `text`
+ **是否必填**: 否
+ **描述**: 设置响应的数据类型。合法值：`text`、`arraybuffer`

## sslVerify
+ **类型**: `boolean`
+ **默认值**: `true`
+ **是否必填**: 否
+ **描述**: 验证 ssl 证书

## withCredentials
+ **类型**: `boolean`
+ **默认值**: `false`
+ **是否必填**: 否
+ **描述**: 跨域请求时是否携带凭证（cookies）

## firstIpv4
+ **类型**: `boolean`
+ **默认值**: `false`
+ **是否必填**: 否
+ **描述**: DNS解析时优先使用ipv4

## retryCount
+ **类型**: `number`
+ **默认值**: `3`
+ **是否必填**: 否
+ **描述**: 请求失败自动重试次数

## loading
+ **类型**：`boolean`
+ **默认值**: `true`
+ **是否必填**: 否
+ **描述**：请求过程是否显示loading
    + `1.3.0` 及以上版本支持

## loadingText
+ **类型**：`string`
+ **默认值**: `请求中...`
+ **是否必填**: 否
+ **描述**：请求中loading弹窗的提示文本
    + `1.3.0` 及以上版本支持

## domain
+ **类型**：`string`
+ **默认值**：` `
+ **是否必填**：否
+ **描述**：自定义请求域名，用于设置单次请求的域名地址，常用于上传下载场景。
    + `1.4.10` 及以上版本支持

## autoTakeToken
+ **类型**：`boolean`
+ **默认值**：`true`
+ **是否必填**：否
+ **描述**：是否自动携带 `token`，可用于设置单个请求不自动携带token场景。
    + `1.6.3` 及以上版本支持
    + 由于 `config` API链式调用会覆盖全局的请求配置，所以建议通过[参数设置方式](/config/request#参数设置方式)设置；如果是通过[API设置方式](/config/request#API设置方式)设置的参数，需要手动重新设置为初始设置内容，不然该请求单独设置的配置项将会影响后面所有的请求配置项。

## originalResponse
+ **类型**：`boolean`
+ **默认值**：`false`
+ **是否必填**：否
+ **描述**：是否返回请求原始响应内容，默认为 `false`
    + 为 `true` 时，返回的响应内容为平台请求API返回的原始响应内容，包含响应头、响应状态码等信息。 
    + `1.8.0` 及以上版本支持。
    + `1.8.5` 及以上版本支持对 `after` 拦截器的支持，如果开启了 `originalResponse` 选项，则 `after` 拦截器的 `res` 参数将会返回原始响应内容。
    + 使用示例
    ```ts{2}
    http.post('/v1/save', {}, {
        originalResponse: true
    }).then(res => {
        console.log(res)
    })
    ```

## customData
+ **类型**：`any`
+ **默认值**：`{}`
+ **是否必填**：否
+ **描述**：发起请求时的自定义参数，一般会在拦截器中使用。
  + `v1.8.3` 及以上版本支持。

## 使用示例
**请求配置支持 `参数设置` 和 `API设置` 两种方式供开发者选择使用，具体参考下面示例。**
::: danger 注意事项
+ 示例中的请求配置为全部配置内容演示，具体使用时需要根据自己的实际情况选择使用。
+ `API设置方式` 仅 `1.3.0` 及以上版本支持。
:::
+ #### 参数设置方式
```ts
request.request('/user/save', {
	user_id: 1
}, {
    task_id: 'user-info-111',
    before: () => {},
    after: () => {},
    header: {},
    method: 'POST',
    timeout: 3000,
    dataType: 'text',
    responseType: 'json',
    sslVerify: false,
    withCredentials: false,
    firstIpv4: false,
    retryCount: 3,
    loading: true,
    loadingText: '加载中...',
    domain: '',
    autoTakeToken: true
})
	.then((res) => {
		// 此处可自定义业务逻辑
	})
	.catch((err) => {
		// 此处仅为演示
		console.error('请求服务异常');
	});
```

+ #### API设置方式
::: danger 注意事项
+ API设置方式原理是在请求类里面增加了全局的请求参数变量，所以通过API设置方式设置的参数都会影响所有的请求配置项，需要手动重新设置为默认参数。
:::

```ts
request
    .config({
        task_id: 'user-info-111',
        before: () => {},
        after: () => {},
        header: {},
        method: 'POST',
        timeout: 3000,
        dataType: 'text',
        responseType: 'json',
        sslVerify: false,
        withCredentials: false,
        firstIpv4: false,
        retryCount: 3,
        loading: true,
        loadingText: '加载中...',
        domain: '',
        autoTakeToken: true
    })
    .post('/user/save', {
	    user_id: 1
    })
	.then((res) => {
		// 此处可自定义业务逻辑
	})
	.catch((err) => {
		// 此处仅为演示
		console.error('请求服务异常');
	});
```
