/**
 * 原生try函数
 * ../param appId 应用id
 * ../param appSecret  应用密钥
 * ../param appSecretKey 生成应用密钥的key
 * @returns 是否验证通过
 */
export declare function validateAppIdAndSecret(
  appId: string,
  appSecret: string,
  appSecretKey: string
): boolean;
