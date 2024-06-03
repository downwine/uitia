import { Container } from '@chakra-ui/react';
import React, { useState } from "react";
import s from './CalculatorPage.module.scss';

export const CalculatorPage = () => {
  const [currentValue, setCurrentValue] = useState('0');
  const [previousValue, setPreviousValue] = useState('');
  const [operator, setOperator] = useState(null);

  const handleNumber = (number) => {
    if (currentValue === '0' || (operator && previousValue === currentValue)) {
      setCurrentValue(number);
    } else {
      setCurrentValue(currentValue + number);
    }
  };

  const handleAction = (action) => {
    switch (action) {
      case 'clear':
        setCurrentValue('0');
        setPreviousValue('');
        setOperator(null);
        break;
      case 'backspace':
        if (currentValue.length > 1) {
          setCurrentValue(currentValue.slice(0, -1));
        } else {
          setCurrentValue('0');
        }
        break;
      case 'square':
        calculate();
        setCurrentValue((prev) => String(Math.pow(parseFloat(prev), 2)));
        break;
        case 'sqrt':
        calculate();
        setCurrentValue((prev) => String(Math.sqrt(parseFloat(prev))));
        break;
      case 'add':
      case 'subtract':
      case 'multiply':
      case 'divide':
        if (operator) {
          calculate();
        }
        setPreviousValue(currentValue);
        setOperator(action);
        setCurrentValue((prev) => prev + getOperatorSymbol(action));
        break;
      case 'decimal':
        if (canAddDecimal(currentValue)) {
          setCurrentValue(currentValue + '.');
        }
        break;
      case 'equals':
        if (operator) {
          calculate();
          setOperator(null);
        }
        break;
      default:
        break;
    }
  };

  const calculate = () => {
    const operatorSymbol = getOperatorSymbol(operator);
    const parts = currentValue.split(operatorSymbol);
    if (parts.length < 2) return;
    
    const prev = parseFloat(parts[0]);
    const current = parseFloat(parts[1]);
    
    switch (operator) {
      case 'add':
        setCurrentValue(String(prev + current));
        break;
      case 'subtract':
        setCurrentValue(String(prev - current));
        break;
      case 'multiply':
        setCurrentValue(String(prev * current));
        break;
      case 'divide':
        if(current === 0) {
          alert('На ноль делить нельзя')
          setCurrentValue(String(prev));
          break
        }
        setCurrentValue(String(prev / current));
        break;
      default:
        break;
    }
    setPreviousValue(currentValue);
  };

  const getOperatorSymbol = (action) => {
    switch (action) {
      case 'add':
        return '+';
      case 'subtract':
        return '-';
      case 'multiply':
        return '*';
      case 'divide':
        return '/';
      default:
        return '';
    }
  };

  const canAddDecimal = (value) => {
    const operatorSymbol = ['+', '-', '*', '/'].find(op => value.includes(op));
    if (!operatorSymbol) {
      return !value.includes('.');
    }
    const parts = value.split(operatorSymbol);
    const currentPart = parts[parts.length - 1];
    if(!currentPart) return false
    return !currentPart.includes('.');
  };

  const handleClick = (e) => {
    const { action, value } = e.target.dataset;
    if (value !== undefined) {
      handleNumber(value);
    } else if (action !== undefined) {
      handleAction(action);
    }
  };

  console.log(currentValue)
  
  return (
    <Container maxW='992px'>
        <div className={s.calculator}>
        <div className={s.display} id="display">{currentValue}</div>
          <div className={s.buttons}>
              <button onClick={handleClick} className={s.button} data-action="clear">C</button>
              <button onClick={handleClick} className={s.button} data-action="backspace">⌫</button>
              <button onClick={handleClick} className={s.button} data-action="square">x²</button>
              <button onClick={handleClick} className={s.button} data-action="sqrt">√</button>
              <button onClick={handleClick} className={s.button} data-value="7">7</button>
              <button onClick={handleClick} className={s.button} data-value="8">8</button>
              <button onClick={handleClick} className={s.button} data-value="9">9</button>
              <button onClick={handleClick} className={s.button} data-action="divide">/</button>
              <button onClick={handleClick} className={s.button} data-value="4">4</button>
              <button onClick={handleClick} className={s.button} data-value="5">5</button>
              <button onClick={handleClick} className={s.button} data-value="6">6</button>
              <button onClick={handleClick} className={s.button} data-action="multiply">*</button>
              <button onClick={handleClick} className={s.button} data-value="1">1</button>
              <button onClick={handleClick} className={s.button} data-value="2">2</button>
              <button onClick={handleClick} className={s.button} data-value="3">3</button>
              <button onClick={handleClick} className={s.button} data-action="subtract">-</button>
              <button onClick={handleClick} className={s.button} data-value="0">0</button>
              <button onClick={handleClick} className={s.button} data-action="decimal">.</button>
              <button onClick={handleClick} className={s.button} data-action="equals">=</button>
              <button onClick={handleClick} className={s.button} data-action="add">+</button>
          </div>
        </div>
    </Container>
  )
}