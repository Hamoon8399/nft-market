import { context, Context } from "near-sdk-core";

@nearBindgen
export class Item {
  public url: string;
  public category: string;
  public description: string;
  public name: string;

  public constructor(
    url: string,
    category: string,
    description: string,
    name: string
  ) {
    this.url = url;
    this.category = category;
    this.description = description;
    this.name = name;
  }
}

@nearBindgen
export class NFT {
  public createdBy: string;
  public createdAt: u64;
  public token: string;
  public item: Item;
  public value: u64;
  public owner: string;
  public sale: u64;

  constructor(createdAt: u64, item: Item, value: u64, token: string) {
    this.createdBy = context.sender;
    this.createdAt = createdAt;
    this.item = item;
    this.value = value;
    this.owner = context.sender;
    this.sale = 0;
    this.token = token;
  }
}
