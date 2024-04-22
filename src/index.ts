import * as crypto from 'node:crypto';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ShopeeSDKAuth } from './auth';
import { ShopeeSDKProduct } from './product';

type localType = 'defalt'|'china'|'brasil'

interface ShopeeSDKConstructor {
  partnerId: string;
  partnerKey: string;
  local?:localType;
  sandbox?: boolean;
}

export class ShopeeSDK {
  //base Config Shopee
  partnerId: number
  partnerKey: string
  host: string

  //SubClass Methods
  auth: ShopeeSDKAuth
  product: ShopeeSDKProduct

  constructor(
    {
      partnerId,
      partnerKey,
      local = 'defalt',
      sandbox = false
    }: ShopeeSDKConstructor
  ) {
    //base Config Shopee
    this.partnerId = Number(partnerId);
    this.partnerKey = partnerKey;
    // this.host = sandbox ? 'https://partner.test-stable.shopeemobile.com' : 'https://partner.shopeemobile.com';
    this.host = this.getURL(sandbox,local)

    //SubClass Methods
    this.auth = new ShopeeSDKAuth(this)
    this.product = new ShopeeSDKProduct(this)
  }

  private getURL(sandbox:boolean, local:localType):string{
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

  generateSign(path: string, timestamp: number, extraString?: string): string {
    const baseString = `${this.partnerId}${path}${timestamp}${extraString || ''}`;    
    return crypto.createHmac('sha256', this.partnerKey).update(baseString).digest('hex');
  }

  async mekeShopeeRequet<T = any, R = AxiosResponse<T>, D = any>(config: AxiosRequestConfig<D>): Promise<R> {
    const timestamp = Math.floor(Date.now() / 1000);

    let sing = ''

    if (config.params.access_token && config.params.shop_id){
      sing = this.generateSign(config.url, timestamp,`${config.params.access_token}${config.params.shop_id}`)
    } else {
      sing = this.generateSign(config.url, timestamp)
    }

    config.params = config.params || {};
    config.params = {
      ...config.params,
      partner_id: this.partnerId,
      timestamp: timestamp,
      sign:sing,
    }

    const Serializer = (params:any) => {
      let resultado = ''
      for (const key in params) {
        if (params[key] !== undefined) {
          if (Array.isArray(params[key])) {
            for (let index = 0; index < params[key].length; index++) {
              const element = params[key][index];
              resultado += `${key}=${encodeURI(element)}&`
            }          
          }else {
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