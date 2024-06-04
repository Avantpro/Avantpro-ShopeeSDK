import { ShopeeSDK } from "./index";

type ShopeeSDKTokenresponse = { access_token: string, refresh_token: string, expire_in: number }

type ShopeeSDKAccessTokenRequest = {
  refresh_token: string;
  ['main_account-id']: number;
} | {
  refresh_token: string;
  shop_id: number;
}

type ShopeeSDKRefreshTokenRequest = {
  ['main_account-id']: number;
  code: string;
} | {
  shop_id: number;
  code: string;
}

export class ShopeeSDKAuth {
  private ShopeeSDK: ShopeeSDK

  constructor(ShopeeSDK: ShopeeSDK) {
    this.ShopeeSDK = ShopeeSDK;
  }

  getAuthorizationLink(redirectUrl: string): string {
    const path = "/api/v2/shop/auth_partner";
    const timestamp = Math.floor(Date.now() / 1000);

    const ReturnURL = new URL(this.ShopeeSDK.host)
    ReturnURL.pathname = path;

    ReturnURL.searchParams.append('partner_id', String(this.ShopeeSDK.partnerId))
    ReturnURL.searchParams.append('timestamp', String(timestamp))
    ReturnURL.searchParams.append('sign', this.ShopeeSDK.generateSign(path))
    ReturnURL.searchParams.append('redirect', redirectUrl)

    return ReturnURL.toString()
  }

  getRemoveAuthorizationLink(redirectUrl: string): string {
    const path = "/api/v2/shop/cancel_auth_partner";
    const timestamp = Math.floor(Date.now() / 1000);

    const ReturnURL = new URL(this.ShopeeSDK.host)
    ReturnURL.pathname = path;

    ReturnURL.searchParams.append('partner_id', String(this.ShopeeSDK.partnerId))
    ReturnURL.searchParams.append('timestamp', String(timestamp))
    ReturnURL.searchParams.append('sign', this.ShopeeSDK.generateSign(path))
    ReturnURL.searchParams.append('redirect', redirectUrl)

    return ReturnURL.toString()
  }

  async getRefreshToken(dados:ShopeeSDKRefreshTokenRequest):Promise<ShopeeSDKTokenresponse> {
    const path = "/api/v2/auth/token/get";

    try {
      const response = await this.ShopeeSDK.makeRequest({
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
      const response = await this.ShopeeSDK.makeRequest({
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
      if(response.data.error) throw new Error(response.data.message)
      const { access_token, refresh_token, expire_in } = response.data;
      return { access_token, refresh_token, expire_in };
    } catch (error: any) {
      if(!error.response) throw new Error(error.message)
      throw new Error(error.response.data.message)
    }
  }

}