import { Container } from '@chakra-ui/react';
import React, { useState } from "react";
import s from './WeatherPage.module.scss';

const API_KEY = '77d22f68262a4856a8370542242305'; 

export const WeatherPage = () => {
  const [city, setCity] = useState('')
  const [data, setData] = useState(null)

  const handleChange = (e) => {
    setCity(e.target.value)
  }

  const handleSubmit = async() => {
    const url = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&lang=ru&q=${city}`;
    try {
      if(city) {
        const response = await fetch(url)
        const weatherData = await response.json();
        if (weatherData.error) {
            throw new Error('Network response was not ok ' + weatherData.error.message);
        }
        setData(weatherData);
      }
  } catch (error) {
      console.error('Fetch error: ', error);
      alert(error.message)
      setData(null)
  }
  }

  return (
    <Container maxW='992px'>
        <div className={s.container}>
          <h1 className={s.title}>Информация о погоде</h1>
          <div className={s.searchBox}>
              <input className={s.cityInput} value={city} onChange={handleChange} type="text" placeholder="Введите название города" />
              <button onClick={handleSubmit} className={s.searchButton}>Поиск</button>
          </div>
          {
            data &&
            <div className={s.weatherContainer}>
                <p className={s.info}>{`Город: ${data.location.name}, ${data.location.country}`}</p>
                <p className={s.info}>{`Температура: ${data.current.temp_c} °C`}</p>
                <p className={s.info}>{`Погода: ${data.current.condition.text}`}</p>
            </div>
          }
        </div>
    </Container>
  )
}