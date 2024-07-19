import { STATUS_CODE } from '@zmonitor/common';
import { _global, _support } from '@zmonitor/utils';
import { Callback, InitOptions } from '@zmonitor/types';

/**
 * 检测页面是否白屏
 * @param {function} callback - 回调函数获取检测结果
 * @param {boolean} skeletonProject - 页面是否有骨架屏
 * @param {array} whiteBoxElements - 容器列表，默认值为['html', 'body', '#app', '#root']
 */
export function openWhiteScreen(
  callback: Callback,
  { skeletonProject, whiteBoxElements = ['html', 'body', '#app', '#root'] }: InitOptions
) {
  let _whiteLoopNum = 0;
  const _skeletonInitList: string[] = []; // 存储初次采样点
  let _skeletonNowList: string[] = []; // 存储当前采样点

  // 项目有骨架屏
  if (skeletonProject) {
    if (document.readyState != 'complete') {
      idleCallback();
    }
  } else {
    // 页面加载完毕
    if (document.readyState === 'complete') {
      idleCallback();
    } else {
      _global.addEventListener('load', idleCallback);
    }
  }

  function getSelector(element: HTMLElement): string {
    if (element.id) {
      return '#' + element.id;
    } else if (element.className) {
      return '.' + element.className.split(' ').filter(Boolean).join('.');
    } else {
      return element.nodeName.toLowerCase();
    }
  }

  function isContainer(element: HTMLElement): boolean {
    const selector = getSelector(element);
    if (skeletonProject) {
      if (_whiteLoopNum) {
        _skeletonNowList.push(selector);
      } else {
        _skeletonInitList.push(selector);
      }
    }
    return whiteBoxElements.indexOf(selector) !== -1;
  }

  function sampling(): void {
    let emptyPoints = 0;
    for (let i = 1; i <= 9; i++) {
      const xElements = document.elementsFromPoint(
        (_global.innerWidth * i) / 10,
        _global.innerHeight / 2
      );
      const yElements = document.elementsFromPoint(
        _global.innerWidth / 2,
        (_global.innerHeight * i) / 10
      );
      if (xElements[0] && isContainer(xElements[0] as HTMLElement)) emptyPoints++;
      if (i !== 5 && yElements[0] && isContainer(yElements[0] as HTMLElement)) emptyPoints++;
    }

    // 页面正常渲染，停止轮询
    if (emptyPoints !== 17) {
      if (skeletonProject) {
        if (!_whiteLoopNum) {
          return openWhiteLoop();
        }
        if (_skeletonNowList.join() === _skeletonInitList.join()) {
          return callback({
            status: STATUS_CODE.ERROR,
          });
        }
      }
      if (_support._loopTimer) {
        clearInterval(_support._loopTimer);
        _support._loopTimer = null;
      }
    } else {
      // 开启轮询
      if (!_support._loopTimer) {
        openWhiteLoop();
      }
    }
    // 17个点都是容器节点算作白屏
    callback({
      status: emptyPoints === 17 ? STATUS_CODE.ERROR : STATUS_CODE.OK,
    });
  }

  function openWhiteLoop(): void {
    if (_support._loopTimer) return;
    _support._loopTimer = setInterval(() => {
      if (skeletonProject) {
        _whiteLoopNum++;
        _skeletonNowList = [];
      }
      idleCallback();
    }, 1000);
  }

  function idleCallback(): void {
    if ('requestIdleCallback' in _global) {
      requestIdleCallback((deadline: any) => {
        if (deadline.timeRemaining() > 0) {
          sampling();
        }
      });
    } else {
      sampling();
    }
  }
}
