import { loading, useConfig, interceptor, useReqConfig } from './utils';
import type { Config, RequestOptions, DownloadParams, UploadParams, DownloadSuccessResultCallback, UploadAliossOptions, RequestTask, RequestSuccessCallbackResult, GeneralCallbackResult } from './types';
import UploadAlioss from './utils/alioss';
import createRequest from './runtime';

interface MultiOptions extends Config {};
interface MultiOptions extends RequestOptions {};

const makeRetryTimeout = (times: number, maximum_offretry: number): number => {
  const random_number_milliseconds = Math.floor(Math.random() * 1000);
  return Math.min(Math.pow(2, times) * 1000 + random_number_milliseconds, maximum_offretry);
}

const objToQueryString = (obj: object): string => {
  if (typeof obj === 'object' && obj !== null) {
    return Object.keys(obj)
      .map((key) => `${key}=${encodeURIComponent((obj as any)[key])}`)
      .join('&');
  }
  return obj;
}

export class Http {
  private currentRequestTask: RequestTask = {
    abort: () => { },
    onHeadersReceived: () => { },
    offHeadersReceived: () => { }
  };
  private requestTasksName = 'LWU-REQUEST-TASKS';
  private lock: boolean = true;
  private pending: Function[] = [];
  private retryCount: number = 3;
  private retryMaximum: number = 64;
  private retryTimeout: (number | undefined)[] = [];
  private retryDeadline: number = 10000;
  private retryTokenRefreshCount = 0;
  private maxTokenRefreshRetry = 1;
  private globalConfig: Config = {
    baseUrl: { pro: '', dev: '' },
    errorHandleByCode: (code: number, errMsg?: string, reject?: (reason?: any) => void) => { },
    apiErrorInterception: (data: any, args?: RequestSuccessCallbackResult, reject?: (reason?: any) => void) => { },
  };
  private reqConfig: RequestOptions = {};

  constructor(config: Config) {
    this.globalConfig = { ...useConfig(config) };
    this.reqConfig = { task_id: '', domain: '', ...this.globalConfig };

    if (!this.globalConfig.retry) {
      this.retryCount = 0;
    } else {
      if (this.globalConfig.retryCountAutoOffRetry) {
        this.retryMaximum = (this.globalConfig.retryMaximum as number) * 1000;
        this.retryTimeout = [];
        this.retryDeadline = config.retryDeadline as number;

        for (let i = 0; i < this.retryCount; i++) {
          if (this.retryDeadline < 0) break;
          const timeout = makeRetryTimeout(i, this.retryMaximum);
          this.retryDeadline -= timeout;
          this.retryTimeout.push(timeout);
        }
        this.retryCount = this.retryTimeout.length;
      }
    }
  }

  private handleError(code: number, message: string = ''): void {
    this.globalConfig.errorHandleByCode && this.globalConfig.errorHandleByCode(code, message);
  }

  private refreshToken() {
    if (this.globalConfig.refreshTokenHandle) {
      this.globalConfig.refreshTokenHandle()
        .then(() => {
          uni.getStorageSync('LWU-REQUEST-CALLBACK')((callback: () => void) => {
            callback();
          })
        })
        .catch(() => {
          this.handleError(this.globalConfig.tokenExpiredCode as number);
        });
    }
  }

  private async beforeRequest(data: any = {}, options?: MultiOptions, callback: any = null, url: string = '') {
    const requestTasks = uni.getStorageSync(this.requestTasksName);
    let taskId = options?.task_id ?? '';
    
    if (this.globalConfig.taskIdValue) {
      taskId = await this.globalConfig.taskIdValue(data, options) as string;
    }

    if (taskId && requestTasks[taskId]) {
      if (this.globalConfig.debug) {
        console.warn(`【LwuRequest Debug】请求ID${taskId}有重复项已自动过滤`);
      }
      requestTasks[taskId]?.abort();
    }

    return new Promise(async (resolve, reject) => {
      let token = uni.getStorageSync(this.globalConfig.tokenStorageKeyName as string);

      const setToken = () => {
        return new Promise(async (resolve, _) => {
          token && resolve(token);
          let refreshToken = '';
          
          if (this.globalConfig.tokenValue) {
            refreshToken = await this.globalConfig.tokenValue() as string;
          }

          if (callback && this.globalConfig.refreshTokenHandle) {
            this.globalConfig.refreshTokenHandle(refreshToken).then((newToken) => {
              newToken && resolve(newToken);
              resolve(false);
            });
          } else if (this.globalConfig.tokenValue) {
            this.globalConfig.tokenValue().then(res => {
              res && resolve(res);
              resolve(false);
            })
          } else {
            resolve(true);
          }
        });
      }

      setToken().then(getToken => {
        if (typeof getToken === 'string' && options && options.autoTakeToken) {
          if (this.globalConfig.takeTokenMethod === 'header') {
            options.header = options.header ?? {};
            (options.header as any)[this.globalConfig?.takenTokenKeyName as string] = getToken;
          }

          if (this.globalConfig.takeTokenMethod === 'body') {
            data[this.globalConfig.takenTokenKeyName as string] = getToken;
          }
        }
        resolve(true);
      });
    });
  }

