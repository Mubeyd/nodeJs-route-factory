import { Request, Response } from "express";

export function logRoute(
    target: any,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor
) {
    const original = propertyDescriptor.value;
    propertyDescriptor.value = function (...args: any[]) {
        const req = args[0] as Request;
        const res = args[1] as Response;

        original.apply(this, args);

        console.log(
            `${req.ip} [${new Date().toISOString()}] ${req.host} ${
                req.originalUrl
            } ${req.method} ${res.statusCode} ${res.statusMessage} HTTP/${
                req.httpVersion
            }`
        );

        if (["POST", "PUT"].indexOf(req.method) > -1) {
            console.log(`\tBody: ${JSON.stringify(req.body)}`);
        }
    };
}
