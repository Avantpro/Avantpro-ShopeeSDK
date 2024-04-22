import { ShopeeSDK } from "./index";

type boostFailure = {
  item_id: number;
  failed_reason: string;
}

type item_status = 'NORMAL'|'BANNED'|'UNLIST'|'REVIEWING'|'SELLER_DELETE'|'SHOPEE_DELETE'

type get_item_list_config = {
  offset: number;
  page_size:number;
  update_time_from: number;
  update_time_to: number;
  item_status:item_status[];
}

export class ShopeeSDKProduct {
  private ShopeeSDK: ShopeeSDK

  constructor(ShopeeSDK: ShopeeSDK) {
    this.ShopeeSDK = ShopeeSDK;
  }

  async boost_item(items: Array<string | number>, shop_id: string | number, token: string) {
    const path = '/api/v2/product/boost_item'
    if (items.length > 5) throw new Error('You can only boost 5 items at a time')
    if (items.length <= 5) throw new Error('Select at least one product')

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
          access_token: token
        },
        data: {
          item_id_list: items,
        }
      })

      if (response?.data?.error){
        throw new Error(response.data.error)
      }

      const failures = (response?.data?.response?.failures_list || []) as boostFailure[];
      const success = (response?.data?.response?.success_list?.item_id_list || []) as string[];
      return { failures, success }

    } catch (error: any) {
      if (!error.response) throw new Error(error.message)
      throw new Error(error.response.data.message)
    }

  }

  async get_item_list({
    offset = 0,
    page_size = 10,
    update_time_from,
    update_time_to,
    item_status=['NORMAL','UNLIST']
  }:get_item_list_config, shop_id: string | number, token: string){
    const path = '/api/v2/product/get_item_list'
    try {

      const response = await this.ShopeeSDK.mekeShopeeRequet({
        baseURL: this.ShopeeSDK.host,
        url: path,
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        },
        params:{
          shop_id:110918,
          access_token:'534174546d7666435749736955696d6c',
          offset,
          page_size,
          update_time_from,
          update_time_to,
          item_status:item_status
        }
      })

      return response.data;
      
    } catch (error:any) {      
      if (!error.response) throw new Error(error.message)
      throw new Error(error.response.data.message)
    }
  }
}