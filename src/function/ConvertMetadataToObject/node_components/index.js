class Factory {
    constructor() {}

    static createObject(object) {
        switch(object.type) {
            case 'meta_function':
                return new MetaFunction(object)
            case 'constant':
                return new Constant(object)
            case 'variable':
                return new Variable(object)
            case 'number_compare_oper':
                return new NumberCompareOperator(object)
            case 'boolean_compare_oper':
                return new BooleanCompareOperator(object)
            case 'float_compare_oper':
                return new FloatCompareOperator(object)
            case 'math_operation':
                return new MathOperation(object)
            case 'condition_oper':
                return new ConditionOerator(object)
            case 'param_function':
                return new ParamFunction(object)
            case 'variable_assignment':
                return new VariableAssignment(object)
            case 'utility_function':
                return new UtilityFunction(object)
            default:
                console.log(object.type)
                throw new Error('invalid type')
        }
    }
}

class ConditionOerator {
    constructor(
        {
            type,
            value,
            left,
            right,
        }
    ) {
        if(type !== 'condition_oper') {
            throw new Error('invalid type')
        }
        this.operator = value
        this.left = Factory.createObject(left)
        this.right = Factory.createObject(right)
    }

    toString() {
        return this.left + " " + (this.operator === "AND" ? "&&" : "||") + " " + this.right
    }
}

class MetaFunction {
    constructor(
        {
            type,
            functionName,
            attributeName,
            value1,
            value2,
            negative,
        }
    ) {
        if(type !== 'meta_function') {
            throw new Error('invalid type')
        }
        this.functionName = functionName
        if (attributeName !== undefined) {
            this.attributeName = Factory.createObject(attributeName)
        }
        
        if (this.functionName === 'ReplaceAllString') {
            if (value1 !== undefined) {
                this.value1 = Factory.createObject(value1)
            }
            if (value2 !== undefined) {
                this.value2 = Factory.createObject(value2)
            }
            this.toString = function() {
                return "meta.ReplaceAllString(" + this.attributeName + ", " + this.value1 + ", " + this.value2 + ")"
            }
        }


        if (value1 !== undefined) {
            this.value1 = Factory.createObject(value1)
        }
        if (value2 !== undefined) {
            this.value2 = Factory.createObject(value2)
        }

        switch (negative) {
            case undefined:
                this.negative = ""
                break;
            case true:
                this.negative = "!"
                break;
            case false:
                this.negative = ""
                break;
            default:
                throw new Error('invalid negative')
        }
    }

    toString() {
        if (this.value1 !== undefined && this.value2 !== undefined) {
            return this.negative+"meta."+ this.functionName + "(" + this.attributeName + ", " + this.value1 + ", " + this.value2 + ")"
        }else if (this.value1 !== undefined) {
            return this.negative+"meta."+ this.functionName + "(" + this.attributeName + ", " + this.value1 + ")"
        }else if (this.value2 !== undefined) {
            return this.negative+"meta."+ this.functionName + "(" + this.attributeName + ", " + this.value2 + ")"
        }else if (this.attributeName !== undefined) {
            return this.negative+"meta."+ this.functionName + "(" + this.attributeName + ")"
        }else{ 
            return this.negative+"meta."+ this.functionName + "()"
        }
    }
}

class ParamFunction {
    constructor(
        {
            type,
            functionName,
            attributeName,
        }
    ) {
        if(type !== 'param_function') {
            throw new Error('invalid type')
        }
        this.functionName = functionName
        this.attributeName = Factory.createObject(attributeName)
    }

    toString() {
        return "params["+this.attributeName+"]." +this.functionName + "()"
    }
}

class Constant {
    constructor(
        {
            type,
            dataType,
            value,
        }
    ) {
        if(type !== 'constant') {
            throw new Error('invalid type')
        }
        this.dataType = dataType
        this.value = dataType === 'string' ? `'${value}'` : value
    }

    toString() {
        return this.value
    }
}

class NumberCompareOperator {

