import { entity, id, isEmail, isInteger, length, persist, required, isPhone } from "../decorators/index";
import BaseEntity from "./BaseEntity";

@entity("people")
export default class Person extends BaseEntity {
    @id
    id: string;

    @required
    @persist
    @length(3, 100)
    firstName: string;

    @required
    @persist
    @length(3, 100)
    lastName: string;

    @isEmail
    @required
    @persist
    email: string;

    @persist
    department: string;

    @required
    @persist
    @isPhone
    mobileNumber: string;

    @required
    @persist
    @isInteger(1, 120)
    age: number;
}
