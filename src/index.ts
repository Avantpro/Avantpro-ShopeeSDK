import * as crypto from 'node:crypto';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ShopeeSDKAuth } from './auth';
import { ShopeeSDKProduct } from './product';

interface ShopeeSDKConstructor {
  partnerId: string;
  partnerKey: string;
  sandbox?: boolean;
}

export class ShopeeSDK {
  //base Config Shopee
  partnerId: number
  partnerKey: string
  host: string

  //SubClass Methods
  auth: ShopeeSDKAuth
  product:ShopeeSDKProduct

  constructor(
    {
      partnerId,
      partnerKey,
      sandbox = false
    }: ShopeeSDKConstructor
  ) {
    //base Config Shopee
    this.partnerId = Number(partnerId);
    this.partnerKey = partnerKey;
    this.host = sandbox ? 'https://partner.test-stable.shopeemobile.com' : 'https://partner.shopeemobile.com';
  
    //SubClass Methods
    this.auth = new ShopeeSDKAuth(this)
    this.product = new ShopeeSDKProduct(this)
  }

  generateSign(path:string){
    const timestamp = Math.floor(Date.now() / 1000);
    const baseString = `${this.partnerId}${path}${timestamp}`;
    return crypto.createHmac('sha256', this.partnerKey).update(baseString).digest('hex');
  }

  async mekeShopeeRequet<T = any, R = AxiosResponse<T>, D = any>(config:AxiosRequestConfig<D>):Promise<R>{
    const timestamp = Math.floor(Date.now() / 1000);

    config.params = config.params || {};
    config.params = {...config.params,
      partner_id:this.partnerId,
      timestamp:timestamp,
      sign:this.generateSign(config.url),
    }

    return axios.request(config)
  }

}