    constructor(
        {
            type,
            value,
            left,
            right,
        }
    ) {
        if(type !== 'number_compare_oper') {
            throw new Error('invalid type')
        }
        this.operator = value
        this.left = Factory.createObject(left)
        this.right = Factory.createObject(right)
    }

    toString() {
        return this.left + " " + this.operator + " " + this.right
    }


}

class MathOperation {

    constructor(
        {
            type,
            value,
            left,
            right,
        }
    ) {
        if(type !== 'math_operation') {
            throw new Error('invalid type')
        }

        // console.log(value);
        // validate operator
        if(value !== '+' && value !== '-' && value !== '*' && value !== '/') {
            throw new Error('invalid operator')
        }

        // console.log(left);
        // console.log(right);
        this.operator = value
        this.left = Factory.createObject(left)
        this.right = Factory.createObject(right)
    }

    toString() {
        return this.left + " " + this.operator + " " + this.right
    }
}

class FloatCompareOperator {

    constructor(
        {
            type,
            value,
            left,
            right,
        }
    ) {
        if(type !== 'float_compare_oper') {
            throw new Error('invalid type')
        }
        this.operator = value
        this.left = Factory.createObject(left)
        this.right = Factory.createObject(right)
    }

    toString() {
        return this.left + " " + this.operator + " " + this.right
    }

}


class BooleanCompareOperator {
    constructor(
        {
            type,
            value,
            left,
            right,
        }
    ) {
        if(type !== 'boolean_compare_oper') {
            throw new Error('invalid type')
        }

        // validate operator
        if(value !== '==' && value !== '!=') {
            throw new Error('invalid operator')
        }

        this.operator = value
        this.left = Factory.createObject(left)
        this.right = Factory.createObject(right)
    }

    toString() {
        return this.left + " " + this.operator + " " + this.right
    }
}

class VariableAssignment {
    constructor(
        {
            type,
            variable,
            value,
        }
    )

    {
        if(type !== 'variable_assignment') {
            throw new Error('invalid type')
        }
        this.name = variable.name
        this.value = Factory.createObject(value)
    }

    toString() {
        return this.name + " = " + this.value
    }
}

class Variable {
    constructor(
        {
            type,
            name,
            negative,
        }
    ) {
        if(type !== 'variable') {
            throw new Error('invalid type')
        }
        this.name = name

        switch (negative) {
            case undefined:
                this.negative = ""
                break;
            case true:
                this.negative = "-"
                break;
            case false:
                this.negative = ""
                break;
            default:
                throw new Error('invalid negative')
        }
    }
    
    toString() {
        return this.negative+this.name
    }
}

class UtilityFunction {
    constructor(
        {
            type,
            functionName,
            value1,
            value2,
        }
    ) {
        if(type !== 'utility_function') {
            throw new Error('invalid type')
        }
        switch (functionName) {
            case 'max':
                this.functionName = 'Max'
                break;
            case 'min':
                this.functionName = 'Min'
                break;
            case 'abs':
                this.functionName = 'Abs'
                break;
            default:
                throw new Error('invalid functionName')
        }

        if (value1 !== undefined) {
            this.value1 = Factory.createObject(value1)
        }
        if (value2 !== undefined) {
            this.value2 = Factory.createObject(value2)
        }
    }

    toString() {

        if (this.value2 !== undefined && this.value1 !== undefined){
            return this.functionName + "(" + this.value1 + ", " + this.value2 + ")"
        }else if (this.value1 !== undefined) {
            return this.functionName + "(" + this.value1 + ")"
        }else if (this.value2 !== undefined) {
            return this.functionName + "(" + this.value2 + ")"
        }else{
            return this.functionName + "()"
        }
    }
}


// export classes
module.exports = {
    Factory,
    MetaFunction,
    Constant,
    NumberCompareOperator,
    FloatCompareOperator,
    ParamFunction,
    MathOperation,
    BooleanCompareOperator,
    ConditionOerator,
    VariableAssignment,
}