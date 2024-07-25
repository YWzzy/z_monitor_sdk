import { ReportData, BreadcrumbData } from './base';
export interface InitOptions {
  dsn: string;
  appId: string;
  appSecret: string; // 项目密钥
  appSecretKey: string; // 生成项目密钥key
  userId?: string;
  disabled?: boolean;
  silentXhr?: boolean;
  silentFetch?: boolean;
  silentClick?: boolean;
  silentError?: boolean;
  silentUnhandledrejection?: boolean;
  silentHashchange?: boolean;
  silentHistory?: boolean;
  silentPerformance?: boolean;
  silentRecordScreen?: boolean;
  recordScreenTime?: number;
  recordScreenTypeList?: string[];
  reportErrorsOnly?: boolean; // 是否只上报错误 默认 true
  silentWhiteScreen?: boolean;
  skeletonProject?: boolean;
  whiteBoxElements?: string[];
  filterXhrUrlRegExp?: RegExp;
  useImgUpload?: boolean;
  throttleDelayTime?: number;
  overTime?: number;
  maxBreadcrumbs?: number;
  beforePushBreadcrumb?(data: BreadcrumbData): BreadcrumbData;
  beforeDataReport?(data: ReportData): Promise<ReportData | boolean>;
  getUserId?: () => string | number;
  getProjectConfig?: () => {
    projectEnv: string;
    projectVersion: string;
    projectIp: string;
    isSourceMap: boolean;
  };
  handleHttpStatus?: (data: any) => boolean;
  repeatCodeError?: boolean;
}
export interface RecordScreenOption {
  recordScreenTypeList: string[];
  recordScreenTime: number;
}
