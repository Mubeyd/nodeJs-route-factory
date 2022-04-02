import { entity, id, persist } from "../decorators/index";
import BaseEntity from "./BaseEntity";

@entity('people')
export default class Person extends BaseEntity {
    @id
    id: string;

    @persist
    firstName: string;

    @persist
    lastName: string;

    @persist
    email: string;

    @persist
    department: string;

    @persist
    mobileNumber: string;

    @persist
    age: number;

}