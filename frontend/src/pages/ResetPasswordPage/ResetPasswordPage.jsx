import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  chakra
} from "@chakra-ui/react";
import { useState } from "react";
import { FaLock, FaMailBulk, FaUserAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../../service/UserService";


const CFaMail = chakra(FaMailBulk);
const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

export const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false);
  const [showSecretResponse, setShowSecretResponse] = useState(false);
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [secretResponse, setSecretResponse] = useState('')
  const handleShowClick = () => setShowPassword(!showPassword);
  const handleShowSecret = () => setShowSecretResponse(!showSecretResponse);

  const [doResetPassword] = userAPI.useResetPasswordMutation()

  const handleSubmit = (e) => {
    e.preventDefault ()
    if(username && password && email && secretResponse) {
      doResetPassword({username, email, password, secretResponse})
        .then((result) => {
          console.log(result)
          if(result.error) {
            alert(result.error.data.token)
          }
          else if (result.data) {
            alert(result.data.token)
            // localStorage.setItem('access', result.data.token)
            // dispatch(setIsLogin(true))
            navigate('/login')
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
        <Heading color="teal.400">Сброс пароля</Heading>
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
                    children={<CFaMail color="gray.300" />}
                  />
                  <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
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
                    placeholder="Новый пароль"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
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
                    type={showSecretResponse ? "text" : "password"}
                    placeholder="Секретный код"
                    value={secretResponse} 
                    onChange={(e) => setSecretResponse(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowSecret}>
                      {showSecretResponse ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                onClick={handleSubmit}
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
              >
                Сбросить пароль
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}
