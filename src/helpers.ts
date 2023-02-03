import {
  Card,
  CardOrUndefined,
  Color,
  Combinations,
  Hand,
  isCard,
  isColor,
  isValue,
  Score,
  Value,
} from "./types";
const SPOT_CARDS_IN_TABLE = 5;

const getRandomItemIndex = (arr: any[]): number =>
  Math.floor(Math.random() * arr.length);

export const generateDeclaredSpotCards = (spotCards: CardOrUndefined[]) => {
  let declaredSpotCards: Card[] = [];
  spotCards.forEach((card) => {
    if (isCard(card)) declaredSpotCards.push(card);
  });
  return declaredSpotCards;
};

export const generateDeclaredHands = (hands: Hand[]) => {
  let declaredHands: Card[][] = [];
  hands.forEach((hand) => {
    const [card0, card1] = hand.cards;
    if (card0 && card1) {
      declaredHands.push([card0, card1]);
    }
  });
  return declaredHands;
};

export const generateRemainingSportCardsInGame = (
  rc: Card[],
  dsc: Card[]
): Card[] => {
  const remainingCards = [...rc];
  const declaredSpotCards = [...dsc];
  for (let SCindex = 0; SCindex < SPOT_CARDS_IN_TABLE; SCindex++) {
    if (!declaredSpotCards[SCindex]) {
      const randomCardIndex = getRandomItemIndex(remainingCards);
      declaredSpotCards.push(remainingCards[randomCardIndex]);
      remainingCards.splice(randomCardIndex, 1);
    }
  }
  return declaredSpotCards;
};

export const compareHands = (
  spot: Card[],
  hands: Card[][]
): ("win" | "lose")[] => {
  const scores = hands.map((hand) => checkHandCombination(spot, hand));
  const results: ("win" | "lose")[] = Array(hands.length).fill(undefined);
  scores.forEach((score, playerId) => {
    if (results[playerId] !== "lose") {
      scores.forEach((adversaryScore, advId) => {
        if (playerId < advId && results[playerId] !== "lose") {
          if (score.combination < adversaryScore.combination) {
            results[playerId] = "lose";
            results[advId] = "win";
          } else if (score.combination > adversaryScore.combination) {
            results[playerId] = "win";
            results[advId] = "lose";
          } else {
            let endLoop = false;
            score.kickers.forEach((kicker, kickerId) => {
              if (!endLoop && kicker < adversaryScore.kickers[kickerId]) {
                results[playerId] = "lose";
                results[advId] = "win";
                endLoop = true;
              } else if (
                !endLoop &&
                kicker > adversaryScore.kickers[kickerId]
              ) {
                results[playerId] = "win";
                results[advId] = "lose";
                endLoop = true;
              }
            });
            if (!endLoop) {
              results[playerId] = "win";
              results[advId] = "win";
            }
          }
        }
      });
    }
  });

  return results;
};

function checkHandCombination(spot: Card[], hand: Card[]): Score {
  const flushScore = checkFlushTypes(spot, hand);
  if (flushScore && flushScore.combination === Combinations.QuintFlush)
    return flushScore;

  const pairScore = checkPairTypes(spot, hand);
  if (pairScore && pairScore.combination === Combinations.Four)
    return pairScore;
  if (pairScore && pairScore.combination === Combinations.FullHouse)
    return pairScore;
  if (flushScore && flushScore.combination === Combinations.Flush)
    return flushScore;

  const quintScore = checkQuint(spot, hand);
  if (quintScore && quintScore.combination === Combinations.Quint)
    return quintScore;
  return pairScore;
}

function checkFlushTypes(spot: Card[], hand: Card[]): Score | false {
  const allCards = spot.concat(hand);
  const colors = {
    spade: 0,
    heart: 0,
    diamond: 0,
    club: 0,
  };
  allCards.forEach((card) => {
    colors[card.color]++;
  });

  let theColor: Color | undefined;
  for (const [color, amount] of Object.entries(colors)) {
    if (amount > 4 && isColor(color)) theColor = color;
  }
  if (!theColor) return false;

  const coloredCards = allCards
    .filter((card) => card.color === theColor)
    .sort((a, b) => b.value - a.value);

  let score: Score;
  coloredCards.forEach((card, cIdx) => {
    if (
      !score &&
      card.value > Value.Five &&
      coloredCards[cIdx + 1] &&
      coloredCards[cIdx + 1].value === card.value - 1 &&
      coloredCards[cIdx + 2] &&
      coloredCards[cIdx + 2].value === card.value - 2 &&
      coloredCards[cIdx + 3] &&
      coloredCards[cIdx + 3].value === card.value - 3 &&
      coloredCards[cIdx + 4] &&
      coloredCards[cIdx + 4].value === card.value - 4
    ) {
      score = {
        combination: Combinations.QuintFlush,
        kickers: [card.value],
      };
    } else if (
      !score &&
      card.value === Value.Five &&
      coloredCards[cIdx + 1] &&
      coloredCards[cIdx + 1].value === Value.Four &&
      coloredCards[cIdx + 2] &&
      coloredCards[cIdx + 2].value === Value.Three &&
      coloredCards[cIdx + 3] &&
      coloredCards[cIdx + 3].value === Value.Two &&
      coloredCards[0].value === Value.As
    ) {
      score = {
        combination: Combinations.QuintFlush,
        kickers: [Value.Five],
      };
    }
  });
  if (score!) return score;
  return {
    combination: Combinations.Flush,
    kickers: coloredCards.slice(0, 5).map((card) => card.value),
  };
}

