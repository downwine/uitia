import { Container, Flex, Heading, Link } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link as ReactRouterLink } from 'react-router-dom';


export const Navbar = () => {
    const isLogin = useSelector((state) => state.app.isLogin);

    const content = (
        <>
            {isLogin ? 
            <>
                <Link as={ReactRouterLink} color='white' to='/todo'>
                    Todo
                </Link> 
                <Link as={ReactRouterLink} color='white' to='/profile'>
                    Профиль
                </Link> 
                <Link as={ReactRouterLink} color='white' to='/cross'>
                    Крестики-нолики
                </Link> 
                <Link as={ReactRouterLink} color='white' to='/weather'>
                    Погода
                </Link> 
                <Link as={ReactRouterLink} color='white' to='/calculator'>
                    Калькулятор
                </Link> 
            </> : 
            <>
                <Link as={ReactRouterLink} color='white' to='/login'>
                    Авторизация
                </Link> 
                <Link as={ReactRouterLink} color='white' to='/register'>
                    Регистрация
                </Link> 
                <Link as={ReactRouterLink} color='white' to='/reset_password'>
                    Сброс пароля
                </Link> 
                <Link as={ReactRouterLink} color='white' to='/weather'>
                    Погода
                </Link> 
                <Link as={ReactRouterLink} color='white' to='/calculator'>
                    Калькулятор
                </Link>
            </>}
        </>
    )

    return (
        <Container maxW='992px' h='100%'>
            <Flex h='100%' alignItems='center' gap={'100px'}>
            <Heading as='h1' size='2xl' color='white'>
                Welcome!
            </Heading>
            <Flex h='100%' alignItems='center' gap={'20px'}>
                {content}   
            </Flex>
            </Flex>
        </Container>
        
    );
};