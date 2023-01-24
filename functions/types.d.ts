import { BaseClaims } from "src";

export interface CustomClaims extends BaseClaims {
  email: string;
}
