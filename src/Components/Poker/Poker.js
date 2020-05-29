import React, { Component } from 'react';
import { Spot, Hand } from '../';
import allCardsInit from '../../allCards';
import compareHands from '../../compareHands';
import './Poker.css';

class Poker extends Component {
  state = {
    cards: allCardsInit,
    hands: [
      {
        id: 0,
        cards: Array(2).fill(),
        winRate: 0,
      },
      {
        id: 1,
        cards: Array(2).fill(),
        winRate: 0,
      },
    ],
    spotCards: Array(4).fill(),
  };

  stopSimulateHand = () => {
    clearTimeout(timeOut);
    let hands = this.state.hands.map((hand) => {
      hand.winRate = parseInt(0).toFixed(1);
      return hand;
    });
    this.setState({ hands });
  };

  simulateHand = () => {
    const { spotCards, cards, hands } = this.state;
    let declaredSpotCards = [];
    let declaredHands = [];
    spotCards.forEach((card) => {
      if (card) declaredSpotCards.push(card);
    });
    hands.forEach((hand) => {
      if (hand.cards[0]) declaredHands.push(hand.cards);
    });
    const remainingCards = cards.filter((card) => !card.taken);

    if (declaredHands.length > 1) {
      let wins = Array(declaredHands.length).fill(0);
      let i = 0;

      const process = () => {
        timeOut = setTimeout(() => {
          let remainingCardsInGame = [...remainingCards];
          let declaredSpotCardsInGame = [...declaredSpotCards];

          for (let j = 0; j < 5; j++) {
            if (!declaredSpotCardsInGame[j]) {
              const randomNumberCard = Math.floor(
                Math.random() * remainingCardsInGame.length
              );
              declaredSpotCardsInGame.push(
                remainingCardsInGame[randomNumberCard]
              );
              remainingCardsInGame.splice(randomNumberCard, 1);
            }
          }
          compareHands(declaredSpotCardsInGame, declaredHands).forEach(
            (result, id) => {
              if (result === 'win') {
                wins[id]++;
              }
              if (i % 10 === 0) {
                let winRate = wins[id] / (i + 1);
                hands[id].winRate = (winRate * 100).toFixed(1);
                this.setState({ hands });
              }
            }
          );

          i++;
          if (i < 5000000) process();
        }, 0);
      };

      process();
    }
  };

  changeHand = (handId, newCard, nextCardToChange) => {
    const updatedCards = this.state.cards.map((card) => {
      if (
        this.state.hands[handId].cards[nextCardToChange] !== undefined &&
        card.name === this.state.hands[handId].cards[nextCardToChange].name
      ) {
        card.taken = false;
      } else if (card.name === newCard) {
        card.taken = true;
      }
      return card;
    });
    this.setState({ cards: updatedCards });

    let updatedHands = this.state.hands;
    let newCardObject = this.state.cards.find((card) => card.name === newCard);
    updatedHands[handId].cards[nextCardToChange] = newCardObject;
    this.setState({ hands: updatedHands });
  };

  changeSpotHand = (newCard, nextCardToChange) => {
    const updatedCards = this.state.cards.map((card) => {
      if (
        this.state.spotCards[nextCardToChange] !== undefined &&
        card.name === this.state.spotCards[nextCardToChange].name
      ) {
        card.taken = false;
      } else if (card.name === newCard) {
        card.taken = true;
      }
      return card;
    });
    this.setState({ cards: updatedCards });

    let updatedSpot = this.state.spotCards;
    let newCardObject = this.state.cards.find((card) => card.name === newCard);
    updatedSpot[nextCardToChange] = newCardObject;
    this.setState({ spotCards: updatedSpot });
  };

  addHand = () => {
    let updatedHands = this.state.hands;
    updatedHands.push({
      id: updatedHands.length,
      cards: Array(2).fill(),
      winRate: 0,
    });
    this.setState({ hands: updatedHands });
  };

  removeHand = () => {
    let updatedHands = this.state.hands;
    let updatedCards = this.state.cards.map((card) => {
      updatedHands[updatedHands.length - 1].cards.forEach((handCard) => {
        if (handCard !== undefined && handCard.name === card.name) {
          card.taken = false;
        }
      });
      return card;
    });
    updatedHands.pop();
    this.setState({ hands: updatedHands, card: updatedCards });
    this.stopSimulateHand();
    this.simulateHand();
  };

  render() {
    const { hands, cards, spotCards } = this.state;
    const handsRender = hands.map((hand) => (
      <Hand
        key={hand.id}
        id={hand.id}
        cards={hand.cards}
        winRate={hand.winRate}
        allCards={cards}
        changeHand={this.changeHand}
        simulateHand={this.simulateHand}
        stopSimulateHand={this.stopSimulateHand}
      />
    ));
    return (
      <div className='Poker'>
        <h1>Poker Equity</h1>
        <Spot
          flopCards={spotCards.slice(0, 3)}
          turnCard={[spotCards[3]]}
          changeSpotHand={this.changeSpotHand}
          allCards={cards}
          simulateHand={this.simulateHand}
          stopSimulateHand={this.stopSimulateHand}
        />
        {handsRender}
        <div className='buttons-container'>
          {hands.length < 4 ? (
            <button className='button button-white' onClick={this.addHand}>
              add hand
            </button>
          ) : (
            <button className='button button-white disable'>add hand</button>
          )}
          {hands.length > 2 ? (
            <button className='button button-red' onClick={this.removeHand}>
              remove hand
            </button>
          ) : (
            <button className='button button-red disable'>remove hand</button>
          )}
        </div>
      </div>
    );
  }
}

let timeOut;

export default Poker;
