import React from 'react';
import './Card.css';
const imageSource = './Images/';

function Card({ name = 'none', active, openPicker, disable }) {
  return (
    <img
      className={`Card ${active ? 'active' : ''} ${disable ? 'disable' : ''}`}
      src={`${imageSource}${name}.png`}
      alt={name}
      onClick={openPicker}
    />
  );
}

export default Card;
