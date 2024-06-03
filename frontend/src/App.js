import { Grid, GridItem } from '@chakra-ui/react';
import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import { Navbar } from './components/Navbar/Navbar';
import AppRouter from './router/AppRouter';
import { userAPI } from './service/UserService';
import { setIsInit, setIsLogin } from './slice/appSlice';

function App() {
  const dispatch = useDispatch()
  const isInit = useSelector((state) => state.app.isInit);
  const [trigger] = userAPI.useLazyCheckUserQuery()

  useLayoutEffect(() => {
    const token = localStorage.getItem('access')
    if(token) {
      trigger().then((result) => {
        if(result.data?.token) {
          dispatch(setIsLogin(true))
        }
        dispatch(setIsInit(true))
      })
    } else {
      dispatch(setIsInit(true))
    }
  }, [])

  if(!isInit) return null

  return (
    <div className="App">
      <Grid gap={"20px"} bg='gray.200'>
        <GridItem h='80px' bg='tomato'><Navbar /></GridItem>
        <GridItem h='100%'><AppRouter /></GridItem>
      </Grid>
    </div>
  );
}

export default App;
