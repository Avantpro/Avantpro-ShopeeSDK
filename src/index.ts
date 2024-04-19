import { ShopeeSDKAuth } from './auth';
import * as crypto from 'crypto';
import { AxiosRequestConfig } from 'axios'

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
  }

  generateSign(path:string){
    const timestamp = Math.floor(Date.now() / 1000);
    const baseString = `${this.partnerId}${path}${timestamp}`;
    return crypto.createHmac('sha256', this.partnerKey).update(baseString).digest('hex');
  }

  async mekeShopeeRequet<T = any>(config:AxiosRequestConfig<T>){

    const timestamp = Math.floor(Date.now() / 1000);
    // ReutrnURL.searchParams.append('partner_id',String(this.ShopeeSDK.partnerId))
    // ReutrnURL.searchParams.append('timestamp',String(timestamp))
    // ReutrnURL.searchParams.append('sign',this.ShopeeSDK.generateSign(path))
    // ReutrnURL.searchParams.append('redirect',redirectUrl)


    config.params = config.params || {};
    config.params = {...config.params,
      partner_id:this.partnerId,
      timestamp:String(timestamp),
      sign:this.generateSign(config.url),
    }

    return config
  }
}