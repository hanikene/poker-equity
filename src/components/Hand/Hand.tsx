import React, { useState } from "react";
import { CardPicker, Card } from "..";
import { Card as CardInterface, CardOrUndefined } from "../../types";
import "./Hand.css";

interface HandProps {
  allCards: CardInterface[];
  cards: CardOrUndefined[];
  id: number;
  winRate: number;
  simulateHand: () => void;
  stopSimulateHand: () => void;
  changeHand: (
    handId: number,
    pickedCardName: string | undefined,
    cardIdx: number
  ) => void;
}

const Hand = ({
  stopSimulateHand,
  simulateHand,
  id,
  changeHand,
  cards,
  winRate,
  allCards,
}: HandProps) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [nextCardToChange, setNextCardToChange] = useState(0);

  const openPicker = () => {
    setIsPickerOpen(true);
    setNextCardToChange(0);
    stopSimulateHand();
  };

  const closePicker = () => {
    setIsPickerOpen(false);
    simulateHand();
  };

  const handleChangeHand = (
    e: React.MouseEvent<HTMLElement>,
    cardName: string
  ) => {
    e.preventDefault();
    changeHand(id, cardName, nextCardToChange);
    let cardId = nextCardToChange;
    if (nextCardToChange === cards.length - 1) {
      cardId = 0;
    } else {
      cardId++;
    }
    setNextCardToChange(cardId);
  };

  const removeActiveCards = () => {
    cards.forEach((_card, cardId) => {
      changeHand(id, undefined, cardId);
    });
    setNextCardToChange(0);
  };

  const changeNextCardToChange = (id: number) => {
    setNextCardToChange(id);
  };

  const cardsRender = cards.map((card, cardId) => (
    <Card
      key={cardId}
      name={card ? card.name : "none"}
      openPicker={openPicker}
    />
  ));

  return (
    <div className="Hand">
      <CardPicker
        cards={allCards}
        activeCards={cards}
        closePicker={closePicker}
        nextCardToChange={nextCardToChange}
        handleClick={handleChangeHand}
        removeActiveCards={removeActiveCards}
        changeNextCardToChange={changeNextCardToChange}
        isPickerOpened={isPickerOpen}
      />
      {cardsRender}
      <h2 className="Hand_winRate">{winRate}%</h2>
    </div>
  );
};

export default Hand;
