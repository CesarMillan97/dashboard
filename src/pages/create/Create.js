import { useAuthContext } from '../../hooks/useAuthContext'
import { timestamp } from '../../firebase/config'
import { useEffect, useState } from 'react'
import Select from 'react-select'
import { useCollection } from '../../hooks/useCollection'
import { useFirestore } from '../../hooks/useFirestore'
import { useHistory } from 'react-router-dom'

// styles
import './Create.css'

const categories = [
  { value: 'development', label: 'Development'},
  { value: 'design', label: 'Design'},
  { value: 'sales', label: 'Sales'},
  { value: 'marketing', label: 'Marketing'},
]

export default function Create() {
  const history = useHistory()
  // useFirestore 
  const { addDocument, response } = useFirestore('projects')

  // fetching users for the form 
  const { documents } = useCollection('users')
  const [users, setUsers] = useState([])
  // user 
  const { user } = useAuthContext()
  // Form fields
  const [name, setName] = useState('')
  const [details, setDetails] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState('')
  const [assignedUsers, setAssignedUsers] = useState([])
  const [formError, setFormError] = useState(null)
  
  useEffect(()=> {
    if (documents) {
      const options = documents.map((user) => {
        return { value: user, label: user.displayName }
      })
      setUsers(options)
    } 
  },[documents])
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!category) {
      setFormError('Please assign category to the project')
      return
    }
    if (assignedUsers < 1) {
      setFormError('Please assign users to the project')
      return
    }

    const createdBy = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      id: user.uid
    }

    const assignedUsersList = assignedUsers.map((user) => {
      return { 
        displayName: user.value.displayName,
        photoURL: user.value.photoURL,
        id: user.value.id
       }
    })

    const project = {
      name,
      details,
      dueDate: timestamp.fromDate(new Date(dueDate)),
      category: category.value,
      comments: [],
      createdBy,
      assignedUsersList
    }
    // Save to the Projects collection, redirect to Dashboard
    await  addDocument(project)
    if (!response.error) {
      history.push('/')
    }

  }

  return (
    <div className='create-form'>
      <h2 className="page-title">Create a new project</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Name</span>
          <input 
            type="text" 
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </label>
        <label>
          <span>Details</span>
          <textarea 
            type="text" 
            required
            onChange={(e) => setDetails(e.target.value)}
            value={details}
          />
        </label>
        <label>
          <span>Set due date</span>
          <input 
            type="date" 
            required
            onChange={(e) => setDueDate(e.target.value)}
            value={dueDate}
          />
        </label>
        <label>
          <span>Project category</span>
          <Select
            onChange={(option) => setCategory(option)}
            options={categories}
          />
        </label>
        <label>
          <span>Assign to:</span>
          <Select 
            onChange={(option) => setAssignedUsers(option)}
            options={users}
            isMulti
          />
        </label>
        <button className='btn'>Add project</button>
        {formError && <div className="error">{formError}</div> }
      </form>
    </div>
  )
}
