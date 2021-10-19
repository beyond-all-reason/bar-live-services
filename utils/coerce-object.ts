import Ajv from "ajv";
import addFormats from "ajv-formats";
import _ from "lodash";

const ajv = addFormats(new Ajv({
    coerceTypes: "array",
    allErrors: true,
    strict: false,
    useDefaults: true
}), [
    'date-time',
    'time',
    'date',
    'email',
    'hostname',
    'ipv4',
    'ipv6',
    'uri',
    'uri-reference',
    'uuid',
    'uri-template',
    'json-pointer',
    'relative-json-pointer',
    'regex'
]).addKeyword('kind').addKeyword('modifier');

export function coerceObjectFactory(schema: any) {
    const validate = ajv.compile(schema);

    return function (obj: any): any {
        const data = _.cloneDeep(obj);
        validate(data);
        if (validate.errors && validate.errors.length) {
            console.log(validate.errors);
        }
        return data;
    }
}