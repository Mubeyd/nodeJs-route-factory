import { Request, Response } from "express";
import { db } from "../app";

export function auth(requiredRole: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value;
        descriptor.value = function (...args: any[]) {
            const req = args[0] as Request;
            const res = args[1] as Response;

            const entityName = req.baseUrl.replace("/", "");
            const authHeader = req.headers.authorization;

            // Did the user pass the authentication
            if (!authHeader) return res.status(403).send("Not authorized");

            // Is this valid user with valid password
            if (!isValidUser(authHeader)) return res.status(403).send("Invalid user or password");

            // Does user possess the right role
            if (!doesUserHasPermissions(entityName, requiredRole, authHeader)) return res.status(403).send("User does not have permission");

            original.apply(this, args);
        };
    };
}

interface UserDetails {
    username: string;
    password: string;
}

function getUserDetails(authHeader: string): UserDetails {
    const base64Auth = (authHeader || "").split(" ")[1] || "";
    const strAuth = Buffer.from(base64Auth, "base64").toString();
    const splitIndex = strAuth.indexOf(":");
    const username = strAuth.substring(0, splitIndex);
    const password = strAuth.substring(splitIndex + 1);

    return {
        username,
        password,
    };
}

function isValidUser(authHeader: string): boolean {
    const userDetails = getUserDetails(authHeader);
    const users = db.getData("/users");

    if (!users.hasOwnProperty(userDetails.username)) return false;

    if (users[userDetails.username].password !== userDetails.password) return false;

    return true;
}

function doesUserHasPermissions(entityName: string, requiredRole: string, authHeader: string): boolean {
    const users = db.getData("/users");
    const userDetails = getUserDetails(authHeader);
    const userRoles = users[userDetails.username].permissions[entityName];

    if (!userRoles) return false;

    if (userRoles && userRoles.indexOf(requiredRole) > -1) return true;

    return false;
}
