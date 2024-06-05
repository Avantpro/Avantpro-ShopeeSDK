export interface IShopeeItem {
  original_price: number;
  description: string;
  weight: number;
  item_name: string;
  item_status?: "UNLIST" | "NORMAL";
  dimension?: {
      package_height: number;
      package_length: number;
      package_width: number;
  };
  normal_stock?: number;
  logistic_info: ILogisticInfo[];
  attribute_list?: IAttribute[];
  category_id: number;
  image: {
      image_id_list: string[];
      image_ratio?: "1:1" | "3:4";
  };
  pre_order?: {
      is_pre_order: boolean;
      days_to_ship?: number;
  };
  item_sku?: string;
  condition?: "NEW" | "USED";
  wholesale?: IWholesale[];
  video_upload_id?: string[];
  brand?: {
    brand_id: number;
    original_brand_name: string;
  };
  item_dangerous?: number;
  tax_info?: ITaxInfo;
  hs_code?: string;
  tax_code?: string;
  tax_type?: number;
  complaint_policy?: IComplaintPolicy;
  description_info?: IDescriptionInfo;
  seller_stock: ISellerStock[];
}

interface ILogisticInfo {
  size_id?: number;
  shipping_fee?: number;
  enabled: boolean;
  logistic_id: number;
  is_free?: boolean;
}

interface IAttribute {
  attribute_id: number;
  attribute_value_list?: IAttributeValue[];
}

interface IAttributeValue {
  value_id: number;
  original_value_name?: string;
  value_unit?: string;
}

interface IWholesale {
  min_count: number;
  max_count: number;
  unit_price: number;
}

interface ITaxInfo {
  ncm?: string;
  same_state_cfop?: string;
  diff_state_cfop?: string;
  csosn?: string;
  origin?: string;
  cest?: string;
  measure_unit?: string;
  invoice_option?: string;
  vat_rate?: string;
}

interface IComplaintPolicy {
  warranty_time?: string;
  exclude_entrepreneur_warranty?: boolean;
  complaint_address_id?: number;
  additional_information?: string;
}

interface IDescriptionInfo {
  extended_description?: {
      field_list: IFieldList[];
  };
}

interface IFieldList {
  field_type: string;
  text?: string;
  image_info?: {
      image_id: string;
  };
}

interface ISellerStock {
  location_id?: string;
  stock: number;
}
