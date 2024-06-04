import { IShopeeItem } from "./types/ShopeeItem";
import { ShopeeSDK } from "./index";

// type boostFailure = {
//   item_id: number;
//   failed_reason: string;
// }

type item_status = 'NORMAL' | 'BANNED' | 'UNLIST' | 'REVIEWING' | 'SELLER_DELETE' | 'SHOPEE_DELETE'

type get_item_list_config = {
  offset?: number;
  page_size?:number;
  update_time_from?: number;
  update_time_to?: number;
  item_status?:item_status[];
}

export class ShopeeSDKProduct {
  constructor(private ShopeeSDK: ShopeeSDK) { }

  async addItem(shop_id: string | number, access_token: string, item: IShopeeItem){
    const path = '/api/v2/product/add_item'
    try {
      const response = await this.ShopeeSDK.makeRequest({
        baseURL: this.ShopeeSDK.host,
        url: path,
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        params: {
          sign: this.ShopeeSDK.generateSign(path, `${access_token}${shop_id}`),
          shop_id,
          access_token
        },
        data: item
      })

      return response.data;
      
    } catch (error:any) {      
      if (!error.response) throw new Error(error.message)
      throw new Error(error.response.data.message)
    }
  }

  async getItemList(shop_id: string | number, access_token: string, {
    offset = 0,
    page_size = 10,
    update_time_from,
    update_time_to,
    item_status=['NORMAL','UNLIST']
  }:get_item_list_config = {}){
    const path = '/api/v2/product/get_item_list'
    try {
      const response = await this.ShopeeSDK.makeRequest({
        baseURL: this.ShopeeSDK.host,
        url: path,
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        },
        params:{
          sign: this.ShopeeSDK.generateSign(path, `${access_token}${shop_id}`),
          shop_id,
          access_token,
          offset,
          page_size,
          update_time_from,
          update_time_to,
          item_status
        }
      })

      return response.data.response;
      
    } catch (error:any) {      
      if (!error.response) throw new Error(error.message)
      throw new Error(error.response.data.message)
    }
  }

  async getCategory(shop_id: string | number, access_token: string) {
    const path = '/api/v2/product/get_category'
    try {
      const timestamp = Math.floor(Date.now() / 1000); // Declare and initialize the 'timestamp' property
      const response = await this.ShopeeSDK.makeRequest({
        baseURL: this.ShopeeSDK.host,
        url: path,
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        },
        params:{
          sign: this.ShopeeSDK.generateSign(path, `${access_token}${shop_id}`),
          shop_id,
          access_token,
          timestamp
        }
      })

      return response.data.response.category_list;
      
    } catch (error:any) {      
      if (!error.response) throw new Error(error.message)
      throw new Error(error.response.data.message)
    }
  }

  /*async boostItem(shop_id: string | number, access_token: string, items: Array<string | number>) {
    const path = '/api/v2/product/boost_item'
    if (items.length > 5) throw new Error('You can only boost 5 items at a time')
    if (items.length <= 0) throw new Error('Select at least one product')

    try {
      const response = await this.ShopeeSDK.makeRequest({
        baseURL: this.ShopeeSDK.host,
        url: path,
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        params: {
          shop_id,
          access_token,
          sign: this.ShopeeSDK.generateSign(path, `${access_token}${shop_id}`),
        },
        data: {
          item_id_list: items,
        }
      })
      console.log(response)
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

  }*/
}