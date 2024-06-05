const Pool = require('pg').Pool
const pool = new Pool({
    user: "admin",
    password: "admin",
    host: "localhost",
    port: "5423",
    database: 'uitia'
})

const express = require('express'),
  app = express(),
  jwt = require('jsonwebtoken') // , users = require('./users')

const host = '127.0.0.1' // localhost
const port = 8000 // for queries from the clients
const tokenKey = 'ba21-dc43-fe65-hg87' // some secret salt

const cors = require('cors')

app.options('*', cors()) // include before other routes
app.use(function(req, res, next) { //allow cross origin requests
  res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

////////////////////////////
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

async function getLastIdOfPerson() {
  const user = await pool.query('SELECT MAX(id) AS last_user_id FROM person', [])
  console.log('getLastIdOfPersongetLastIdOfPersongetLastIdOfPersongetLastIdOfPerson', user.rows[0].last_user_id)
  return user.rows[0].last_user_id
}

async function getCurrentUserFromDB(username) {
  const user = await pool.query('SELECT * FROM person WHERE username = $1', [username])
  console.log('getCurrentUserFromDB', user.rows[0])
  return user.rows[0]
}

app.use(express.json())

///////////////////////////////////////////////////////////////////////////
//                                                                       //
// Функция промежуточной обработки, монтируемая в путь /api/auth         //  
// Эта функция выполняется для всех типов запросов HTTP в пути /api/auth //
//                                                                       //
///////////////////////////////////////////////////////////////////////////

async function getCurrentUserFromDBById(id) {
  console.log('getCurrentUserFromDBByIdgetCurrentUserFromDBById', id)
  const user = await pool.query('SELECT * FROM person WHERE id = $1', [id])
  // console.log('getCurrentUserFromDBById', user.rows[0])
  return user.rows[0] ?? undefined
}

app.use('/api/auth/', (req, res, next) => {
  if (req.headers.authorization) {
    try {

      const token = req.headers.authorization.split(' ')[1] // "Bearer TOKEN"
  
      if (!token) {
        return res.status(401).json()
      }
  
      const decoded = jwt.verify(token, tokenKey)
      console.log('decoded', decoded)
      getCurrentUserFromDBById(decoded.id).then((user) => {
        if(user.id === decoded.id) {
          req.user = user
        }
        next()
      }).catch(() => {
        next()
      })  
    } catch (e) {
      res.status(401).json()
    }
  
  } else {
    next(); // Proceed if no authorization header
  }
});


/////////////////////////////////////////////////////////////
app.get('/api/auth/check', (req, res) => { // Проверка токена
  console.log("check authentication token")
  let mes = ""
  // Проверка наличия токена авторизации в хедере
  if (req.headers.authorization) { // если есть, то выделить его в "Bearer eyJhbGciOiJI1NiIs..."
    const token = req.headers.authorization.split(' ')[1]
    // и проверить его
    jwt.verify(token, tokenKey,
      (err, payload) => {
      // console.log(payload)
      if (err) {
          mes = "Authentication token is not valid."
          console.log(mes)
          return res.status(401).json({id: -1, token: mes})
        } else {
          mes = "Authentication token is valid."
          console.log(mes)
          return res.status(200).json({token: mes})
        }
      }
    )    
  } else {
    mes = "Missing authentication token."
    console.log(mes)
    return res.status(403).json({id: -1, token: mes})
  }
})


////////////////////////////////////////////////////////////////////////
app.post('/api/auth/signin', (req, res) => { // Авторизация пользователя
  let mes = ""
  const bodyUser = req.body
  console.log("signin:")

  if (JSON.stringify(bodyUser) === '{}') {
    mes = "No content."
    console.log(mes)
    return res.status(412).json({id: -1, token: mes}) // or 204 No content
  }

  if (typeof bodyUser.username === 'undefined' ||
      typeof bodyUser.password === 'undefined') {
    mes = "Precondition Failed."
    console.log(mes)
    return res.status(412).json({id: -1, token: mes})
  }

  if (bodyUser.username === '' ||
      bodyUser.password === '' ||
      bodyUser.email === '' ||
      bodyUser.secretResponse === '') {
    mes = "Some user data is empty."
    console.log(mes)
    return res.status(412).json({id: -1, token: mes}) // or 204 No content
  }

  getCurrentUserFromDB(bodyUser.username)
  .then((user) => {
    if (user && req.body.username === user.username &&
      req.body.password === user.password) {
        console.log(user.id)
        console.log(user.token)
        return res.status(200).json({id: user.id, token: user.token})
    }
    else {
      mes = "A user with these name and password could not be found."
      console.log(mes)
      return res.status(401).json({id: -1, token: mes}) // 401 Unauthorized
    }
  })
})

////////////////////////////////////////////////////////////////////////
app.post('/api/auth/signup', (req, res) => { // Регистрация пользователя
  let mes = ""
  const bodyUser = req.body
  console.log("signup:")

  if (JSON.stringify(bodyUser) === '{}') {
    mes = "No content"
    return res.status(204).json({id: -1, token: mes})
  }

  if (typeof bodyUser.username === 'undefined' ||
      typeof bodyUser.password === 'undefined' ||
      typeof bodyUser.email === 'undefined' ||
      typeof bodyUser.secretResponse === 'undefined') {
    mes = "Precondition Failed."
    console.log(mes)
    return res.status(412).json({id: -1, token: mes}) // 412 Precondition Failed
  }

  if (bodyUser.username === '' ||
      bodyUser.password === '' ||
      bodyUser.email === '' ||
      bodyUser.secretResponse === '') {
    mes = "Some user data is empty."
    console.log(mes)
    return res.status(204).json({id: -1, token: mes}) // 204 No content
  }

  getCurrentUserFromDB(bodyUser.username)
  .then((user) => {
    if(user && user.username === bodyUser.username) {
      mes = "The user is already exist."
      console.log(mes)
      return res.status(409).json({id: -1, token: mes}) // 409 Conflict
    }
    else {
      //Запрос на создание пользователя
      pool.query('INSERT INTO person (username, password, email, secretResponse, token) VALUES ($1, $2, $3, $4, $5) RETURNING *', [bodyUser.username, bodyUser.password, bodyUser.email, bodyUser.secretResponse, ''])
        .then((response) => {
          console.log(response.rows[0])
          //Запрос на изменение токена пользователя, после того как узнали его id
          pool.query('UPDATE person SET token = $1 WHERE id = $2 RETURNING token', [jwt.sign({ id: response.rows[0].id }, tokenKey), response.rows[0].id])
          .then((result) => {
            console.log(result)
            return res.status(200).json({id: response.rows[0].id, token: result.rows[0].token})
          })
        })
    }
  })
})
  

/////////////////////////////////////////////////////////////////////
app.delete('/api/auth/drop', (req, res) => { // Удаление пользователя
  let mes = ""
  const bodyUser = req.user
  console.log("delete:")
  
  if (JSON.stringify(bodyUser) === '{}') {
    mes = "No content"
    console.log(mes)
    return res.status(204).json({id: -1, token: mes}) // 204 No content
  }

  if (typeof bodyUser.username === 'undefined' ||
      typeof bodyUser.password === 'undefined') {
      mes = "Precondition Failed."
      console.log(mes)
      return res.status(412).json({id: -1, token: mes}) // 412 Precondition Failed
  }

  if (bodyUser.username === '' ||
      bodyUser.password === '') {
    mes = "Some user data is empty."
    console.log(mes)
    return res.status(204).json({id: -1, token: mes}) // 204 No content
  }

  if(req.user) {
    pool.query('DELETE FROM person WHERE id = $1', [req.user.id])
    .then((response) => {
      console.log(response.rows[0])
      res.status(200).json({id: 0, token: 'delete successfully'})
    })
  }
  else {
    mes = "A user with this name and password could not be found."
    console.log(mes)
    return res.status(404).json({id: -1, token: mes}) // 401 Unauthorized
  }
})


//////////////////////////////////////////////////////////
app.get('/api/auth/user', (req, res) => { // Get user data
  let mes = ""
  console.log("user:" + req.user)

  getCurrentUserFromDB(req.user.username).then((user) => {
    console.log('req.user', req.user)
    if(user && user.username === req.user.username) {
      console.log('/user', user)
      return res.status(200).json(user) // 200 Ok
    } 
    else {
      mes = "Not authorized."
      console.log(mes)
      return res.status(401).json({id: -1, token: mes}) // 401 Not authorized
    }
  })  
})


//////////////////////////////////////////////////////////
app.get('/api/auth/data', (req, res) => { // Get some data
  let mes = ""
  console.log("data:")

  if (req.user) {
    mes = "Some data."
    console.log(mes)
    return res.status(200).json({id: 0, token: mes}) // 200 Ok
  } else {
    mes = "Not authorized."
    console.log(mes)
    return res.status(401).json({id: -1, token: mes}) // 401 Not authorized
  }
})


////////////////////////////////////////////////////////////////////////
app.post('/api/auth/reset', async (req, res) => { // Сброс пароля пользователя
  let mes = ""
  console.log("reset:")
  const bodyUser = req.body

  if (JSON.stringify(bodyUser) === '{}') {
    mes = "No content."
    console.log(mes)
    return res.status(204).json({id: -1, token: mes})
  }

  if (typeof bodyUser.username === 'undefined' ||
      typeof bodyUser.password === 'undefined' ||
      typeof bodyUser.email === 'undefined' ||
      typeof bodyUser.secretResponse === 'undefined') {
    mes = "Precondition Failed."
    console.log(mes)
    return res.status(412).json({id: -1, token: mes})
  }

  if (bodyUser.username === '' ||
      bodyUser.password === '' ||
      bodyUser.email === '' ||
      bodyUser.secretResponse === '') {
    mes = "Some user data is empty."
    console.log(mes)
    return res.status(204).json({id: -1, token: mes}) // No content
  }

  const user = await getCurrentUserFromDB(bodyUser.username)
  if (bodyUser.username === user.username &&
    bodyUser.email.toLowerCase() === user.email.toLowerCase() &&
    bodyUser.secretResponse === user.secretresponse &&
    bodyUser.password.length > 0) {
      pool.query('UPDATE person SET password = $1 WHERE id = $2', [bodyUser.password, user.id])
        .then((response) => {
          console.log( 'new password', response)
          console.log("new password: " + bodyUser.password)
          let mes = "The user password has changed successfully."
          console.log(mes)
          return res.status(200).json({id: 0, token: mes}) // 200 Ok
        })
      
  } 
  else {
    mes = "A user with these name, email and secret response could not be found."
    console.log(mes)
    return res.status(401).json({id: -1, token: mes}) // 401 Unauthorized
  }
})


//////////////////////////////////////////////////////////
app.get('/api/auth/users', (req, res) => { // Get all users
  let mes = ""
  console.log("users:")

  if (req.user) {
    mes = req.user.username
    console.log(mes)
    return res.status(200).json(users) // 200 Ok
  } else {
    mes = "Not authorized."
    console.log(mes)
    return res.status(401).json({id: -1, token: mes}) // 401 Not authorized
  }
})


//////////////////////////////////////////////////////////
app.get('/api/auth/todo', (req, res) => { // Получение todo записей
  console.log("get todo:")

  if (!req.user) {
    mes = "Not authorized."
    console.log(mes)
    return res.status(401).json({id: -1, token: mes}) // 401 Not authorized
  } else {
      pool.query('SELECT * FROM todo WHERE user_id = $1 ORDER BY id', [req.user.id])
      .then((response) => {
        console.log('todos', response.rows)
        return res.status(200).json(response.rows) // 200 Ok
      })
  }
 
})


//////////////////////////////////////////////////////////
app.post('/api/auth/todo/add', (req, res) => { // Добавление todo записи
  const body = req.body

  if (JSON.stringify(body) === '{}') {
    mes = "No content."
    console.log(mes)
    return res.status(204).json({id: -1, token: mes})
  }

  if (typeof body.name === 'undefined') {
    mes = "Precondition Failed."
    console.log(mes)
    return res.status(412).json({id: -1, token: mes})
  }

  if (body.name === '') {
    mes = "Some user data is empty."
    console.log(mes)
    return res.status(204).json({id: -1, token: mes}) // No content
  }
  pool.query('INSERT INTO todo (name, is_done, user_id) VALUES ($1, $2, $3) RETURNING *', [body.name, false, req.user.id])
    .then((response) => {
      console.log('new todo', response.rows[0])
      return res.status(200).json(response.rows[0]) // 200 Ok
  })
  
  
})


//////////////////////////////////////////////////////////
app.delete('/api/auth/todo/delete/:todo_id', (req, res) => { // Удаление todo записи
  const { todo_id } = req.params;
  console.log('delete todo')
  if (!todo_id) {
    mes = "No content."
    console.log(mes)
    return res.status(204).json({id: -1, token: mes})
  }

  if(req.user) {
    pool.query('DELETE FROM todo WHERE id = $1 AND user_id = $2', [Number(todo_id), req.user.id])
    .then((response) => {
      console.log(response.rows[0])
      res.status(200).json({id: 0, token: 'delete successfully'})
    })
  }
  else {
    mes = "A user with this name and password could not be found."
    console.log(mes)
    return res.status(404).json({id: -1, token: mes}) // 401 Unauthorized
  }
  
})


//////////////////////////////////////////////////////////
app.put('/api/auth/todo/complete/:todo_id', (req, res) => { // Выполнение todo записи
  const body = req.body
  const { todo_id } = req.params;
  console.log('complete todo')

  if (!todo_id || body === '{}') {
    mes = "No content."
    console.log(mes)
    return res.status(204).json({id: -1, token: mes})
  }

  if (typeof body.is_done === 'undefined') {
    mes = "Precondition Failed."
    console.log(mes)
    return res.status(412).json({id: -1, token: mes})
  }
  if(req.user) {
    pool.query('UPDATE todo SET is_done = $1 WHERE id = $2 AND user_id = $3', [body.is_done, Number(todo_id), req.user.id])
    .then((response) => {
      res.status(200).json({todo_id: todo_id, is_done: body.is_done})
    })
  }
  else {
    mes = "A user with this name and password could not be found."
    console.log(mes)
    return res.status(404).json({id: -1, token: mes}) // 401 Unauthorized
  }
  
})


//////////////////////////////////////////////////////////
app.put('/api/auth/todo/change/:todo_id', (req, res) => { // Изменение todo записи
  const body = req.body
  const { todo_id } = req.params;
  console.log('change todo name')

  if (!todo_id || body === '{}') {
    mes = "No content."
    console.log(mes)
    return res.status(204).json({id: -1, token: mes})
  }

  if (typeof body.name === 'undefined') {
    mes = "Precondition Failed."
    console.log(mes)
    return res.status(412).json({id: -1, token: mes})
  }
  if(req.user) {
    pool.query('UPDATE todo SET name = $1 WHERE id = $2 AND user_id = $3', [body.name, Number(todo_id), req.user.id])
    .then((response) => {
      res.status(200).json({todo_id: todo_id, name: body.name})
    })
  }
  else {
    mes = "A user with this name and password could not be found."
    console.log(mes)
    return res.status(404).json({id: -1, token: mes}) // 401 Unauthorized
  }
  
})


app.listen(port, host, () =>
  console.log(`Server listens http://${host}:${port}`)
)

