import { stringify } from "node:querystring";

export function Convert (duration: number): string {
    const hours =  Math.floor(duration/3600);
    const minutes = Math.floor((duration % 3600)/60);
    const seconds = duration % 60;

    const result = [hours, minutes, seconds].map(unit => String(unit).padStart(2, '0')).join(':');


    return result;
}