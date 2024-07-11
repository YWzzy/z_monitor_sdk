import { options } from './options';
import { fromHttpStatus, interceptStr, getTimestamp, parseUrlParams } from '@zmonitor/utils';
import { HTTP_CODE, STATUS_CODE } from '@zmonitor/common';
import { HttpData, ResouceError, ResourceTarget } from '@zmonitor/types';

function safeStringify(response: any): string {
  try {
    return JSON.stringify(response);
  } catch (e) {
    return '无法序列化的响应';
  }
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
      data: status == STATUS_CODE.ERROR ? response : null,
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
