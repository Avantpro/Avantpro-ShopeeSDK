import { ShopeeSDK } from "./index";

type ShopeeSDKTokenresponse = { access_token: string, refresh_token: string, expire_in: number }

type ShopeeSDKRefreshTokenRequest = {
  code: string;
  ['main_account-id']: number;
} | {
  code: string;
  shop_id: number;
}

type ShopeeSDKAccessTokenRequest = {
  refresh_token: string;
  ['main_account-id']: number;
} | {
  refresh_token: string;
  shop_id: number;
}

export class ShopeeSDKAuth {
  private ShopeeSDK: ShopeeSDK

  constructor(ShopeeSDK: ShopeeSDK) {
    this.ShopeeSDK = ShopeeSDK;
  }

  getAuthorizationLink(redirectUrl: string): string {
    const path = "/api/v2/shop/auth_partner";
    const timestamp = Math.floor(Date.now() / 1000);

    const ReutrnURL = new URL(this.ShopeeSDK.host)
    ReutrnURL.pathname = path;

    ReutrnURL.searchParams.append('partner_id', String(this.ShopeeSDK.partnerId))
    ReutrnURL.searchParams.append('timestamp', String(timestamp))
    ReutrnURL.searchParams.append('sign', this.ShopeeSDK.generateSign(path,timestamp))
    ReutrnURL.searchParams.append('redirect', redirectUrl)

    return ReutrnURL.toString()
  }

  getRemoveAuthorizationLink(redirectUrl: string): string {
    const path = "/api/v2/shop/cancel_auth_partner";
    const timestamp = Math.floor(Date.now() / 1000);

    const ReutrnURL = new URL(this.ShopeeSDK.host)
    ReutrnURL.pathname = path;

    ReutrnURL.searchParams.append('partner_id', String(this.ShopeeSDK.partnerId))
    ReutrnURL.searchParams.append('timestamp', String(timestamp))
    ReutrnURL.searchParams.append('sign', this.ShopeeSDK.generateSign(path,timestamp))
    ReutrnURL.searchParams.append('redirect', redirectUrl)

    return ReutrnURL.toString()
  }

  async getRefreshToken(dados:ShopeeSDKRefreshTokenRequest):Promise<ShopeeSDKTokenresponse> {
    const path = "/api/v2/auth/token/get";

    try {
      const response = await this.ShopeeSDK.mekeShopeeRequest({
        baseURL: this.ShopeeSDK.host,
        url: path,
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          ...dados,
          partner_id: this.ShopeeSDK.partnerId,
        }
      })

      const { access_token, refresh_token, expire_in } = response.data;
      return { access_token, refresh_token, expire_in };
    } catch (error: any) {
      if (!error.response) throw new Error(error.message)
      throw new Error(error.response.data.message)
    }
  }

  async getAccessToken(dados:ShopeeSDKAccessTokenRequest):Promise<ShopeeSDKTokenresponse> {
    const path = "/api/v2/auth/access_token/get";

    try {
      const response = await this.ShopeeSDK.mekeShopeeRequest({
        baseURL: this.ShopeeSDK.host,
        url: path,
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          ...dados,
          partner_id: this.ShopeeSDK.partnerId,
        }
      })

      const { access_token, refresh_token, expire_in } = response.data;
      return { access_token, refresh_token, expire_in };
    } catch (error: any) {
      if(!error.response) throw new Error(error.message)
      throw new Error(error.response.data.message)
    }
  }

}