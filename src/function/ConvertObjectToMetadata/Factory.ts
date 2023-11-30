interface ObjectData {
    type: string;
    [key: string]: any;
}

interface ObjectFunction {
    new (data: ObjectData): any;
}

class Factory {
    static createObject(object: ObjectData) {
        const objectTypeMap: { [key: string]: ObjectFunction } = {
            'meta_function': MetaFunction,
            'constant': Constant,
            'variable': Variable,
            'string_compare_oper': StringCompareOperator,
            'number_compare_oper': NumberCompareOperator,
            'boolean_compare_oper': BooleanCompareOperator,
            'float_compare_oper': FloatCompareOperator,
            'math_operation': MathOperation,
            'condition_oper': ConditionOperator,
            'param_function': ParamFunction,
            'variable_assignment': VariableAssignment,
            'utility_function': UtilityFunction,
            'addNode': AddNode,
        };

        const ObjectConstructor = objectTypeMap[object.type];

        if (ObjectConstructor) {
            return new ObjectConstructor(object);
        } else {
            console.log(object.type);
            throw new Error('Invalid type');
        }
    }
}

class AddNode {
    
    constructor(data: ObjectData) {
        if (data.type !== 'addNode') {
            throw new Error('Invalid type');
        }
    }


    toString() {
        return '???';
    }
}
class ConditionOperator {
    operator: string;
    left: any;
    right: any;

    constructor(data: ObjectData) {
        if (data.type !== 'condition_oper') {
            throw new Error('Invalid type');
        }

        this.operator = data.value;
        this.left = Factory.createObject(data.left);
        this.right = Factory.createObject(data.right);
    }

    toString() {
        return `${this.left} ${this.operator === "AND" ? "&&" : "||"} ${this.right}`;
    }
}

class MetaFunction {
    functionName: string;
    attributeName?: any;
    value1?: any;
    value2?: any;
    negative: string;

    constructor(data: ObjectData) {
        if (data.type !== 'meta_function') {
            throw new Error('Invalid type');
        }

        this.functionName = data.functionName;
        this.attributeName = data.attributeName ? Factory.createObject(data.attributeName) : undefined;

        if (this.functionName === 'ReplaceAllString') {
            this.value1 = data.value1 ? Factory.createObject(data.value1) : undefined;
            this.value2 = data.value2 ? Factory.createObject(data.value2) : undefined;

            this.toString = function() {
                return `meta.ReplaceAllString(${this.attributeName}, ${this.value1}, ${this.value2})`;
            }
        }

        this.value1 = data.value1 ? Factory.createObject(data.value1) : undefined;
        this.value2 = data.value2 ? Factory.createObject(data.value2) : undefined;

        switch (data.negative) {
            case undefined:
                this.negative = "";
                break;
            case true:
                this.negative = "!";
                break;
            case false:
                this.negative = "";
                break;
            default:
                throw new Error('Invalid negative');
        }
    }
    toString() {
        if (this.value1 !== undefined && this.value2 !== undefined) {
            return `${this.negative}meta.${this.functionName}(${this.attributeName}, ${this.value1}, ${this.value2})`;
        } else if (this.value1 !== undefined) {
            return `${this.negative}meta.${this.functionName}(${this.attributeName}, ${this.value1})`;
        } else if (this.value2 !== undefined) {
            return `${this.negative}meta.${this.functionName}(${this.attributeName}, ${this.value2})`;
        }
        //  else if(this.attributeName !== undefined && this.attributeName.dataType !== "string"){
        //     return `${this.negative}meta.${this.functionName}('${this.attributeName}')`;
        // }
        else if (this.attributeName !== undefined) {
            return `${this.negative}meta.${this.functionName}(${this.attributeName})`;
        } else {
            return `${this.negative}meta.${this.functionName}()`;
        }
    }
}

class Constant {
    dataType: string;
    value: string | number | boolean;

    constructor(data: ObjectData) {
        if (data.type !== 'constant') {
            throw new Error('Invalid type');
        }

        this.dataType = data.dataType;
        this.value = data.dataType === 'string' ? `'${data.value}'` : data.value;
    }

    toString() {
        return this.value.toString();
    }
}

class StringCompareOperator {
    operator: string;
    left: any;
    right: any;

    constructor(data: ObjectData) {
        if (data.type !== 'string_compare_oper') {
            throw new Error('Invalid type');
        }

        this.operator = data.value;
        this.left = Factory.createObject(data.left);
        this.right = Factory.createObject(data.right);
    }

    toString() {
        return `${this.left} ${this.operator} ${this.right}`;
    }
}

class NumberCompareOperator {
    operator: string;
    left: any;
    right: any;

