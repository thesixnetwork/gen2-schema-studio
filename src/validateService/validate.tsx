
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

export function specialCharsTestTraitType(str: string) {
    const specialChars = /[`!@#$%^&*()+\-=\[\]{};':"\\|,<>?~]/;
    return specialChars.test(str);
}

export function dotCountTest(str: string) {
    const dotRegex = /\./g;

    // Check for more than one dot
    const dotCount = (str.match(dotRegex) || []).length;

  
    return (dotCount > 1);
}
