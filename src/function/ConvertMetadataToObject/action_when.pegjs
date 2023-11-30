start
  = expression //{ console.log("start",text());}

expression
  = left:term _ "||" _ right:expression { return { type: "condition_oper" , value:"OR", left, right }; }
  / term

term
  = left:factor _ "&&" _ right:term { return { type: "condition_oper" , value: "AND", left, right }; }
  / factor

factor
  = "(" _ e:expression _ ")" { return e; }
  / compare_e

compare_e
    = left:number_e _ oper:number_compare_oper _ right:number_e { return {type: "number_compare_oper", value: oper, left: left, right: right}; }
    / left:boolean_e _ oper:boolean_compare_oper _ right:boolean_e { return {type: "boolean_compare_oper", value: oper, left: left, right: right}; }
    / left:string_e _ oper:string_compare_oper _ right:string_e { return {type: "string_compare_oper", value: oper, left: left, right: right}; }
    / left:float_e _ oper:float_compare_oper _ right:float_e { return {type: "float_compare_oper", value: oper, left: left, right: right}; }
    / boolean_e

string_e
    = left:string_term oper:( _ '+' _ ) right:string_e { return {type: "math_operation", value: oper.slice(1,-1)[0], left: left, right: right}; }
    / string_term
    / param_string

string_term
    = meta_get_string_functions
    / meta_get_image_functions
    / meta_get_base_uri_functions
    / meta_get_token_uri_functions
    / meta_get_block_height_functions
    / meta_get_block_timestamp_functions
    / meta_get_block_timestamp_by_zone_functions
    / string_factor
    / string_with_special_characters

string_factor
    = "(" _ string_e _ ")" { return {type: "string_e", value: string_e}; }
    / _ "'"[a-zA-Z_][a-zA-Z_0-9]*"'" { return {type:'constant',dataType:'string' ,value :text().slice(1, -1)}; }

