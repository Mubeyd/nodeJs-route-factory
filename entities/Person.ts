import { entity, id, isEmail, persist, required, length } from "../decorators/index";
import BaseEntity from "./BaseEntity";

@entity('people')
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
    mobileNumber: string;

    @required
    @persist
    age: number;

}