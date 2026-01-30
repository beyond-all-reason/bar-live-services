import Ajv from "ajv";
import addFormats from "ajv-formats";
import _ from "lodash";
import { IntersectKind } from "@sinclair/typebox";

const ajv = addFormats(new Ajv({
    coerceTypes: "array",
    allErrors: true,
    strict: false,
    useDefaults: true
}), [
    "date-time",
    "time",
    "date",
    "email",
    "hostname",
    "ipv4",
    "ipv6",
    "uri",
    "uri-reference",
    "uuid",
    "uri-template",
    "json-pointer",
    "relative-json-pointer",
    "regex"
]).addKeyword("kind").addKeyword("modifier");

export function coerceObjectFactory(schemas: any) {
    const validate = ajv.compile(schemas);

    // Normalize schemas to an array to make it easier to handle later
    if (schemas.kind === IntersectKind) {
        schemas = schemas.allOf;
    } else {
        schemas = [schemas];
    }

    return function(obj: any): any {
        const data = _.cloneDeep(obj);

        // Handle comma separated query params
        for (const [key, value] of Object.entries(data)) {
            if (typeof value !== "string" || !value.includes(",")) {
                continue;
            }
            const isArray = schemas.some(
                (schemaPart: any) => schemaPart.properties?.[key]?.type === "array"
            );

            if (isArray) {
                data[key] = value.split(",");
            }
        }

        validate(data);
        if (validate.errors && validate.errors.length) {
            console.log(validate.errors);
        }
        return data;
    };
}
