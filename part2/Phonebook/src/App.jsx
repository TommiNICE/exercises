import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchQuery, setNewSearch] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => { 
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addNameAndNumber = (event) => {
    event.preventDefault()
    const nameExists = persons.some(person => person.name === newName)
    const numberExists = persons.some(person => person.number === newNumber)
    if (!nameExists) {
      personService
        .create({ name: newName, number: newNumber })
        .then(returnedPerson => {
          console.log(returnedPerson)
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setSuccessMessage(`Added ${newName}`)
          setTimeout(() => {
            setSuccessMessage(null)
          }, 3000)
        })
    } else if (nameExists && !numberExists) {
      const personToUpdate = persons.find(person => person.name === newName)
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personService
         .updateNumber(personToUpdate.id, {name: personToUpdate.name, number: newNumber})
         .then(returnedPerson => {
            setPersons(persons.map(person => person.id === personToUpdate.id? returnedPerson : person))
            setNewName('')
            setNewNumber('')
            setSuccessMessage(`Updated Number to ${newNumber}`)
            setTimeout(() => {
              setSuccessMessage(null)
            }, 3000)
          })
        }
    } else {
      alert(`${newName} is already added to phonebook`)
    }
  }

  const deletePerson = (id) => {
    const personToDelete = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      personService
       .deletePerson(id)
       .then(() => {
          setPersons(persons.filter(person => person.id!== id))
          setSuccessMessage(`Deleted ${personToDelete.name}`)
          setTimeout(() => {
            setSuccessMessage(null)
          }, 3000)
        })
    }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleSearchQuery = (event) => {
    console.log(event.target.value)
    setNewSearch(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage} />
      <Filter searchQuery={searchQuery} handleSearchChange={handleSearchQuery} />
      <h2>add a new</h2>
      <PersonForm newName={newName} newNumber={newNumber} addNameAndNumber={addNameAndNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons persons={persons} searchQuery={searchQuery} deletePerson={deletePerson} />
      
    </div>
  )
}

export default App