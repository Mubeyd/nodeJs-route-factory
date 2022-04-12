import "reflect-metadata";
import validator from "validator";

type ValidationFunction = (target: any, propertyKey: string, validatorOptions?: any) => string | void;

interface ValidationRule {
    validationOptions?: any;
    validator: ValidationFunction;
}

function addValidation(target: any, propertyKey: string, validator: ValidationFunction, validationOptions?: any) {
    // Make sure we have the list of all the properties for the object
    let objectProperties: string[] = Reflect.getMetadata("validation:properties", target) || [];
    if (!objectProperties.includes(propertyKey)) {
        objectProperties.push(propertyKey);
        Reflect.defineMetadata("validation:properties", objectProperties, target);
    }

    // Make sure we capture validation rule
    let validationRules: ValidationRule[] = Reflect.getMetadata("validation:rules", target, propertyKey) || [];
    let validationRule: ValidationRule = {
        validator,
        validationOptions,
    };

    validationRules.push(validationRule);
    Reflect.defineMetadata("validation:rules", validationRules, target, propertyKey);
}

// Validator Functions

function emailValidator(target: any, propertyKey: string) {
    let value = target[propertyKey];
    if (value == null) {
        return;
    }

    const isValid = validator.isEmail(value);
    if (!isValid) {
        return `The property ${propertyKey} must be a valid email`;
    }
    return;
}

// Decorators

export function isEmail(target: any, propertyKey: string) {
    addValidation(target, propertyKey, emailValidator);
}
