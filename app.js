const express = require('express')
const bodyparser = require('body-parser')
const app = express()
const fs = require('fs')
const path = require('path')

const todosFilePath = path.resolve(__dirname, 'data/todos.json')

app.use(bodyparser.json())
app.use(bodyparser.urlencoded())
app.get('/', (req, res) => {
  res.send('todo')
})
app.post('/todos', (req, res) => {
  const todo = ({ text } = req.body)
  if (!todo) {
    res.status(400).send({ massage: 'text is required.' })
  }

  fs.readFile(todosFilePath, (err, data) => {
    if (err) {
      res.status(500).send(err)
      return
    }
    data = JSON.parse(data)
    data.push(todo)
    data = JSON.stringify(data)

    fs.writeFile(todosFilePath, data, (err) => {})
    if (err) {
      res.status(500).send(err)
    } else {
      res.send(todo)
    }
  })
})

app.get('/todos', (req, res) => {
  fs.readFile(todosFilePath, (err, data) => {
    if (err) {
      res.status(500).send(err)
      return
    }
    data = JSON.parse(data)
    res.send(data)
  })
})
app.delete('/todos', (req, res) => {
  const todo = ({ text } = req.body)
  fs.readFile(todosFilePath, (err, data) => {
    if (err) {
      res.status(500).send(err)
    } else {
      data = JSON.parse(data)
      data = data.filter((data) => data.text !== todo.text)
      data = JSON.stringify(data)
      fs.writeFile(todosFilePath, data, (err) => {
        if (err) {
          res.status(500).send(err)
        } else {
          res.end()
        }
      })
    }
  })
})
app.listen('3001')
console.log('server is running on port 3001.')
