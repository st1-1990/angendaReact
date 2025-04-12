const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const nameParametro = process.argv[3]
const numberParametro = process.argv[4]

const url =
  `mongodb+srv://juan19617:${password}@cluster0.krp0krd.mongodb.net/agendaApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const agendaSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', agendaSchema)

const person = new Person({
  name: nameParametro,
  number: numberParametro,
})

Person.find({}).then(result => {
    result.forEach(puntero => {
      console.log(puntero)
    })
    mongoose.connection.close()
  })

/* person.save().then(result => {
  console.log('person saved!')
  mongoose.connection.close()
}) */