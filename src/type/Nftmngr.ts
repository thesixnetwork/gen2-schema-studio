export interface ISchemaInfo {
    schema_name: string,
    schema_code: string,
    schema_info: InSchemaInfoTwo,
    status: string,
    current_state: number
  }
  export interface IOriginAttributes {
    "name": string,
    "data_type": string,
    "required": boolean,
    "display_value_field": string,
    "display_option": {
      "bool_true_value": string,
      "bool_false_value": string,
      "opensea": {
        "display_type": string,
        "trait_type": string,
        "max_value": string
      }
    },
    "default_mint_value": any,
    "hidden_overide": boolean,
    "hidden_to_marketplace": boolean,
  }
  
  export interface IOriginData {
    "origin_chain": string,
    "origin_contract_address": string,
    "origin_base_uri": string,
    "attribute_overriding": string,
    "metadata_format": string,
    "origin_attributes": IOriginAttributes[],
    "uri_retrieval_method": string
  }
  
  export interface INftAttributes {
    "name": string,
    "data_type": string,
    "required": boolean,
    "display_value_field": string,
    "display_option": {
      "bool_true_value": string,
      "bool_false_value": string,
      "opensea": {
        "display_type": string,
        "trait_type": string,
        "max_value": string
      }
    },
    "default_mint_value": {
      "float_attribute_value"?: {
        "value": number
      },
      "boolean_attribute_value"?: {
        "value": false
      },
      "string_attribute_value"?: {
        "value": string
      },
      "number_attribute_value"?: {
        "value": string
      }
    },
    "hidden_overide": boolean,
    "hidden_to_marketplace": boolean,
    "index": string
  }
  
  export interface IActions {
    "name": string,
    "desc": string,
    "disable": boolean,
    "when": string,
    "then": string[],
    "allowed_actioner": string,
    "params": [
      {
        "name": string,
        "desc": string,
        "data_type": string,
        "required": boolean,
        "default_value": string
      }?,
    ]
  }
  
  export interface ItokenAttributes {
    "name": string,
    "data_type": string,
    "required": boolean,
    "display_value_field": string,
    "display_option": {
      "bool_true_value": string,
      "bool_false_value": string,
      "opensea": {
        "display_type": string,
        "trait_type": string,
        "max_value": string
      }
    },
    "default_mint_value": {
      "float_attribute_value"?: {
        "value": number
      },
      "boolean_attribute_value"?: {
        "value": false
      },
      "string_attribute_value"?: {
        "value": string
      },
      "number_attribute_value"?: {
        "value": string
      }
    },
    "hidden_overide": boolean,
    "hidden_to_marketplace": boolean,
  }
  
  export interface IOnChainData {
    "nft_attributes": INftAttributes[],
    "token_attributes": ItokenAttributes[],
    "actions": IActions[],
    "status": [
      {
        "status_name": string,
        "status_value": boolean
      }
    ]
  }
  
  export interface InSchemaInfoTwo {
    "code": string,
    "name": string,
    "owner": string,
    "description": string,
    "origin_data": IOriginData,
    "onchain_data": IOnChainData,
    "isVerified": boolean,
    "mint_authorization": string
  }