import { entity, id, isEmail, persist, required } from "../decorators/index";
import BaseEntity from "./BaseEntity";

@entity('people')
export default class Person extends BaseEntity {
    @id
    id: string;

    @required
    @persist
    firstName: string;

    @required
    @persist
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