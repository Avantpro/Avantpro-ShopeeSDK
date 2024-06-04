import { ShopeeSDK } from "./index";

export class ShopeeSDKShop {
  private ShopeeSDK: ShopeeSDK

  constructor(ShopeeSDK: ShopeeSDK) {
    this.ShopeeSDK = ShopeeSDK;
  }

  async getShopInfo(shop_id: string | number, access_token: string) {
    const path = '/api/v2/shop/get_shop_info'
    try {
      const { data } = await this.ShopeeSDK.makeRequest({
        baseURL: this.ShopeeSDK.host,
        url: path,
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        },
        params: {
          shop_id,
          access_token,
          partner_id: this.ShopeeSDK.partnerId,
        }
      })
      return data
    } catch (error) {
      return (error as any).response.data
    }
  }
}