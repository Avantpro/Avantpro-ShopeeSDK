import { ShopeeSDK } from "./index";

type boostFailure = {
  item_id: number;
  failed_reason: string;
}

export class ShopeeSDKProduct {
  private ShopeeSDK: ShopeeSDK

  constructor(ShopeeSDK: ShopeeSDK) {
    this.ShopeeSDK = ShopeeSDK;
  }

  async boost(items: Array<string | number>, shop_id: string | number, token: string) {
    const path = '/api/v2/product/boost_item'
    if (items.length > 5) throw new Error('You can only boost 5 items at a time')

    try {

      const response = await this.ShopeeSDK.mekeShopeeRequet({
        baseURL: this.ShopeeSDK.host,
        url: path,
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        params: {
          shop_id,
          access_token:token
        },
        data:{
          item_id_list: items,
        }
      })
      
      const failures = (response?.data?.response?.failures_list || []) as boostFailure[];
      const success = (response?.data?.response?.success_list?.item_id_list || []) as string[];
      return { failures, success }

    } catch (error: any) {
      if (!error.response) throw new Error(error.message)
      throw new Error(error.response.data.message)
    }

  }
}