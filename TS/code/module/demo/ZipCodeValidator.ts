import { StringValidator } from './StringValidator';

export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
        const numberRegexp = /^[0-9]+$/;
        return s.length === 5 && numberRegexp.test(s);
    }
}
