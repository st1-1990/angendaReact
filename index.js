require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static('dist'))
const Agenda = require('./models/agenda')





app.get('/', (request, response) => {
  response.send('<h1>Desde el get</h1>')
})


 app.get('/api/persons', (request, response) => {
  Agenda.find({}).then(puntero => {
    response.json(puntero)
  })
})

/*  app.get('/api/persons/:id', (request, response) => {
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
}) */

app.get('/api/persons/:id', (request, response, next) => {
  Agenda.findById(request.params.id).then(puntero => {
    if (puntero) {
      response.json(puntero)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Agenda.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
/* app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(n => n.id !== id)
  response.status(204).end()
}) */

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (body.name === undefined || body.number  === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const newPerson = new Agenda({
    name: body.name,
    number: body.number,
  })

  newPerson.save().then(puntero => {
    response.json(puntero)
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const persona = {
    name: body.name,
    number: body.number,
  }

  Agenda.findByIdAndUpdate(request.params.id, persona, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

/* app.post('/api/persons', (request, response) => {
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
  
}) */
  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
    
  
    next(error)
  }
  
  // este debe ser el último middleware cargado, ¡también todas las rutas deben ser registrada antes que esto!
  app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)