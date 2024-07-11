import { options } from './options';
import { fromHttpStatus, interceptStr, getTimestamp, variableTypeDetection } from '@zmonitor/utils';
import { HTTP_CODE, STATUS_CODE } from '@zmonitor/common';
import { HttpData, ResouceError, ResourceTarget } from '@zmonitor/types';

function safeStringify(response: any): string {
  try {
    return JSON.stringify(response);
  } catch (e) {
    return '无法序列化的响应';
  }
}

// 解析url参数
export function parseUrlParams(url: string): { [key: string]: string } {
  // 定义一个对象来存储参数
  const params: { [key: string]: string } = {};

  // 检查传入的url是否为字符串
  if (variableTypeDetection.isString(url)) {
    // 获取查询字符串部分
    const queryString = url.split('?')[1];
    if (queryString) {
      // 分割查询字符串
      const pairs = queryString.split('&');
      pairs.forEach(pair => {
        // 分割键值对
        const [key, value] = pair.split('=');
        // 解码并存储在params对象中
        params[decodeURIComponent(key)] = decodeURIComponent(value || '');
      });
    }
  }

  return params;
}

// 处理接口的状态
export function httpTransform(data: HttpData): HttpData {
  let message: any = '';
  const { elapsedTime, time, method = '', type, Status = 200, response, requestData } = data;
  const params = parseUrlParams(data.url);
  let status: STATUS_CODE;
  if (Status === 0) {
    status = STATUS_CODE.ERROR;
    message =
      elapsedTime <= options.overTime * 1000
        ? `请求失败，Status值为:${Status}`
        : '请求失败，接口超时';
  } else if ((Status as number) < HTTP_CODE.BAD_REQUEST) {
    status = STATUS_CODE.OK;
    if (options.handleHttpStatus && typeof options.handleHttpStatus == 'function') {
      if (options.handleHttpStatus(data)) {
        status = STATUS_CODE.OK;
      } else {
        status = STATUS_CODE.ERROR;
        message = `接口报错，报错信息为：${
          response && typeof response == 'object' ? safeStringify(response) : String(response)
        }`;
      }
    }
  } else {
    status = STATUS_CODE.ERROR;
    message = `请求失败，Status值为:${Status}，${fromHttpStatus(Status as number)}`;
  }
  message = `${data.url}; ${message}`;
  return {
    url: data.url,
    time,
    status,
    elapsedTime,
    message,
    requestData: {
      httpType: type as string,
      headers: data && data.headers,
      method,
      data: requestData || '',
      params: params,
    },
    response: {
      Status,
      data: response,
      // data: status == STATUS_CODE.ERROR ? response : null,
    },
  };
}
export function resourceTransform(target: ResourceTarget): ResouceError {
  return {
    time: getTimestamp(),
    message:
      (interceptStr(target.src as string, 120) || interceptStr(target.href as string, 120)) +
      '; 资源加载失败',
    name: target.localName as string,
  };
}
