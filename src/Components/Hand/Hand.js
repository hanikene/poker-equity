import React, { Component } from 'react';
import { CardPicker, Card } from '../';
import './Hand.css';

export class Hand extends Component {
  state = {
    pickerOpen: false,
    nextCardToChange: 0,
  };

  openPicker = () => {
    this.setState({
      pickerOpen: true,
      nextCardToChange: 0,
    });
    this.props.stopSimulateHand();
  };

  closePicker = () => {
    this.setState({ pickerOpen: false });
    this.props.simulateHand();
  };

  handleChangeHand = (e, newCard) => {
    e.preventDefault();
    let { nextCardToChange } = this.state;
    const { id, changeHand, cards } = this.props;
    changeHand(id, newCard, nextCardToChange);

    if (nextCardToChange === cards.length - 1) {
      nextCardToChange = 0;
    } else {
      nextCardToChange++;
    }

    this.setState({ nextCardToChange });
  };

  removeActiveCards = () => {
    const { id, changeHand, cards } = this.props;
    cards.forEach((card, cardId) => {
      changeHand(id, undefined, cardId);
    });
    this.setState({ nextCardToChange: 0 });
  };

  changeNextCardToChange = (number) => {
    this.setState({ nextCardToChange: number });
  };

  render() {
    const { cards, allCards, winRate } = this.props;
    const { nextCardToChange, pickerOpen } = this.state;
    const cardsRender = cards.map((card, cardId) => (
      <Card
        key={cardId}
        name={card ? card.name : 'none'}
        openPicker={this.openPicker}
      />
    ));

    return (
      <div className='Hand'>
        <CardPicker
          cards={allCards}
          activeCards={cards}
          pickerOpen={pickerOpen}
          closePicker={this.closePicker}
          nextCardToChange={nextCardToChange}
          handleClick={this.handleChangeHand}
          removeActiveCards={this.removeActiveCards}
          changeNextCardToChange={this.changeNextCardToChange}
        />
        {cardsRender}
        <h2 className='Hand_winRate'>{winRate}%</h2>
      </div>
    );
  }
}

export default Hand;
