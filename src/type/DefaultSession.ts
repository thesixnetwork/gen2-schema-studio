export type ISODateString = string

export interface DefaultSession {
  user?: {
    name?: string | null
    email?: string | null
    accessToken?: string | null
    image?: string | null
    address?: string | null;
    balance?: string | null;
  }
  expires: ISODateString
}