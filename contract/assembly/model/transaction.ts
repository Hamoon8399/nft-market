import { Context } from "near-sdk-core";

@nearBindgen
export class Transaction {
  public from: string;
  public to: string;
  public timeStamp: u64;
  public token: string;
  public value: u64;
  public id: string;

  public constructor(
    from: string,
    to: string,
    timeStamp: u64,
    token: string,
    value: u64
  ) {
    this.from = from;
    this.to = to;
    this.timeStamp = timeStamp;
    this.token = token;
    this.value = value;
    this.id = Context.blockTimestamp.toString();
  }
}
