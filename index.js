const express = require('express')
const app = express()
app.use(express.json())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Desde el get</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const fecha = new Date()
  const cantidad = persons.length
  response.send (`<p>Cantidad de personas ${cantidad} </p> <br/> en la fecha ${fecha} `)
 })


 app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log(id)
 const persona = persons.find(p => {
  return p.id === id
 })

 if (persona) {
  response.json(persona)
} else {
  response.status(404).end()
}
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(n => n.id !== id)
  response.status(204).end()
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const personaFiltrada = persons.find(f => f.name === body.name)
  console.log("desde el filtro", personaFiltrada)
  
 if(personaFiltrada){
  return response.status(400).json({
  error: "Esa persona ya existe"
 })

 }
  const pe = {
    id: generateId(),
    name: body.name,
    number: body.number,
    
  }

  persons = persons.concat(pe)
  console.log(persons)
  response.json(persons)
  
})



const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)