string_with_special_characters
    = "(" _ string_e _ ")" { return {type: "string_e", value: string_e}; }
    / _ "'"[a-zA-Z0-9_\-\.:?!@#$%^&*_+\\\/<> ]+$"'" { return {type:'constant', dataType:'string', value: text().slice(1, -1)}; }

number_e
    = left:number_term oper:( _ '+' _ / _ '-' _ ) right:number_e { return {type: "math_operation", value: oper.slice(1,-1)[0], left: left, right: right}; }
    / number_term
    / param_number

number_term
    = meta_get_number_functions
    / left:number_factor oper:( _ '*' _ / _ '/' _ ) right:number_term { return {type: "math_operation", value: oper.slice(1,-1)[0], left: left, right: right}; }
    / number_factor

number_factor
    = "(" _ number_e _ ")" { return {type: "number_e", value: number_e}; }
    / _ ('-')* [0-9]+ { return {type:'constant',dataType:'number' ,value :parseInt(text(),10)}; }

float_e
    = left:float_term oper:( _ '+' _ / _ '-' _ ) right:float_e { return {type: "math_operation", value: oper.slice(1,-1)[0], left: left, right: right}; }
    / float_term

float_term
    = meta_get_float_functions
    / left:float_factor oper:( _ '*' _ / _ '/' _ ) right:float_term { return {type: "math_operation", value: oper, left: left, right: right}; }
    / float_factor

float_factor
    = "(" _ float_e _ ")" { return {type: "float_e", value: float_e}; }
    / _ ('-')* [0-9]+ '.' [0-9]+ { return {type:'constant',dataType:'float' ,value :parseFloat(text())}; }
    / "Max" "(" _ value1:float_e _ "," _ value2:float_e _ ")" { return {type: "utility_function", functionName: "max", value1: value1, value2: value2}; }
    / "Min" "(" _ value1:float_e _ "," _ value2:float_e _ ")" { return {type: "utility_function", functionName: "min", value1: value1, value2: value2}; }
    / "Abs" "(" _ value1:float_e _ ")" { return {type: "utility_function", functionName: "abs", value1: value1}; }


boolean_e
    = meta_get_boolean_functions
    / meta_block_time_utc_before_functions
    / meta_block_time_utc_after_functions
    / meta_block_time_before_by_zone_functions
    / meta_block_time_after_by_zone_functions
    / "true" { return { type:'constant',dataType: 'bool', value : true}; }
    / "false" { return { type:'constant',dataType: 'bool', value : false}; }

meta_get_number_functions
    = meta '.' GETNUMBER '(' _ arg1:string_e _ ')' { return {type:"meta_function", functionName: "GetNumber", attributeName: arg1}; }

meta_get_boolean_functions
    = not:('!')? meta '.' GETBOOLEAN '(' _ arg1:string_e _ ')' {return {type: "meta_function", functionName:"GetBoolean", attributeName: arg1, negative: not==='!'? true:false }; }

meta_get_string_functions
    = meta '.' GETSTRING '(' _ arg1:string_e _ ')' { return {type: "meta_function", functionName:"GetString", attributeName: arg1}; }

meta_get_float_functions
    = meta '.' GETFLOAT '(' _ arg1:string_e _ ')' { return {type: "meta_function", functionName:"GetFloat", attributeName: arg1}; }

meta_get_image_functions
    = meta '.' GETIMAGE '()' { return {type: "meta_function", functionName:"GetImage"}; }

meta_get_base_uri_functions
    = meta '.' GETBASEURI '()' { return {type: "meta_function", functionName:"GetBaseURI"}; }

meta_get_token_uri_functions
    = meta '.' GETTOKENURI '()' { return {type: "meta_function", functionName:"GetTokenURI"}; }

meta_get_block_height_functions
    = meta '.' GETBLOCKHIEGHT '()' { return {type: "meta_function", functionName:"GetBlockHeight"}; }

meta_get_block_timestamp_functions
    = meta '.' GETUTCBLOCKTIMESTAMP '(' _ arg1:string_e _ ')' { return {type: "meta_function", functionName:"GetUTCBlockTimestamp", attributeName: arg1}; }

meta_get_block_timestamp_by_zone_functions
    = meta '.' GETBLOCKTIMESTAMPBYZONE '(' _ arg1:string_e _ ',' _ arg2:string_e _ ')' { return {type: "meta_function", functionName:"GetBlockTimestampByZone", attributeName: arg1, value1: arg2}; }

meta_block_time_utc_before_functions
    = meta '.' BLOCKTIMEUTCBEFORE '(' _ arg1:string_e _ ',' _ arg2:string_e _ ')' { return {type: "meta_function", functionName:"BlockTimeUTCBefore", attributeName: arg1, value1: arg2}; }

meta_block_time_utc_after_functions
    = meta '.' BLOCKTIMEUTCAFTER '(' _ arg1:string_e _ ',' _ arg2:string_e _ ')' { return {type: "meta_function", functionName:"BlockTimeUTCAfter", attributeName: arg1, value1: arg2}; }

meta_block_time_before_by_zone_functions
    = meta '.' BLOCKTIMEBEFOREBYZONE '(' _ arg1:string_e _ ',' _ arg2:string_e _ ')' { return {type: "meta_function", functionName:"BlockTimeBeforeByZone", attributeName: arg1, value1: arg2, value2: arg3}; }

meta_block_time_after_by_zone_functions
    = meta '.' BLOCKTIMEAFTERBYZONE '(' _ arg1:string_e _ ',' _ arg2:string_e _ ')' { return {type: "meta_function", functionName:"BlockTimeAfterByZone", attributeName: arg1, value1: arg2, value2: arg3}; }

param_string
    = 'params[' _ arg1:string_e _ ']' '.' 'GetString()' { return {type: "param_function", functionName:"GetString", attributeName: arg1}; }

param_number
    = 'params[' _ arg1:string_e _ ']' '.' 'GetNumber()' { return {type: "param_function", functionName:"GetNumber", attributeName: arg1}; }

meta
    = 'meta' { return 'meta'; }

GETNUMBER
    = 'GetNumber' { return 'GetNumber'; }

GETBOOLEAN
    = 'GetBoolean' { return 'GetBoolean'; }

GETSTRING
    = 'GetString' { return 'GetString'; }

GETFLOAT
    = 'GetFloat' { return 'GetFloat'; }

GETIMAGE
    = 'GetImage' { return 'GetImage'; }

GETBASEURI 
    = 'GetBaseURI' { return 'GetBaseURI'; }

GETTOKENURI
    = 'GetTokenURI' { return 'GetTokenURI'; }

GETBLOCKHIEGHT
    = 'GetBlockHeight' { return 'GetBlockHeight'; }

GETUTCBLOCKTIMESTAMP
    = 'GetUTCBlockTimestamp' { return 'GetUTCBlockTimestamp'; }

GETBLOCKTIMESTAMPBYZONE
    = 'GetBlockTimestampByZone' { return 'GetBlockTimestampByZone'; }

BLOCKTIMEUTCBEFORE
    = 'BlockTimeUTCBefore' { return 'BlockTimeUTCBefore'; }

BLOCKTIMEUTCAFTER
    = 'BlockTimeUTCAfter' { return 'BlockTimeUTCAfter'; }

BLOCKTIMEBEFOREBYZONE
    = 'BlockTimeBeforeByZone' { return 'BlockTimeBeforeByZone'; }

BLOCKTIMEAFTERBYZONE
    = 'BlockTimeAfterByZone' { return 'BlockTimeAfterByZone'; }

condition_oper
    = '&&' { return '&&'; }
    / '||' { return '||'; }

number_compare_oper
    = '<' { return '<'; }
    / '>' { return '>'; }
    / '<=' { return '<='; }
    / '>=' { return '>='; }
    / '==' { return '=='; }

float_compare_oper
    = '<' { return '<'; }
    / '>' { return '>'; }
    / '<=' { return '<='; }
    / '>=' { return '>='; }
    / '==' { return '=='; }

boolean_compare_oper
    = '==' { return '=='; }
    / '!=' { return '!='; }

string_compare_oper
    = '==' { return '=='; }
    / '!=' { return '!='; }

math_operation
    = '+' { return '+'; }
    / '-' { return '-'; }
    / '*' { return '*'; }
    / '/' { return '/'; }
    / '%' { return '%'; }

_ "whitespace"
  = [ \t\n\r]*