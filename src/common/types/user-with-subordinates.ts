import {User} from "@prisma/client";

export interface UserWithSubordinates extends User {
    subordinates?: UserWithSubordinates[];
}