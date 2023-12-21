"use server";

import { cookies } from "next/headers";

export async function setCookie(token: string,name: string) {
  // const oneDay = 24 * 60 * 60 * 1000;
  const oneMinute = 60 * 1000; // 1 minute in milliseconds
  const thirtyMinutes = 30 * oneMinute;
  const expirationTime = new Date(Date.now() + thirtyMinutes);
  // cookies().set("token", `Bearer ${token}`, { maxAge: 5 });
  cookies().set({
    name: name,
    value: `Bearer ${token}`,
    expires: expirationTime,
  });
}