    constructor(data: ObjectData) {
        if (data.type !== 'number_compare_oper') {
            throw new Error('Invalid type');
        }

        this.operator = data.value;
        this.left = Factory.createObject(data.left);
        this.right = Factory.createObject(data.right);
    }

    toString() {
        return `${this.left} ${this.operator} ${this.right}`;
    }
}

class MathOperation {
    operator: string;
    left: any;
    right: any;

    constructor(data: ObjectData) {
        if (data.type !== 'math_operation') {
            throw new Error('Invalid type');
        }

        if (data.value !== '+' && data.value !== '-' && data.value !== '*' && data.value !== '/') {
            throw new Error('Invalid operator');
        }

        this.operator = data.value;
        this.left = Factory.createObject(data.left);
        this.right = Factory.createObject(data.right);
    }

    toString() {
        return `${this.left} ${this.operator} ${this.right}`;
    }
}

class FloatCompareOperator {
    operator: string;
    left: any;
    right: any;

    constructor(data: ObjectData) {
        if (data.type !== 'float_compare_oper') {
            throw new Error('Invalid type');
        }

        this.operator = data.value;
        this.left = Factory.createObject(data.left);
        this.right = Factory.createObject(data.right);
    }

    toString() {
        return `${this.left} ${this.operator} ${this.right}`;
    }
}

class BooleanCompareOperator {
    operator: string;
    left: any;
    right: any;

    constructor(data: ObjectData) {
        if (data.type !== 'boolean_compare_oper') {
            throw new Error('Invalid type');
        }

        if (data.value !== '==' && data.value !== '!=') {
            throw new Error('Invalid operator');
        }

        this.operator = data.value;
        this.left = Factory.createObject(data.left);
        this.right = Factory.createObject(data.right);
    }

    toString() {
        return `${this.left} ${this.operator} ${this.right}`;
    }
}

class VariableAssignment {
    name: string;
    value: any;

    constructor(data: ObjectData) {
        if (data.type !== 'variable_assignment') {
            throw new Error('Invalid type');
        }

        this.name = data.variable.name;
        this.value = Factory.createObject(data.value);
    }

    toString() {
        return `${this.name} = ${this.value}`;
    }
}

class Variable {
    name: string;
    negative: string;

    constructor(data: ObjectData) {
        if (data.type !== 'variable') {
            throw new Error('Invalid type');
        }

        this.name = data.name;

        switch (data.negative) {
            case undefined:
                this.negative = "";
                break;
            case true:
                this.negative = "-";
                break;
            case false:
                this.negative = "";
                break;
            default:
                throw new Error('Invalid negative');
        }
    }

    toString() {
        return `${this.negative}${this.name}`;
    }
}

class ParamFunction {
    functionName: string;
    attributeName: any;
    data: any

    constructor(data: ObjectData) {
        if (data.type !== 'param_function') {
            throw new Error('Invalid type');
        }

        this.functionName = data.functionName;
        this.attributeName = Factory.createObject(data.attributeName);
        this.data = data;
        console.log("----e",data.attributeName.dataType)
    }

    toString() {
        return this.data.attributeName.dataType !== "string" 
            ? `params['${this.attributeName}'].${this.functionName}()`
            : `params[${this.attributeName}].${this.functionName}()`;
    }
}

class UtilityFunction {
    functionName: string;
    value1?: any;
    value2?: any;

    constructor(data: ObjectData) {
        if (data.type !== 'utility_function') {
            throw new Error('Invalid type');
        }

        switch (data.functionName) {
            case 'max':
                this.functionName = 'Max';
                break;
            case 'min':
                this.functionName = 'Min';
                break;
            case 'abs':
                this.functionName = 'Abs';
                break;
            default:
                throw new Error('Invalid functionName');
        }

        this.value1 = data.value1 ? Factory.createObject(data.value1) : undefined;
        this.value2 = data.value2 ? Factory.createObject(data.value2) : undefined;
    }

    toString() {
        if (this.value2 !== undefined && this.value1 !== undefined) {
            return `${this.functionName}(${this.value1}, ${this.value2})`;
        } else if (this.value1 !== undefined) {
            return `${this.functionName}(${this.value1})`;
        } else if (this.value2 !== undefined) {
            return `${this.functionName}(${this.value2})`;
        } else {
            return `${this.functionName}()`;
        }
    }
}

export {
    Factory,
    MetaFunction,
    Constant,
    NumberCompareOperator,
    FloatCompareOperator,
    ParamFunction,
    MathOperation,
    BooleanCompareOperator,
    ConditionOperator,
    VariableAssignment,
    Variable,
    UtilityFunction
};