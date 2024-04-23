import * as moment from "moment";

export default class Utils {
    static capitalize(value:string): string {
        let first = value.substr(0,1).toUpperCase();
        return first + value.substr(1);
    }
    static getUniqueId(parts: number = 4): string {
        const stringArr = [];
        for(let i = 0; i< parts; i++){
          const S4 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
          stringArr.push(S4);
        }
        return stringArr.join('-');
    }


}

