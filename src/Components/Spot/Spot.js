import React, { Component } from 'react';
import { Card, CardPicker } from '../';
import './Spot.css';

export class Spot extends Component {
  state = {
    flopPickerOpen: false,
    turnPickerOpen: false,
    nextFlopCardToChange: 0,
  };

  openFlopPicker = () => {
    this.setState({ flopPickerOpen: true });
    this.props.stopSimulateHand();
  };

  closeFlopPicker = () => {
    this.setState({ flopPickerOpen: false });
    this.props.simulateHand();
  };

  openTurnPicker = () => {
    this.setState({ turnPickerOpen: true });
    this.props.stopSimulateHand();
  };

  closeTurnPicker = () => {
    this.setState({ turnPickerOpen: false });
    this.props.simulateHand();
  };

  handleChangeHand = (e, newCard, isTurn) => {
    e.preventDefault();
    let nextFlopCardToChange = isTurn ? 3 : this.state.nextFlopCardToChange;
    const { changeSpotHand, flopCards } = this.props;
    changeSpotHand(newCard, nextFlopCardToChange);
    if (!isTurn) {
      if (nextFlopCardToChange === flopCards.length - 1) {
        nextFlopCardToChange = 0;
      } else {
        nextFlopCardToChange++;
      }
      this.setState({ nextFlopCardToChange });
    }
  };

  removeActiveCards = (isTurn) => {
    const { changeSpotHand, flopCards } = this.props;
    if (isTurn) {
      changeSpotHand(undefined, 3);
    } else {
      flopCards.forEach((card, cardId) => {
        changeSpotHand(undefined, cardId);
      });
      changeSpotHand(undefined, 3);
      this.setState({ nextFlopCardToChange: 0 });
    }
  };

  changeNextFlopCardToChange = (number) => {
    this.setState({ nextFlopCardToChange: number });
  };

  render() {
    const { flopCards, turnCard, allCards } = this.props;
    const { flopPickerOpen, turnPickerOpen, nextFlopCardToChange } = this.state;

    const flopRender = flopCards.map((card, cardId) => (
      <Card
        key={cardId}
        name={card ? card.name : 'none'}
        openPicker={this.openFlopPicker}
      />
    ));

    const turnRender = flopCards.every((card) => card !== undefined) ? (
      <Card
        name={turnCard[0] ? turnCard[0].name : 'none'}
        openPicker={this.openTurnPicker}
      />
    ) : (
      <Card name={turnCard[0] ? turnCard[0].name : 'none'} disable />
    );

    return (
      <div className='Spot'>
        {flopRender}
        {turnRender}

        <CardPicker
          cards={allCards}
          activeCards={flopCards}
          pickerOpen={flopPickerOpen}
          closePicker={this.closeFlopPicker}
          nextCardToChange={nextFlopCardToChange}
          handleClick={this.handleChangeHand}
          removeActiveCards={this.removeActiveCards}
          changeNextCardToChange={this.changeNextFlopCardToChange}
        />
        <CardPicker
          cards={allCards}
          activeCards={turnCard}
          pickerOpen={turnPickerOpen}
          closePicker={this.closeTurnPicker}
          handleClick={this.handleChangeHand}
          removeActiveCards={this.removeActiveCards}
        />
      </div>
    );
  }
}

export default Spot;
