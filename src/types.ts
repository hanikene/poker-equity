export enum Combinations {
  QuintFlush = 8,
  Four = 7,
  FullHouse = 6,
  Flush = 5,
  Quint = 4,
  Three = 3,
  DoublePair = 2,
  Pair = 1,
  HighCard = 0,
}
export enum Value {
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5,
  Six = 6,
  Seven = 7,
  Eight = 8,
  Nine = 9,
  Ten = 10,
  Jack = 11,
  Queen = 12,
  King = 13,
  As = 14,
}

export type Color = "spade" | "club" | "heart" | "diamond";

export interface Card {
  name: string;
  color: Color;
  value: Value;
  taken: boolean;
}

export type CardOrUndefined = Card | undefined;

export interface Hand {
  id: number;
  cards: CardOrUndefined[];
  winRate: number;
}

export interface Score {
  combination: Combinations;
  kickers: number[];
}

export function isCard(obj: any): obj is Card {
  return (
    typeof obj?.name === "string" &&
    typeof obj?.color === "string" &&
    typeof obj?.value === "number" &&
    typeof obj?.taken === "boolean"
  );
}

export function isColor(obj: any): obj is Color {
  return (
    obj === "spade" || obj === "heart" || obj === "diamond" || obj === "club"
  );
}

export function isValue(obj: any): obj is Value {
  return typeof obj === "number" && obj >= 2 && obj <= 14;
}
