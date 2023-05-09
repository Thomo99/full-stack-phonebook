const AddPerson = (persons, setPersons, newName, newNumber) => {
    const nameObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    }

    for (let j = 0; j < persons.length; j++){
      if (persons[j].name === newName){
        alert(`${newName} is already added to the phonebook`)
        return null
      }
    }
    setPersons([...persons, nameObject])

    return null
  }

  
  export default AddPerson;