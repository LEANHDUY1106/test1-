import UserApp from "@shared/models/UserApp";

export interface GroupApp {
    code: string | undefined;
    name: string | undefined;
    userApps: UserApp[] | undefined;
}