import {StringValidator} from './StringValidator';

export class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string) {
        const lettersRegexp = /^[A-Za-z]+$/;
        return lettersRegexp.test(s);
    }
}
