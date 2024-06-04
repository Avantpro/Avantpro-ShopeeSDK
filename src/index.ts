import * as crypto from 'node:crypto';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ShopeeSDKAuth } from './auth';
import { ShopeeSDKProduct } from './product';
import { Logger,ConsoleLoggerOptions, LogLevel } from './logger/index'
import { ShopeeSDKShop } from './shop';
import { ShopeeSDKLogistics } from './logistics';

type localType = 'default' | 'china' | 'brasil'

interface ShopeeSDKConstructor {
  partnerId: string;
  partnerKey: string;
  local?: localType;
  sandbox?: boolean;
  verbose?: boolean;
}

export class ShopeeSDK {
  //base Config Shopee 
  partnerId: number
  partnerKey: string
  host: string
  sandbox: boolean

  logger: Logger
  logLevels: LogLevel[]

  //SubClass Methods
  auth: ShopeeSDKAuth
  product: ShopeeSDKProduct
  shop: ShopeeSDKShop
  logistics: ShopeeSDKLogistics

  constructor(
    {
      partnerId,
      partnerKey,
      local = 'default',
      sandbox = false,
      verbose = false
    }: ShopeeSDKConstructor
  ) {

    let loggerConfig:ConsoleLoggerOptions = {}
    if (verbose){
      this.logLevels = [
        'log',
        'error',
        'warn',
        'debug',
        'verbose',
        'fatal',
      ]

      loggerConfig.logLevels = this.logLevels
    } else {
      this.logLevels = [
        'log',
        'error',
        'warn',
        'debug',
        'fatal',
      ]
    }

    this.logger = new Logger('MainSDK',loggerConfig)
    this.logger.verbose('Verbose: ACTIVE')

    //base Config Shopee
    this.partnerId = Number(partnerId);
    this.logger.verbose(`PartnerId: ${partnerId}`)
    this.partnerKey = partnerKey;
    this.logger.verbose(`Sandbox: ${sandbox ? 'True': 'False'}`)
    this.sandbox = sandbox
    this.logger.verbose(`Local: ${local}`)
    this.host = this.getURL(sandbox, local)
    this.logger.verbose(`Host: ${this.host}`)

    //SubClass Methods
    this.auth = new ShopeeSDKAuth(this)
    this.product = new ShopeeSDKProduct(this)
    this.shop = new ShopeeSDKShop(this)
    this.logistics = new ShopeeSDKLogistics(this)
  }

  private getURL(sandbox: boolean, local: localType): string {
    if (sandbox) {
      if (local === 'china') {
        return 'https://openplatform.test-stable.shopee.cn';
      } else {
        return 'https://partner.test-stable.shopeemobile.com';
      }
    } else {
      if (local === 'china') {
        return 'https://openplatform.shopee.cn';
      } else if (local === 'brasil') {
        return 'https://openplatform.shopee.com.br';
      }
    }

    return 'https://partner.shopeemobile.com';
  }

  generateSign(path: string, extraString?: string, paramTimestamp?: number): string {
    const timestamp = paramTimestamp || Math.floor(Date.now() / 1000);
    const baseString = `${this.partnerId}${path}${timestamp}${extraString || ''}`;
    return crypto.createHmac('sha256', this.partnerKey).update(baseString).digest('hex');
  }

  async makeRequest<T = any, R = AxiosResponse<T>, D = any>(config: AxiosRequestConfig<D>): Promise<R> {
    const timestamp = config.params?.timestamp || Math.floor(Date.now() / 1000);

    let sign = ''

    if (config?.params?.access_token && config?.params?.shop_id) {
      sign = this.generateSign(config.url, `${config.params.access_token}${config.params.shop_id}`)
    } else {
      sign = this.generateSign(config.url)
    }
    config.params = config.params || {};
    config.params = {
      partner_id: this.partnerId,
      timestamp: timestamp,
      sign: config.params.sign || sign,
      ...config.params,
    }

    const Serializer = (params: any) => {
      let resultado = ''
      for (const key in params) {
        if (params[key] !== undefined) {
          if (Array.isArray(params[key])) {
            for (let index = 0; index < params[key].length; index++) {
              const element = params[key][index];
              resultado += `${key}=${encodeURI(element)}&`
            }
          } else {
            resultado += `${key}=${encodeURI(params[key])}&`
          }
        }
      }
      if (resultado.length > 2)
        resultado = resultado.substring(0, resultado.length - 1)
      return resultado
    }

    config.paramsSerializer = config.paramsSerializer || Serializer

    return axios.request(config)
  }

}

