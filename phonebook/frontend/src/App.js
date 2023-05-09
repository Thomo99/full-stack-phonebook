import React, { useState, useEffect } from 'react'
import Person from './Person'
import personService from './persons'
import Notification from './Notification'
import './index.css'

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [newSearch, setNewSearch]= useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(allPersons => {
        setPersons(allPersons)
      })
  }, [])

  // function to create new name
  const addName = (event) => {
    event.preventDefault()
    const nameObject = {
      // receives content from the components newName state
      name: newName,
      number: newNumber,
    }

    const existing_names = persons.map(person => person.name)

    if (existing_names.includes(newName)) {
      const msg = `${newName} is already added to the phonebook. Replace the old number with the new one?`
      const confirm = window.confirm(msg)
      if (confirm) {
        updateName(nameObject)
        setMessage(`${newName} successfully updated!`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        setNewName('')
        setNewNumber('')
      }
    } else {
      personService
        .create(nameObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setMessage(`${newName} successfully added!`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          setNewName('')
          setNewNumber('')
        })
    }
  }


  const updateName = (nameObject) => {
    const update_person = persons.find(p => p.name === nameObject.name)
    const update_id = update_person.id
    personService
    .update(update_id, nameObject)
    .then(returnedPerson =>
      setPersons(persons.map(person => person.id !== update_id ? person : returnedPerson))
    )
    .catch (error => {
      setMessage('Person does not exist')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      personService
      .getAll()
      .then(allPersons => {
        setPersons(allPersons)
      })
    })
    
  }

  const deleteName = (person) => {
    const msg = `Delete ${person.name}?`
    const confirm = window.confirm(msg)
    if (confirm) {
      personService
        .deletePerson(person.id)
        .then(persons =>
          setPersons(persons)
    )
  setMessage(`${person.name} successfully deleted`)}
  setTimeout(() => {
    setMessage(null)
  }, 5000)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const namesToShow = showAll
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(newSearch.toLowerCase()))

    const handleNewSearch = (event) => {
      setShowAll(false)
      console.log(event.target.value)
      setNewSearch(event.target.value)
    }


  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter: <input 
          value={newSearch}
          onChange={handleNewSearch}
        />
      </div>
      <h2>Add new contact</h2>
      <Notification message={message}/>
      <form onSubmit={addName}>
        <div>
          name: <input  type='text' value={newName} onChange={handleNameChange} /><br />
          number: <input  type='text' value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {namesToShow.map(person =>
          <Person
            key={person.name}
            person={person}
            deleteEntry={() => deleteName(person)} />
        )}
      </ul>
    </div>
  )
}

export default App