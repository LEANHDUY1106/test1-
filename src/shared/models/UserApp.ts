export default interface UserApp {
    items: UserApp[] | undefined;
    id: number | undefined;
    code: string | undefined;
    description: string | undefined;
    displayName: string | undefined;
    parentCode: string | undefined;
    orders: string | undefined;
    host: string | undefined;
    prefix: string | undefined;
    path: string | undefined;
    imgPath: string | undefined;
    shortName: string | undefined;   
    appGroupCode: string | undefined;
    appGroupName: string | undefined; 
}