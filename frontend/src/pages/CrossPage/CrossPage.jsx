import { Container } from '@chakra-ui/react';
import React, { useEffect, useState } from "react";
import s from './CrossPage.module.scss';


export const CrossPage = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXTurn, setIsXTurn] = useState(true);

    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const handleClick = (index) => {
        if (board[index] !== null || !isXTurn) {
            return;
        }

        const newBoard = [...board];
        newBoard[index] = isXTurn ? 'x' : 'o';
        setBoard(newBoard);

        if (checkWin(newBoard, isXTurn ? 'x' : 'o')) {
            setTimeout(() => alert(`${isXTurn ? 'Крестики' : 'Нолики'} выиграли!`), 10);
            resetBoard();
            return;
        }

        if (newBoard.every(cell => cell !== null)) {
            setTimeout(() => alert('Ничья!'), 10);
            resetBoard();
            return;
        }

        setIsXTurn(!isXTurn);
    };

    useEffect(() => {
      if(!isXTurn) {
        setTimeout(step, 300);
      }
    }, [isXTurn])

    const step = () => {
      const copyBoard = [...board]
      let priority = 0;
      let index;
      for(let i = 0; i < board.length; i++) {
        if (priority === 2)
          break;
        if (copyBoard[i] === null) {
					// Имитируем ход компьютера
					copyBoard[i] = 'o';
					// Если ход компьютра победный, то сохраняем индексы ячейки
					if (checkWin(copyBoard, 'o')) {
						index = i;
						priority = 2;
						break;
					}
					// Имитируем ход пользователя
					copyBoard[i] = 'x';
          console.log(i, copyBoard, checkWin(copyBoard, 'x'))
					// Если ход игрока победный, то сохраняем индексы ячейки
					if (checkWin(copyBoard, 'x')) {
						index = i;
						priority = 1;
					}
					// Очищаем ячейку после симулированных ходов
					copyBoard[i] = null;
				}
      }
      if (priority === 0) {
        placeRandomO()
      } else {
        const newBoard = [...board];
        newBoard[index] = 'o';
        setBoard(newBoard);
        setIsXTurn(true);
        if (checkWin(newBoard, 'o')) {
          setTimeout(() => alert('Нолики выиграли!'), 10);
          resetBoard();
      }
      }
    }

    const placeRandomO = () => {
        let emptyIndices = board
            .map((value, index) => (value === null ? index : null))
            .filter(value => value !== null);

        if (emptyIndices.length === 0) {
            return;
        }

        let randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        const newBoard = [...board];
        newBoard[randomIndex] = 'o';
        setBoard(newBoard);
        if (checkWin(newBoard, 'o')) {
            setTimeout(() => alert('Нолики выиграли!'), 10);
            resetBoard();
        } else {
            setIsXTurn(true);
        }
    };

    const checkWin = (currentBoard, player) => {
        return winPatterns.some(pattern => 
            pattern.every(index => currentBoard[index] === player)
        );
    };

    const resetBoard = () => {
        setBoard(Array(9).fill(null));
        setIsXTurn(true);
    };

  return (
    <Container maxW='992px'>
        <div className={s.gameBoard} id="gameBoard">
        {board.map((cell, index) => (
                <div
                    key={index}
                    className={`${s.cell} ${s[cell]}`}
                    onClick={() => handleClick(index)}
                >
                    {cell}
                </div>
            ))}
    </div>
    </Container>
  )
}