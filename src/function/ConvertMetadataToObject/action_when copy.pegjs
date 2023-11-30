start
  = expression //{ console.log("start",text());}

expression
  = left:term _ "||" _ right:expression { return { type: "OR", left, right }; }
  / term

term
  = left:factor _ "&&" _ right:term { return { type: "AND", left, right }; }
  / factor

factor
  = "(" _ e:expression _ ")" { return e; }
  / compare_e

compare_e
    = left:number_e _ oper:number_compare_oper _ right:number_e { return {type: "compare", operator: oper, left: left, right: right}; }
    / left:boolean_e _ oper:boolean_compare_oper _ right:boolean_e { return {type: "compare", operator: oper, left: left, right: right}; }
    / left:string_e _ oper:string_compare_oper _ right:string_e { return {type: "compare", operator: oper, left: left, right: right}; }
    / boolean_e

string_e
    = meta_get_string_functions
    / "'"[a-zA-Z_][a-zA-Z_0-9]*"'" { return {type:'string',value :text().slice(1, -1)}; }

number_e
    = meta_get_number_functions
    / _ [0-9]+ { return parseInt(text(), 10); }

boolean_e
    = meta_get_boolean_functions
    / "true" { return { type: 'bool', value : true}; }
    / "false" { return { type: 'bool', value : false}; }

meta_get_number_functions
    = meta '.' GETNUMBER '(' _ arg1:string_e _ ')' { return {type: "GetNumber", name: arg1}; }

meta_get_boolean_functions
    = meta '.' GETBOOLEAN '(' _ arg1:string_e _ ')' { return {type: "GetBoolean", name: arg1}; }

meta_get_string_functions
    = meta '.' GETSTRING '(' _ arg1:string_e _ ')' { return {type: "GetString", name: arg1}; }

meta
    = 'meta' { return 'meta'; }

GETNUMBER
    = 'GetNumber' { return 'GetNumber'; }

GETBOOLEAN
    = 'GetBoolean' { return 'GetBoolean'; }

GETSTRING
    = 'GetString' { return 'GetString'; }

condition_oper
    = '&&' { return '&&'; }
    / '||' { return '||'; }

number_compare_oper
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

_ "whitespace"
  = [ \t\n\r]*