  public request(url: string, data: any = {}, options: RequestOptions, callback: any = null) {
    let multiOptions = {
      autoTakeToken: options?.autoTakeToken || useReqConfig(options)?.autoTakeToken,
      ...this.reqConfig,
      ...options
    };

    return new Promise((resolve, reject) => {
      this.beforeRequest(data, {
        ...multiOptions,
        baseUrl: {
          dev: multiOptions.domain ?? this.globalConfig?.baseUrl.dev,
          pro: multiOptions.domain ?? this.globalConfig?.baseUrl.pro
        }
      }, callback, url).then(async () => {
        const chain = interceptor({
          request: (options: any) => {
            url = options.url;
            multiOptions = {
              ...this.reqConfig,
              ...options,
              header: {
                ...this.reqConfig.header,
                ...options?.header
              }
            }
            return options;
          },
          response: (response: any) => {
            return response;
          },
          fail: (err: any) => {
            reject(err);
            return err;
          }
        }, {
          url: url,
          ...multiOptions
        }, {
          ...this.globalConfig,
          baseUrl: {
            dev: multiOptions.domain || this.globalConfig.baseUrl.dev,
            pro: multiOptions.domain || this.globalConfig.baseUrl.pro
          }
        });

        const makeRequest = () => {
          this.currentRequestTask = createRequest({
            url: url,
            data: { ...data, ...(multiOptions as any).data || {} },
            header: { ...multiOptions.header },
            method: multiOptions.method as any,
            timeout: multiOptions.timeout,
            dataType: multiOptions.dataType as 'json' | '其他',
            responseType: multiOptions.responseType as 'text' | 'arraybuffer',
            sslVerify: multiOptions.sslVerify,
            withCredentials: multiOptions.withCredentials,
            firstIpv4: multiOptions.firstIpv4,
            success: (res: RequestSuccessCallbackResult) => {
              let tokenExpiredCode = res.statusCode;
              if (this.globalConfig?.tokenExpiredCodeType === 'apiResponseCode' && 
                  typeof this.globalConfig.tokenExpiredCode !== undefined && 
                  this.globalConfig.xhrCodeName) {
                tokenExpiredCode = (res.data as any)[this.globalConfig.xhrCodeName];
              }

              if (tokenExpiredCode === this.globalConfig.tokenExpiredCode) {
                if (this.retryTokenRefreshCount >= this.maxTokenRefreshRetry) {
                  reject('达到最大token刷新重试次数');
                  return;
                }
                this.retryTokenRefreshCount++;
                
                this.globalConfig.debug && console.warn(`【LwuRequest Debug】token失效，开始执行刷新token程序`);
                
                if (this.globalConfig.refreshTokenHandle) {
                  this.globalConfig.refreshTokenHandle().then((newToken) => {
                    this.globalConfig.debug && console.warn(`【LwuRequest Debug】新的token:${newToken}`);
                    
                    if (newToken && multiOptions.header) {
                      (multiOptions.header as any)[this.globalConfig?.takenTokenKeyName as string] = newToken;
                    }
                    
                    makeRequest();
                  }).catch(() => {
                    reject(res);
                  });
                  return;
                }
              }

              if (callback) {
                callback(res.data);
                return;
              }

              const processedResponse = this.globalConfig.after 
                ? chain.response(res, reject) 
                : (options.originalResponse ? res : res.data);
              
              resolve(processedResponse);
            },
            fail: (err: GeneralCallbackResult) => {
              chain.fail(err);
              this.retryCount = multiOptions.retryCount ?? 3;

              if (this.retryCount) {
                this.retryCount--;
                setTimeout(makeRequest, this.retryTimeout.shift());
                this.globalConfig.networkExceptionHandle && this.globalConfig.networkExceptionHandle();
              }
              reject(err);
            },
            complete: (res: UniApp.GeneralCallbackResult) => {
              chain.complete(res);
            }
          }, this.globalConfig.env);
        };

        makeRequest();

        let taskId = multiOptions?.task_id ?? '';
        if (this.globalConfig.taskIdValue) {
          taskId = await this.globalConfig.taskIdValue(data, options) as string;
        }

        if (taskId) {
          let tasks: RequestTask[] = [];
          tasks[taskId as any] = this.currentRequestTask;
          uni.setStorageSync(this.requestTasksName, tasks);
        }
      });
    });
  }

  public get(url: string, data: object = {}, options: RequestOptions = {}) {
    return this.request(url, data, {
      method: 'GET',
      ...options
    });
  }

  public post(url: string, data: object = {}, options: RequestOptions = {}) {
    return this.request(url, data, {
      method: 'POST',
      ...options
    });
  }

  public put(url: string, data: object = {}, options: RequestOptions = {}) {
    return this.request(url, data, {
      method: 'PUT',
      ...options
    });
  }

  public delete(url: string, data: object = {}, options: RequestOptions = {}) {
    return this.request(url, data, {
      method: 'DELETE',
      ...options
    });
  }

