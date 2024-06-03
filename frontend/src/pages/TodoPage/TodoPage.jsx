import {
  Box,
  Button,
  Checkbox,
  Container,
  Input,
  Text
} from '@chakra-ui/react';

import React, { useState } from 'react';
import { todoAPI } from '../../service/TodoService';

export const TodoPage = () => {
  const [addTodo, {isLoading: addLoading }] = todoAPI.useAddTodoMutation()
  const [deleteTodo, {isLoading: deleteLoading }] = todoAPI.useDeleteTodoMutation()
  const [completeTodo, {isLoading: completeLoading }] = todoAPI.useCompleteTodoMutation()
  const {data: todos, isFetching, error} = todoAPI.useGetTodoQuery(undefined, {
    refetchOnMountOrArgChange: true
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

  const handleToggleTodo = (id, is_done) => {
    completeTodo({id: id, is_done: !is_done})
  };

  const handleDeleteTodo = (id) => {
    deleteTodo(id)
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
      {(isFetching || addLoading || deleteLoading || completeLoading) && <div>Загрузка...</div>}
      {(todos && todos.length) ? todos.map((todo, index) => (
        <Box key={todo.id} width="100%" border="1px solid #ccc" borderRadius="md" marginBottom={2} background={'white'}>
          <Box display="flex" alignItems="center" p={2} >
            <Checkbox
              isChecked={todo.is_done}
              onChange={() => handleToggleTodo(todo.id, todo.is_done)}
              marginRight={2}
            />
            <Text
              textDecoration={todo.is_done ? 'line-through' : 'none'}
              flex="1"
            >
              {todo.name}
            </Text>
            <Button
              colorScheme="red"
              onClick={() => handleDeleteTodo(todo.id)}
              aria-label="Удалить задачу"
              size="sm"
            >
              Удалить
            </Button>
          </Box>
        </Box>
      ))
      : <div>Нет данных</div>
    } 
    </Container>
  )
}