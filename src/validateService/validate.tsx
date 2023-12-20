
import React from 'react'


export function uppercaseTest(str: string) {
    return /[A-Z]/.test(str);
}


export function spaceTest(str: string) {
    const specialChars = / /;
    return specialChars.test(str);

}
export function specialCharsTest(str: string) {
    const specialChars = /[`!@#$%^&*()+\-=\[\]{};':"\\|,<>\/?~]/;
    return specialChars.test(str);
}