  /**
   * 设置请求配置信息，方便链式调用
   * @param options
   */
  public config(options: RequestOptions = {}) {
    this.reqConfig = {
      ...this.globalConfig,
      autoTakeToken: options.autoTakeToken || useReqConfig(options).autoTakeToken,
      ...options
    };

    return this;
  }

  /**
   * 获取请求域名
   */
  public uri(): string {
    let url = this.reqConfig.domain || this.globalConfig.baseUrl.pro;
    if (process.env.NODE_ENV === 'development') {
      url = this.reqConfig.domain || this.globalConfig.baseUrl.dev;
    }

    return url;
  }

  /**
   * 设置请求头信息，方便链式调用
   * @param header
   */
  public setHeader(header: object) {
    this.reqConfig.header = {
      ...header
    }

    return this;
  }

  /**
   * 中断请求，不传 `task_id` 时默认中断当前任务
   * @param task_id
   */
  public abort(task_id: string = '') {
    const requestTask = uni.getStorageSync(this.requestTasksName);

    if (requestTask[task_id]) {
      requestTask[task_id].abort();
    } else {
      this.currentRequestTask.abort();
    }
  }

  /**
   * 文件下载
   * @param params
   */
  public download(params: DownloadParams) {
    const multiOptions = {
      ...this.reqConfig,
      ...params,
      method: 'DOWNLOAD' as any
    };
    // 拦截器
    const chain = interceptor({
      request: (options: any) => {
        params.url = options.url;
        return options;
      },
      response: (response: any) => {
        return response;
      }
    }, {
      ...multiOptions
    }, this.globalConfig);
    const header = {
      contentType: '',
      ...multiOptions?.header
    };
    chain.request({
      header: header,
      method: 'DOWNLOAD',
      data: '',
      url: params.url,
      customData: {}
    });
    return uni.downloadFile({
      url: params.url,
      header: header,
      timeout: multiOptions.timeout ?? 60000,
      filePath: multiOptions.filePath,
      success: (res: DownloadSuccessResultCallback) => {
        chain.response({
          ...res,
          data: '',
          header: {},
          cookies: []
        });
        params.success && params.success(res);
      },
      fail: (fail: UniApp.GeneralCallbackResult) => {
        chain.fail(fail);
        params.fail && params.fail(fail);
      },
      complete: (res: UniApp.GeneralCallbackResult) => {
        chain.complete(res);
        params.complete && params.complete(res);
      }
    });
  }

  /**
   * 普通文件上传
   * @param params
   */
  public upload(params: UploadParams) {
    const multiOptions = {
      ...this.reqConfig,
      ...params,
      method: 'UPLOAD' as any
    };
    // 拦截器
    const chain = interceptor({
      request: (options: any) => {
        params.url = options.url;
        return options;
      },
      response: (response: any) => {
        return response;
      }
    }, {
      ...multiOptions
    }, this.globalConfig);
    const header = {
      contentType: '',
      ...multiOptions?.header
    };
    chain.request({
      header: header,
      method: 'UPLOAD',
      data: '',
      url: params.url,
      customData: {}
    });

    return uni.uploadFile({
      url: params.url,
      files: params.files,
      fileType: params.fileType,
      file: params.file,
      filePath: params.filePath,
      name: params.name,
      header: header,
      timeout: params.timeout,
      formData: params.formData,
      success: (res: UniApp.UploadFileSuccessCallbackResult) => {
        chain.response({
          ...res,
          data: '',
          header: {},
          cookies: []
        });
        params.success && params.success(res);
      },
      fail: (fail: UniApp.GeneralCallbackResult) => {
        chain.fail(fail);
        params.fail && params.fail(fail);
      },
      complete: (res: UniApp.GeneralCallbackResult) => {
        chain.complete(res);
        params.complete && params.complete(res);
      }
    });
  }

  /**
   * 阿里云OSS直传，同步上传
   * @param options
   */
  public async uploadAliossSync(options: UploadAliossOptions) {
    const aliyunOSSUploader = new UploadAlioss({
      filePath: options.filePath,
      uploadDir: options.uploadDir,
      maxSize: options.maxSize,
      uploadImageUrl: options.uploadImageUrl,
      getOSSBySTS: options.getOSSBySTS,
      getPolicyBase64: options.getPolicyBase64,
      getSignature: options.getSignature
    });

    await aliyunOSSUploader.getOSSBySTSInfo();

    return await aliyunOSSUploader.uploadFile(options.filePath, options.uploadDir);
  }

  /**
   * 阿里云OSS直传，异步上传
   * @param options
   */
  public uploadAlioss(options: UploadAliossOptions) {
    const aliyunOSSUploader = new UploadAlioss({
      filePath: options.filePath,
      uploadDir: options.uploadDir,
      maxSize: options.maxSize,
      uploadImageUrl: options.uploadImageUrl,
      getOSSBySTS: options.getOSSBySTS,
      getPolicyBase64: options.getPolicyBase64,
      getSignature: options.getSignature
    });

    aliyunOSSUploader.getOSSBySTSInfo().then(() => {
      return aliyunOSSUploader.uploadFile(options.filePath, options.uploadDir);
    });
  }
}

/**
 * 导出请求配置参数类型
 */
export * from './types';
