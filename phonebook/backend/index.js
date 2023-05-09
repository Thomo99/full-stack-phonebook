const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())
morgan.token('req-body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :req-body'))
const cors = require('cors')

app.use(cors())

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
//get
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {

  const date = new Date('Sat Jan 22 2022 22:27:20 GMT+1000');
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZone: 'Australia/Sydney'
  };
  const formattedDate = date.toLocaleString('en-AU', options);
  
  console.log(formattedDate);
  response.send(`Phonebook has info for ${persons.length} people \n ${formattedDate}`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id ===id)

  if (person){
    response.json(person)
  } else {
    response.status(404).end()
  }
})

//post
const generateId = () => {
  const id = Math.floor(Math.random() * 100) + 1;
  return id;
}

app.post('/api/persons/', (request, response) => {
  const body = request.body

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,  
  }

  for (const p of persons){
    if (person.name == p.name){
      return response.status(400).json({
        error: 'name already in phonebook'
    }) 
    } else if (person.name == '' || person.number ==''){
      return response.status(400).json({
        error: 'content missing'
    })
    }
  }

  persons = persons.concat(person)

  response.json(person)

})



//delete
app.delete('/api/persons/:id', (request, resposne) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !==id)

  resposne.status(204).end()
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})