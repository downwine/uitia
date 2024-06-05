import {
  Box,
  Button,
  Container,
  Input
} from '@chakra-ui/react';

import React, { useState } from 'react';
import { todoAPI } from '../../service/TodoService';
import { TodoItem } from './TodoItem';

export const TodoPage = () => {
  // функция добавления заметки на сервере
  const [addTodo, {isLoading: addLoading }] = todoAPI.useAddTodoMutation()
  // получение заметок пользователя с сервера
  const {data: todos, isFetching, error} = todoAPI.useGetTodoQuery(undefined, {
    refetchOnMountOrArgChange: true // обновлять данные при каждом заходе на страницу
  })
  const [todoInput, setTodoInput] = useState('');

  const handleInputChange = (e) => {
    setTodoInput(e.target.value);
  };

  const handleAddTodo = () => {
    if (todoInput.trim() !== '') {
      addTodo({name: todoInput}).then((response) => {
        console.log(response)
        if(response.data) {
          setTodoInput('')
        }
      })
    }
  };


  return (
    <Container maxW='992px'>
      <Box width="100%" border="1px solid #ccc" borderRadius="md" p={2} marginBottom={5}>
        <Input
          placeholder="Добавить новую задачу"
          value={todoInput}
          onChange={handleInputChange}
        />
        <Button
          colorScheme="blue"
          size="sm"
          onClick={handleAddTodo}
          marginTop={2}
        >
          Добавить
        </Button>
      </Box>
      {(isFetching || addLoading) && <div>Загрузка...</div>}
      {(todos && todos.length) ? todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))
      : <div>Нет данных</div>
    } 
    </Container>
  )
}