import React from 'react';
import { Card } from '../';
import './CardPicker.css';

function CardPicker({
  cards,
  handleClick,
  activeCards,
  nextCardToChange,
  closePicker,
  removeActiveCards,
  pickerOpen,
  changeNextCardToChange,
}) {
  const spadesRender = cards.map((card) =>
    card.color === 's' ? createCard(card, activeCards) : undefined
  );
  const heartRender = cards.map((card) =>
    card.color === 'h' ? createCard(card, activeCards) : undefined
  );
  const cloverRender = cards.map((card) =>
    card.color === 'c' ? createCard(card, activeCards) : undefined
  );
  const diamondRender = cards.map((card) =>
    card.color === 'd' ? createCard(card, activeCards) : undefined
  );

  const activeCardsRender = activeCards.map((card, cardId) => {
    const isActive = nextCardToChange === cardId ? true : false;
    return card ? (
      <button onClick={(e) => changeNextCardToChange(cardId)} key={cardId}>
        <Card name={card.name} active={isActive} />
      </button>
    ) : (
      <button onClick={(e) => changeNextCardToChange(cardId)} key={cardId}>
        <Card name='none' active={isActive} />
      </button>
    );
  });

  return (
    <div
      className='CardPicker'
      style={!pickerOpen ? { display: 'none' } : { display: 'block' }}
    >
      <div className='CardPicker_activeHands'>{activeCardsRender}</div>
      <div className='CardPicker_cards CardPicker_cards-spades'>
        {spadesRender}
      </div>
      <div className='CardPicker_cards CardPicker_cards-heart'>
        {heartRender}
      </div>
      <div className='CardPicker_cards CardPicker_cards-clover'>
        {cloverRender}
      </div>
      <div className='CardPicker_cards CardPicker_cards-diamond'>
        {diamondRender}
      </div>
      <div className='CardPicker_buttons buttons-container'>
        {activeCards.every((card) => card !== undefined) ||
        activeCards.every((card) => card === undefined) ? (
          <button className='button button-white' onClick={closePicker}>
            Close
          </button>
        ) : (
          <button className='button button-white disable'>Close</button>
        )}
        <button
          className='button button-red'
          onClick={(e) => removeActiveCards(activeCards.length === 1)}
        >
          remove
        </button>
      </div>
    </div>
  );

  function createCard(card, activeCards) {
    let isTurn = activeCards.length === 1;
    return (
      <button
        key={card.name}
        onClick={
          card.taken ? () => {} : (e) => handleClick(e, card.name, isTurn)
        }
        className={`pointer${card.taken ? ' taken' : ''}`}
      >
        <Card name={card.taken ? 'none' : card.name} />
      </button>
    );
  }
}

export default CardPicker;
