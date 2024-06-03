import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
  Stack,
  chakra
} from "@chakra-ui/react";
import { useState } from "react";
import { FaLock, FaUserAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { authAPI } from '../../service/AuthService';
import { setIsLogin } from '../../slice/appSlice';


const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

export const LoginPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const handleShowClick = () => setShowPassword(!showPassword);

  const [doLogin] = authAPI.useLoginMutation()

  const handleLogin = (e) => {
    e.preventDefault ()
    if(username && password) {
      doLogin({username, password})
        .then((result) => {
          console.log(result)
          if(result.error) {
            alert('Неверный логин или пароль')
          }
          else if (result.data) {
            console.log(result.data.token)
            localStorage.setItem('access', result.data.token)
            dispatch(setIsLogin(true))
            navigate('/')
          }
          else {
            alert('Произошла непредвиденная ошибка')
          }
        })
    }
    else {
      alert('Заполните все поля')
    }
  }

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100%"
      backgroundColor="gray.200"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar bg="teal.500" />
        <Heading color="teal.400">Авторизация</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
          <form>
            <Stack
              spacing={4}
              p="1rem"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
            >
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                  />
                  <Input type="text" placeholder="Логин" value={username} onChange={(e) => setUsername(e.target.value)} />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    children={<CFaLock color="gray.300" />}
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Пароль"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormHelperText textAlign="right">
                  <Link as={ReactRouterLink} to="/reset_password">Забыли пароль?</Link>
                </FormHelperText>
              </FormControl>
              <Button
                onClick={handleLogin}
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
              >
                Войти
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
      <Box>
        Нет аккаунта?{" "}
        <Link as={ReactRouterLink} color="teal.500" to="/register">
          Зарегистрироваться
        </Link>
      </Box>
    </Flex>
  );
}
