import React, { useMemo } from "react";
import { Card } from "..";
import "./CardPicker.css";
import { Card as CardInterface, CardOrUndefined } from "../../types";

interface CardPickerProps {
  cards: CardInterface[];
  activeCards: CardOrUndefined[];
  isPickerOpened: boolean;
  nextCardToChange?: number;
  closePicker: () => void;
  removeActiveCards: (isTurn: boolean) => void;
  changeNextCardToChange?: (id: number) => void;
  handleClick: (
    e: React.MouseEvent<HTMLElement>,
    pickedCardName: string,
    isTurn: boolean
  ) => void;
}

function CardPicker({
  cards,
  handleClick,
  activeCards,
  nextCardToChange,
  closePicker,
  removeActiveCards,
  isPickerOpened,
  changeNextCardToChange,
}: CardPickerProps) {
  const createCard = (card: CardInterface, activeCards: CardOrUndefined[]) => {
    let isTurn = activeCards.length === 1;
    return (
      <button
        key={card.name}
        onClick={
          card.taken ? () => {} : (e) => handleClick(e, card.name, isTurn)
        }
        className={`pointer${card.taken ? " taken" : ""}`}
      >
        <Card name={card.taken ? "none" : card.name} />
      </button>
    );
  };

  const { spadeCards, heartCards, clubCards, diamondCards } = useMemo(() => {
    const spadeCards: CardInterface[] = [];
    const heartCards: CardInterface[] = [];
    const clubCards: CardInterface[] = [];
    const diamondCards: CardInterface[] = [];
    cards.forEach((card) => {
      if (card.color === "spade") spadeCards.push(card);
      if (card.color === "heart") heartCards.push(card);
      if (card.color === "diamond") diamondCards.push(card);
      if (card.color === "club") clubCards.push(card);
    });
    return { spadeCards, heartCards, clubCards, diamondCards };
  }, [cards]);

  const spadesRender = spadeCards.map((card) =>
    card.color === "spade" ? createCard(card, activeCards) : undefined
  );
  const heartRender = heartCards.map((card) =>
    card.color === "heart" ? createCard(card, activeCards) : undefined
  );
  const cloverRender = clubCards.map((card) =>
    card.color === "club" ? createCard(card, activeCards) : undefined
  );
  const diamondRender = diamondCards.map((card) =>
    card.color === "diamond" ? createCard(card, activeCards) : undefined
  );

  const activeCardsRender = activeCards.map((card, cardId) => {
    const isActive = nextCardToChange === cardId ? true : false;
    return (
      <button
        onClick={
          changeNextCardToChange
            ? (e) => changeNextCardToChange(cardId)
            : () => {}
        }
        key={cardId}
      >
        <Card name={card ? card.name : "none"} isActive={isActive} />
      </button>
    );
  });

  const isPickerClosable = useMemo(() => {
    let allDefined = true;
    let allUndefined = true;
    activeCards.forEach((card) => {
      if (!card) allDefined = false;
      if (card) allUndefined = false;
    });
    return !allDefined || !allUndefined;
  }, [activeCards]);

  return (
    <div
      className="CardPicker"
      style={!isPickerOpened ? { display: "none" } : { display: "block" }}
    >
      <div className="CardPicker_activeHands">{activeCardsRender}</div>
      <div className="CardPicker_cards CardPicker_cards-spades">
        {spadesRender}
      </div>
      <div className="CardPicker_cards CardPicker_cards-heart">
        {heartRender}
      </div>
      <div className="CardPicker_cards CardPicker_cards-clover">
        {cloverRender}
      </div>
      <div className="CardPicker_cards CardPicker_cards-diamond">
        {diamondRender}
      </div>
      <div className="CardPicker_buttons buttons-container">
        {isPickerClosable ? (
          <button className="button button-white" onClick={closePicker}>
            Close
          </button>
        ) : (
          <button className="button button-white disable">Close</button>
        )}
        <button
          className="button button-red"
          onClick={(e) => removeActiveCards(activeCards.length === 1)}
        >
          remove
        </button>
      </div>
    </div>
  );
}

export default CardPicker;
