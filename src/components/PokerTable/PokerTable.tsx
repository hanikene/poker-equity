import React, { useState } from "react";
import { Spot, Hand } from "..";
import allCards from "../../assets/cards";
import {
  compareHands,
  generateDeclaredHands,
  generateDeclaredSpotCards,
  generateRemainingSportCardsInGame as generateRemainingSpotCardsInGame,
} from "../../helpers";
import { Card, CardOrUndefined, Hand as HandInterface } from "../../types";
import "./PokerTable.css";
const NUMBER_OF_SIMULATIONS = 1000000;
const SIMULATIONS_PER_RENDER = 100;

let simulationId: number;

const PokerTable: React.FC = () => {
  const [cards, setCards] = useState(allCards);
  const [hands, setHands] = useState<HandInterface[]>([
    {
      id: 0,
      cards: Array(2).fill(undefined),
      winRate: 0,
    },
    {
      id: 1,
      cards: Array(2).fill(undefined),
      winRate: 0,
    },
  ]);
  const [spotCards, setSpotCards] = useState<CardOrUndefined[]>(
    Array(4).fill(undefined)
  );

  const stopSimulateHand = () => {
    clearTimeout(simulationId);
    const resetHands = hands.map((hand) => ({ ...hand, winRate: 0 }));
    setHands(resetHands);
  };

  const simulateHand = () => {
    const declaredSpotCards = generateDeclaredSpotCards(spotCards);
    const declaredHands = generateDeclaredHands(hands);
    const remainingCards = cards.filter((card) => !card.taken);

    if (declaredHands.length > 1) {
      let wins: number[] = Array(declaredHands.length).fill(0);
      let simulationIndex = 0;

      const processSimulation = () => {
        simulationId = setTimeout(() => {
          const declaredSpotCardsInGame = generateRemainingSpotCardsInGame(
            remainingCards,
            declaredSpotCards
          );
          const results = compareHands(declaredSpotCardsInGame, declaredHands);
          results.forEach((result, playerId) => {
            if (result === "win") {
              wins[playerId]++;
            }
            if (simulationIndex % SIMULATIONS_PER_RENDER === 0) {
              const winRate = wins[playerId] / (simulationIndex + 1);
              const updatedHands = [...hands];
              updatedHands[playerId].winRate = Math.floor(winRate * 100);
              setHands(updatedHands);
            }
          });

          simulationIndex++;
          if (simulationIndex < NUMBER_OF_SIMULATIONS) processSimulation();
        }, 0);
      };

      processSimulation();
    }
  };

  const changeHandCard = (
    handId: number,
    pickedCardName: string | undefined,
    cardIdx: number
  ) => {
    let pickedCard: Card | undefined = undefined;
    const updatedCards = cards.map((card) => {
      if (
        hands[handId]?.cards[cardIdx]?.name &&
        hands[handId].cards[cardIdx]!.name === card.name
      ) {
        card.taken = false;
      } else if (card.name === pickedCardName) {
        card.taken = true;
        pickedCard = { ...card };
      }
      return card;
    });

    const updatedHands = [...hands];
    updatedHands[handId].cards[cardIdx] = pickedCard;

    setCards(updatedCards);
    setHands(updatedHands);
  };

  const changeSpotCard = (
    pickedCardName: string | undefined,
    cardIdx: number
  ) => {
    let pickedCard: Card | undefined = undefined;
    const updatedCards = cards.map((card) => {
      if (spotCards[cardIdx]?.name && spotCards[cardIdx]?.name === card.name) {
        card.taken = false;
      } else if (card.name === pickedCardName) {
        card.taken = true;
        pickedCard = { ...card };
      }
      return card;
    });
    setCards(updatedCards);
    setSpotCards((sc) => {
      sc[cardIdx] = pickedCard;
      return sc;
    });
  };

  const addHand = () => {
    setHands([
      ...hands,
      {
        id: hands.length,
        cards: Array(2).fill(undefined),
        winRate: 0,
      },
    ]);
  };

  const removeHand = () => {
    let updatedHands = [...hands];
    let updatedCards = cards.map((card) => {
      updatedHands[updatedHands.length - 1].cards.forEach((handCard) => {
        if (handCard !== undefined && handCard.name === card.name) {
          card.taken = false;
        }
      });
      return card;
    });
    updatedHands.pop();
    setHands(updatedHands);
    setCards(updatedCards);
    stopSimulateHand();
    simulateHand();
  };

  const handsRender = hands.map((hand) => (
    <Hand
      key={hand.id}
      id={hand.id}
      cards={hand.cards}
      winRate={hand.winRate}
      allCards={allCards}
      changeHand={changeHandCard}
      simulateHand={simulateHand}
      stopSimulateHand={stopSimulateHand}
    />
  ));

  return (
    <div className="PokerTable">
      <h1>Poker Equity</h1>
      <Spot
        flopCards={spotCards.slice(0, 3)}
        turnCard={[spotCards[3]]}
        changeSpotCard={changeSpotCard}
        allCards={cards}
        simulateHand={simulateHand}
        stopSimulateHand={stopSimulateHand}
      />
      {handsRender}
      <div className="buttons-container">
        {hands.length < 4 ? (
          <button className="button button-white" onClick={addHand}>
            add hand
          </button>
        ) : (
          <button className="button button-white disable">add hand</button>
        )}
        {hands.length > 2 ? (
          <button className="button button-red" onClick={removeHand}>
            remove hand
          </button>
        ) : (
          <button className="button button-red disable">remove hand</button>
        )}
      </div>
    </div>
  );
};

export default PokerTable;
