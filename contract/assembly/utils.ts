import { u128 } from "near-sdk-as";

const ONE_NEAR = u128.from("1000000000000000000000000");

export function asYocto(amount: u64): u128 {
  return u128.mul(u128.from(amount), ONE_NEAR);
}

export function asNear(amount: u128): string {
  return u128.div(amount, ONE_NEAR).toString();
}
