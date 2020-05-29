const compareHands = (spot, hands) => {
  if (spot.length !== 5 || hands.length < 2) {
    return 'error';
  }
  let combinations = hands.map((hand) => checkHandCombination(spot, hand));
  const results = Array(hands.length).fill();
  combinations.forEach((comb, id) => {
    for (let i = 0; i < combinations.length; i++) {
      if (comb.result !== 'lose' && i !== id) {
        if (comb.combinationPower < combinations[i].combinationPower) {
          results[id] = 'lose';
        } else if (comb.combinationPower === combinations[i].combinationPower) {
          if (comb.kicker && comb.kicker < combinations[i].kicker) {
            results[id] = 'lose';
          } else if (comb.kickers) {
            let doneForEach = false;
            comb.kickers.forEach((kicker, kickerId) => {
              if (!doneForEach && kicker < combinations[i].kickers[kickerId]) {
                results[id] = 'lose';
                doneForEach = true;
              } else if (
                !doneForEach &&
                kicker > combinations[i].kickers[kickerId]
              ) {
                doneForEach = true;
              }
            });
          }
        }
      }
    }
  });

  return results.map((result) => {
    if (result !== 'lose') {
      result = 'win';
    }
    return result;
  });
};

function checkHandCombination(spot, hand) {
  let result = checkFlushTypes(spot, hand);
  if (!result || result.combinationPower < 7) {
    let result2 = checkPairTypes(spot, hand);
    if (
      (!result && result2) ||
      (result && result2 && result.combinationPower < result2.combinationPower)
    ) {
      result = result2;
    }

    if (!result || result.combinationPower < 4) {
      let result2 = checkQuintOrHighCard(spot, hand);
      if (
        (!result && result2) ||
        (result &&
          result2 &&
          result.combinationPower < result2.combinationPower)
      ) {
        result = result2;
      }
    }
  }
  return result;
}

function checkFlushTypes(spot, hand) {
  const allCards = spot.concat(hand);
  const colors = { s: 0, h: 0, d: 0, c: 0 };
  allCards.forEach((card) => {
    colors[card.color]++;
  });
  let theColor;
  for (const color in colors) if (colors[color] > 4) theColor = color;
  if (!theColor) return false;

  const coloredCards = allCards
    .filter((card) => card.color === theColor)
    .sort((a, b) => b.value - a.value);

  let result;
  coloredCards.forEach((card) => {
    if (
      !result &&
      card.value > 5 &&
      coloredCards.some((c) => c.value === card.value - 1) &&
      coloredCards.some((c) => c.value === card.value - 2) &&
      coloredCards.some((c) => c.value === card.value - 3) &&
      coloredCards.some((c) => c.value === card.value - 4)
    ) {
      if (card.value === 14) {
        result = { combinationPower: 9 };
      } else {
        result = {
          combinationPower: 8,
          kicker: card.value,
        };
      }
    } else if (
      !result &&
      card.value === 5 &&
      coloredCards.some((c) => c.value === 4) &&
      coloredCards.some((c) => c.value === 3) &&
      coloredCards.some((c) => c.value === 2) &&
      coloredCards.some((c) => c.value === 14)
    ) {
      result = {
        combinationPower: 8,
        kicker: card.value,
      };
    }
  });
  if (result) return result;
  return {
    combinationPower: 5,
    kickers: coloredCards.slice(0, 5).map((card) => card.value),
  };
}

function checkPairTypes(spot, hand) {
  const allCards = spot.concat(hand);
  const allValues = {
    '2': 0,
    '3': 0,
    '4': 0,
    '5': 0,
    '6': 0,
    '7': 0,
    '8': 0,
    '9': 0,
    '10': 0,
    '11': 0,
    '12': 0,
    '13': 0,
    '14': 0,
  };
  let theThree;
  let thePair;
  let theSecondPair;
  const kickersArray = [];

  allCards.forEach((card) => {
    allValues[card.value]++;
  });

  let theFour;
  for (const value in allValues) {
    if (allValues[value] > 3) {
      theFour = parseInt(value);
    }
  }
  if (theFour) {
    for (const value in allValues) {
      if (parseInt(value) !== theFour && allValues[value] > 0) {
        kickersArray.push(parseInt(value));
      }
    }

    return {
      combinationPower: 7,
      kicker: [theFour, kickersArray[kickersArray.length - 1]],
    };
  }

  for (const value in allValues) {
    if (allValues[value] > 2) {
      theThree = parseInt(value);
    }
  }
  for (const value in allValues)
    if (allValues[value] > 1 && parseInt(value) !== theThree) {
      thePair = parseInt(value);
    }

  if (theThree && thePair) {
    return {
      combinationPower: 6,
      kickers: [theThree, thePair],
    };
  }
  if (theThree) {
    for (const value in allValues) {
      if (parseInt(value) !== theThree && allValues[value] > 0) {
        kickersArray.push(parseInt(value));
      }
    }

    return {
      combinationPower: 3,
      kicker: [
        theThree,
        ...kickersArray
          .slice(kickersArray.length - 2, kickersArray.length)
          .reverse(),
      ],
    };
  }

  if (!thePair) {
    return false;
  }

  for (const value in allValues) {
    if (allValues[value] > 1 && parseInt(value) !== thePair) {
      theSecondPair = parseInt(value);
    }
  }

  for (const value in allValues) {
    if (
      parseInt(value) !== thePair &&
      (!theSecondPair || parseInt(value) !== theSecondPair) &&
      allValues[value] > 0
    ) {
      kickersArray.push(parseInt(value));
    }
  }

  if (theSecondPair) {
    return {
      combinationPower: 2,
      kickers: [thePair, theSecondPair, kickersArray[kickersArray.length - 1]],
    };
  } else {
    return {
      combinationPower: 1,
      kickers: [
        thePair,
        ...kickersArray
          .slice(kickersArray.length - 3, kickersArray.length)
          .reverse(),
      ],
    };
  }
}

function checkQuintOrHighCard(spot, hand) {
  const allCards = spot.concat(hand).sort((a, b) => b.value - a.value);
  let result;

  allCards.forEach((card) => {
    if (
      !result &&
      card.value > 5 &&
      allCards.some((c) => c.value === card.value - 1) &&
      allCards.some((c) => c.value === card.value - 2) &&
      allCards.some((c) => c.value === card.value - 3) &&
      allCards.some((c) => c.value === card.value - 4)
    ) {
      result = {
        combinationPower: 4,
        kicker: card.value,
      };
    } else if (
      !result &&
      card.value === 5 &&
      allCards.some((c) => c.value === 4) &&
      allCards.some((c) => c.value === 3) &&
      allCards.some((c) => c.value === 2) &&
      allCards.some((c) => c.value === 14)
    ) {
      result = {
        combinationPower: 4,
        kicker: card.value,
      };
    }
  });

  return result
    ? result
    : {
        combinationPower: 0,
        kickers: allCards.map((card) => card.value).slice(0, 5),
      };
}

export default compareHands;
