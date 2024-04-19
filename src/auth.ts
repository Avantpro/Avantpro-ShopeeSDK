import { ShopeeSDK } from "index";

export class ShopeeSDKAuth {
  private ShopeeSDK:ShopeeSDK

  constructor(ShopeeSDK:ShopeeSDK){
    this.ShopeeSDK = ShopeeSDK;
  }

  getAuthorizationLink(redirectUrl: string): string {
    const path = "/api/v2/shop/auth_partner";
    const timestamp = Math.floor(Date.now() / 1000);

    const ReutrnURL = new URL(this.ShopeeSDK.host)
    ReutrnURL.pathname = path;

    ReutrnURL.searchParams.append('partner_id',String(this.ShopeeSDK.partnerId))
    ReutrnURL.searchParams.append('timestamp',String(timestamp))
    ReutrnURL.searchParams.append('sign',this.ShopeeSDK.generateSign(path))
    ReutrnURL.searchParams.append('redirect',redirectUrl)

    return ReutrnURL.toString()
  }

  getRemoveAuthorizationLink(redirectUrl: string): string {
    const path = "/api/v2/shop/cancel_auth_partner";
    const timestamp = Math.floor(Date.now() / 1000);

    const ReutrnURL = new URL(this.ShopeeSDK.host)
    ReutrnURL.pathname = path;

    ReutrnURL.searchParams.append('partner_id',String(this.ShopeeSDK.partnerId))
    ReutrnURL.searchParams.append('timestamp',String(timestamp))
    ReutrnURL.searchParams.append('sign',this.ShopeeSDK.generateSign(path))
    ReutrnURL.searchParams.append('redirect',redirectUrl)

    return ReutrnURL.toString()
  }

  // async refreshAccessToken(){
  //   const path = "/api/v2/auth/access_token/get";

  //   return this.ShopeeSDK.mekeShopeeRequet({
  //     baseURL:this.ShopeeSDK.host,
  //     url:path,
  //   })
  // }

}