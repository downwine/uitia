import {
  Box,
  Button,
  Checkbox,
  Input,
  Text
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { todoAPI } from '../../service/TodoService';

export const TodoItem = (props) => {
    const {todo} = props
    const [edit, setEdit] = useState(false)
    const [todoInput, setTodoInput] = useState(todo.name);
    // функция удаления заметки на сервере
    const [deleteTodo, {isLoading: deleteLoading }] = todoAPI.useDeleteTodoMutation()
    // функция изменения заметки на сервере
    const [changeTodo, {isLoading: changeLoading }] = todoAPI.useChangeTodoMutation()
    // функция выполнения заметки на сервере
    const [completeTodo, {isLoading: completeLoading }] = todoAPI.useCompleteTodoMutation()

    const handleToggleTodo = (id, is_done) => {
      completeTodo({id: id, is_done: !is_done})
    };
    const handleDeleteTodo = (id) => {
      deleteTodo(id)
    };
    const handleInputChange = (e) => {
      setTodoInput(e.target.value);
    };
    const handleSaveName = (e) => {
      if(todoInput.trim() !== '') {
        changeTodo({id: todo.id, name: todoInput}).then(() => setEdit(false))
      }
      else {
        handleCancel()
      }
    };
    const handleCancel = () => {
      setTodoInput(todo.name)
      setEdit(false)
    };

    return (
        <Box width="100%" border="1px solid #ccc" borderRadius="md" marginBottom={2} background={'white'}>
          <Box display="flex" alignItems="center" p={2} >
            {
              !edit ? 
              <>
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
              </>
              :
              <Input
                  style={{height: 32}}
                  placeholder="Задача"
                  value={todoInput}
                  onChange={handleInputChange}
              />
            }
            {
              !edit ? 
                <Button
                  style={{width: 'max-content', flexShrink: 0}}
                  colorScheme="blue"
                  onClick={() => setEdit((prev) => !prev)}
                  aria-label="Удалить задачу"
                  size="sm"
                >
                  Редактировать
                </Button>
              :
              <>
                <Button
                  style={{width: 'max-content', flexShrink: 0}}
                  colorScheme="blue"
                  onClick={handleSaveName}
                  aria-label="Удалить задачу"
                  size="sm"
                  marginLeft={1}
                >
                  Сохранить
                </Button>
                <Button
                  style={{width: 'max-content', flexShrink: 0}}
                  colorScheme="blue"
                  onClick={handleCancel}
                  aria-label="Удалить задачу"
                  size="sm"
                  marginLeft={1}
                >
                  Отменить
                </Button>
              </>
            }
            
            
            <Button
              style={{width: 'max-content', flexShrink: 0}}
              colorScheme="red"
              onClick={() => handleDeleteTodo(todo.id)}
              aria-label="Удалить задачу"
              size="sm"
              marginLeft={3}
            >
              Удалить
            </Button>
          </Box>
        </Box>
    );
};
