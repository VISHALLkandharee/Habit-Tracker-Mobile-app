import  mongoose, {Document} from "mongoose";

export interface User extends Document {
    name:string;
    email:string;
    password:string;
    role : 'user' | 'admin';
    avatar:string;
    createdAt:Date;
    refreshToken?:string;
    comparePassword(password:string):Promise<boolean>;
}
