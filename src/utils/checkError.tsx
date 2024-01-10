"use client";
import { Dispatch, SetStateAction } from "react";
import { ItokenAttributes } from "@/type/Nftmngr";

const CheckErrorI = async (
  str: string,
  setErrorMessage: Dispatch<SetStateAction<string>>,
  att4: ItokenAttributes[],
  att5: ItokenAttributes[],
  currentName: string,
  isState: number
) => {
  if (!str) {
    setErrorMessage("Not Availible");
    return true;
  } else if (containsSame(str, att4, att5, currentName, isState)) {
    setErrorMessage("Name can't be same");
    return true;
  } else if (containsSpecialChars(str)) {
    setErrorMessage("Special characters are not allowed");
    return true;
  } else if (containsSpace(str)) {
    setErrorMessage("Space are not allowed");
    return true;
  } else if (containsUppercase(str)) {
    setErrorMessage("Uppercase are not allowed");
    return true;
  } else {
    setErrorMessage("");
    return false;
  }
};

export const CheckErrorII = async (
  str: string,
  setErrorMessage: Dispatch<SetStateAction<string>>,
  att4: ItokenAttributes[],
  att5: ItokenAttributes[],
) => {
  if (!str) {
    setErrorMessage("Not Availible");
    return true;
  } else if (containsSameII(str, att4, att5)) {
    setErrorMessage("Name can't be same");
    return true;
  } else if (containsSpecialChars(str)) {
    setErrorMessage("Special characters are not allowed");
    return true;
  } else if (containsSpace(str)) {
    setErrorMessage("Space are not allowed");
    return true;
  } else if (containsUppercase(str)) {
    setErrorMessage("Uppercase are not allowed");
    return true;
  } else {
    setErrorMessage("");
    return false;
  }
};

function containsSame(
  str: string,
  att4: ItokenAttributes[],
  att5: ItokenAttributes[],
  currentName: string,
  isState: number
) {
  const filteredArray4 = att4.filter((item) => item.name === str);
  const filteredArray5 = att5.filter((item) => item.name === str);

  if (isState === 4) {
    if (str === currentName) {
      if (filteredArray4.length > 1) {
        return true;
      }
      if (filteredArray5.length > 0) {
        return true;
      }
      return false;
    }
    if (filteredArray4.length > 0) {
      return true;
    }
    if (filteredArray5.length > 0) {
      return true;
    }
    return false;
  }

  if (isState === 5) {
    if (str === currentName) {
      if (filteredArray5.length > 1) {
        return true;
      }
      if (filteredArray4.length > 0) {
        return true;
      }
      return false;
    }
    if (filteredArray5.length > 0) {
      return true;
    }
    if (filteredArray4.length > 0) {
      return true;
    }
    return false;
  }
  return false;
}

function containsSameII(
  str: string,
  att4: ItokenAttributes[],
  att5: ItokenAttributes[]
) {
  const filteredArray4 = att4.filter((item) => item.name === str);
  const filteredArray5 = att5.filter((item) => item.name === str);

  if (filteredArray4.length > 0) {
    return true;
  }
  if (filteredArray5.length > 0) {
    return true;
  }
  return false;
}

function containsSpecialChars(str: string) {
  // const specialChars = /[`!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
  const specialChars = /[`!@#$%^&*()+\-=[\]{};':"\\|,.<>?~]/;
  return specialChars.test(str);
}

function containsSpace(str: string) {
  const specialChars = / /;
  return specialChars.test(str);
}

function containsUppercase(str: string) {
  return /[A-Z]/.test(str);
}

export default CheckErrorI;
