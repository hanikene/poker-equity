import React, { useState, useMemo } from "react";
import { Card, CardPicker } from "..";
import { Card as CardInterface, CardOrUndefined } from "../../types";
import "./Spot.css";

interface SpotProps {
  flopCards: CardOrUndefined[];
  turnCard: CardOrUndefined[];
  allCards: CardInterface[];
  simulateHand: () => void;
  stopSimulateHand: () => void;
  changeSpotCard: (pickedCardName: string | undefined, cardIdx: number) => void;
}

const Spot = ({
  stopSimulateHand,
  simulateHand,
  changeSpotCard,
  flopCards,
  turnCard,
  allCards,
}: SpotProps) => {
  const [flopPickerOpen, setFlopPickerOpen] = useState(false);
  const [turnPickerOpen, setTurnPickerOpen] = useState(false);
  const [nextFlopCardToChange, setNextFlopCardToChange] = useState(0);

  const openFlopPicker = () => {
    setFlopPickerOpen(true);
    stopSimulateHand();
  };

  const closeFlopPicker = () => {
    setFlopPickerOpen(false);
    simulateHand();
  };

  const openTurnPicker = () => {
    setTurnPickerOpen(true);
    stopSimulateHand();
  };

  const closeTurnPicker = () => {
    setTurnPickerOpen(false);
    simulateHand();
  };

  const handleChangeHand = (
    e: React.MouseEvent<HTMLElement>,
    pickedCardName: string,
    isTurn: boolean
  ) => {
    e.preventDefault();
    let cardIdx = isTurn ? 3 : nextFlopCardToChange;
    changeSpotCard(pickedCardName, cardIdx);
    if (!isTurn) {
      if (cardIdx === flopCards.length - 1) {
        cardIdx = 0;
      } else {
        cardIdx++;
      }
      setNextFlopCardToChange(cardIdx);
    }
  };

  const removeActiveCards = (isTurn: boolean) => {
    if (!isTurn) {
      flopCards.forEach((_card, cardId: number) => {
        changeSpotCard(undefined, cardId);
      });
      setNextFlopCardToChange(0);
    }
    changeSpotCard(undefined, 3);
  };

  const changeNextFlopCardToChange = (id: number) => {
    setNextFlopCardToChange(id);
  };

  const flopRender = useMemo(
    () =>
      flopCards.map((card, cardId: number) => (
        <Card
          key={cardId}
          name={card ? card.name : "none"}
          openPicker={openFlopPicker}
        />
      )),
    [flopCards]
  );

  const turnRender = useMemo(
    () =>
      flopCards.every((card) => card !== undefined) ? (
        <Card
          name={turnCard[0] ? turnCard[0].name : "none"}
          openPicker={openTurnPicker}
        />
      ) : (
        <Card name={turnCard[0] ? turnCard[0].name : "none"} disable />
      ),
    [flopCards, turnCard]
  );

  return (
    <div className="Spot">
      {flopRender}
      {turnRender}

      <CardPicker
        cards={allCards}
        activeCards={flopCards}
        isPickerOpened={flopPickerOpen}
        closePicker={closeFlopPicker}
        nextCardToChange={nextFlopCardToChange}
        handleClick={handleChangeHand}
        removeActiveCards={removeActiveCards}
        changeNextCardToChange={changeNextFlopCardToChange}
      />
      <CardPicker
        cards={allCards}
        activeCards={turnCard}
        isPickerOpened={turnPickerOpen}
        closePicker={closeTurnPicker}
        handleClick={handleChangeHand}
        removeActiveCards={removeActiveCards}
      />
    </div>
  );
};

export default Spot;