function checkPairTypes(spot: Card[], hand: Card[]): Score {
  const allCards = spot.concat(hand);
  const allValuesObj: Record<Value, number> = {
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0,
    "6": 0,
    "7": 0,
    "8": 0,
    "9": 0,
    "10": 0,
    "11": 0,
    "12": 0,
    "13": 0,
    "14": 0,
  };
  const allValuesArr: Value[] = [];
  let theFour: number | undefined;
  let theThree: number | undefined;
  let thePairs: number[] = [];
  let highCards: number[] = [];

  allCards.forEach((card) => {
    const { value } = card;
    if (isValue(value)) allValuesObj[value]++;
    allValuesArr.push(card.value);
  });

  for (const [value, amount] of Object.entries(allValuesObj)) {
    if (amount === 4 && (!theFour || parseInt(value) > theFour))
      theFour = parseInt(value);
    else if (amount === 1) highCards.push(parseInt(value));
    else if (!theFour) {
      if (amount === 3 && (!theThree || parseInt(value) > theThree)) {
        theThree = parseInt(value);
      } else if (amount === 2) {
        thePairs.push(parseInt(value));
      }
    }
  }
  if (theFour) {
    const kicker = allValuesArr
      .sort((a, b) => b - a)
      .find((value) => value !== theFour);
    return {
      combination: Combinations.Four,
      kickers: [theFour, kicker!],
    };
  }
  thePairs.sort((a, b) => b - a);
  if (theThree && thePairs[0]) {
    return {
      combination: Combinations.FullHouse,
      kickers: [theThree, thePairs[0]],
    };
  }
  if (theThree) {
    const kickers = allValuesArr
      .sort((a, b) => b - a)
      .filter((value) => value !== theThree)
      .slice(0, 2);
    return {
      combination: Combinations.Three,
      kickers: [theThree, ...kickers],
    };
  }
  if (thePairs[1]) {
    const kicker = allValuesArr
      .sort((a, b) => b - a)
      .find((value) => value !== thePairs[0] && thePairs[1]);
    return {
      combination: Combinations.DoublePair,
      kickers: [thePairs[0], thePairs[1], kicker!],
    };
  }
  if (thePairs[0]) {
    const kickers = allValuesArr
      .sort((a, b) => b - a)
      .filter((value) => value !== thePairs[0])
      .slice(0, 3);
    return {
      combination: Combinations.Pair,
      kickers: [thePairs[0], ...kickers],
    };
  }
  return {
    combination: Combinations.HighCard,
    kickers: highCards.sort((a, b) => b - a).slice(0, 5),
  };
}

function checkQuint(spot: Card[], hand: Card[]): Score | false {
  const allCards = spot.concat(hand).sort((a, b) => b.value - a.value);
  let result: Score;

  allCards.forEach((card, cIdx) => {
    if (
      !result &&
      card.value > Value.Five &&
      allCards[cIdx + 1] &&
      allCards[cIdx + 1].value === card.value - 1 &&
      allCards[cIdx + 2] &&
      allCards[cIdx + 2].value === card.value - 2 &&
      allCards[cIdx + 3] &&
      allCards[cIdx + 3].value === card.value - 3 &&
      allCards[cIdx + 4] &&
      allCards[cIdx + 4].value === card.value - 4
    ) {
      result = {
        combination: Combinations.Quint,
        kickers: [card.value],
      };
    } else if (
      !result &&
      card.value === Value.Five &&
      allCards[cIdx + 1] &&
      allCards[cIdx + 1].value === Value.Four &&
      allCards[cIdx + 2] &&
      allCards[cIdx + 2].value === Value.Three &&
      allCards[cIdx + 3] &&
      allCards[cIdx + 3].value === Value.Two &&
      allCards[0].value === 14
    ) {
      result = {
        combination: Combinations.Quint,
        kickers: [Value.Five],
      };
    }
  });

  return result! ?? false;
}
