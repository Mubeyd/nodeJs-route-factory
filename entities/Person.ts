import { entity, id, persist } from "../decorators/index";

@entity('people')
export default class Person {
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