import mongoose, {Document} from "mongoose";

export interface Habit extends Document {
    title:string;
    description:string;
    status:'active' | 'maintenance';
    user:mongoose.Types.ObjectId;
    reminderTime: string;
    icon:string;
    color:string;
    currentStreak?: number;
    longestStreak?: number;
    CompletedDates?: Date[];
    createdAt:Date;
    updatedAt:Date;
}