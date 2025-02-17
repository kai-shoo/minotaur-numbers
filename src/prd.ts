// /src/lib/PRDWithCookies.js
import { parse, serialize } from 'cookie';

const EPSILON = 0.0000001; // Define epsilon
//Define ABS min and ceil
const abs = Math.abs,
    min = Math.min,
    ceil = Math.ceil,
    floor = Math.floor,
    rand = Math.random

/**
 * Calculate for P(C)
 * @param {Number} c - The C constant
 */
function PfromC(c: number){
    let ppon = 0., ppbn = 0.;
    let sum = 0.;

    let fails = ceil(1/c);

    for(let n = 1; n <= fails; n++){
        ppon = min(1, n * c) * (1 - ppbn);
        ppbn += ppon;

        sum += (n * ppon);
    }

    return 1/sum;
}

function CfromP(p: number){
    let hi = p,
        lo = 0.,
        mid = 0.,
        p1 = 0., p2 = 1.;

    while(1){
        mid = (hi + lo)*0.5;
        p1 = PfromC(mid);
        if(abs(p1 - p2) <= EPSILON) break;

        if(p1 > p){
            hi = mid;
        } else {
            lo = mid;
        }

        p2 = p1;
    }

    return mid;
}

export default class PRD {
    private chance: number;
    private C: number;
    private storageKey: string;

    constructor(chance: number, storageKey: string) {
        this.chance = chance;
        this.C = CfromP(chance);
        this.storageKey = storageKey;  // Add this line to set the key
    }

    getProgress(astro) {
        const cookieHeader = astro.request.headers.get('cookie') || ''; // Retrieve cookie
        const cookies = parse(cookieHeader);
        return parseInt(cookies[this.storageKey] || "1", 10);

    }

    setProgress(astro, progress) {
        const cookieValue = String(progress); // Progress number
        const cookieOptions = {
            path: '/', // Should apply to whole site
            httpOnly: false, // Let JS read/write the value.
            maxAge: 31536000 // expires in 1 year
        };

        // Set on header
        astro.response.headers.set('Set-Cookie', serialize(this.storageKey, cookieValue, cookieOptions));
    }

    next(astro) {
        let progress = this.getProgress(astro);

        let r = rand(); // Gen random number

        if (r < progress * this.C) {
            this.setProgress(astro, 1);
            return true; // Drop success
        }

        progress++;
        this.setProgress(astro, progress);
        return false;
    }

    reset(astro) {
        this.setProgress(astro, 1); // Start progress at a value of 1
    }
}
