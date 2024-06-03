import { Box, Button, Container, Flex, Text } from '@chakra-ui/react';
import React from "react";
import { useDispatch } from 'react-redux';
import { userAPI } from '../../service/UserService';
import { setIsLogin } from '../../slice/appSlice';

export const ProfilePage = () => {
  const dispatch = useDispatch()
  const {data: user, error, isLoading} = userAPI.useGetUserInfoQuery(undefined, {
    refetchOnMountOrArgChange: true
  })
  const [removeUser] = userAPI.useRemoveUserMutation()
  
  const handleLogout = () => {
    dispatch(setIsLogin(false))
    localStorage.removeItem('access')
  }

  const handleDeleteUser = () => {
    removeUser().then((result) => {
      console.log(result)
      if(result.data) {
          dispatch(setIsLogin(false))
          localStorage.removeItem('access')
          alert(result.data.token)
        }
        else if(result.error.data.token) {
          alert(result.error.data.token)
        }
    })
  }
  
  if(isLoading) return <div>Загрузка...</div>
  return (
    <Container maxW='992px'>
        <Box
          maxW="sm"
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          p="6"
          m="auto"
          textAlign="center"
        >
          <Text fontSize="xl" fontWeight="bold">
            ID: {user.id}
          </Text>
          <Text fontSize="lg">Username : {user.username}</Text>
          <Text fontSize="md" color="gray.500">
            Email: {user.email}
          </Text>
          <Flex gap={'10px'} justifyContent={'center'}>
            <Button onClick={handleLogout} colorScheme="blue" mt="4">
              Log out
            </Button>
            <Button onClick={handleDeleteUser} colorScheme="red" mt="4">
              Delete Profile
            </Button>
          </Flex>
        </Box>
    </Container>
  )
}