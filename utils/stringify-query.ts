var encodeReserveRE = /[!'()*]/g;
var encodeReserveReplacer = function (c: string) {
    return "%" + c.charCodeAt(0).toString(16);
};
var commaRE = /%2C/g;
var encode = function (str: string) {
    return encodeURIComponent(str).replace(encodeReserveRE, encodeReserveReplacer).replace(commaRE, ",");
};

export function stringifyQuery(obj: any) {
    var res = obj ? Object.keys(obj).map(function (key) {
        var val = obj[key];
        if (val === void 0) {
            return "";
        }
        if (val === null) {
            return encode(key);
        }
        if (Array.isArray(val)) {
            var result: any = [];
            val.forEach(function (val2) {
                if (val2 === void 0) {
                    return;
                }
                if (val2 === null) {
                    result.push(encode(key));
                } else {
                    result.push(encode(key) + "=" + encode(val2));
                }
            });
            return result.join("&");
        }
        return encode(key) + "=" + encode(val);
    }).filter(function (x) {
        return x.length > 0;
    }).join("&") : null;
    return res ? "?" + res : "";
}