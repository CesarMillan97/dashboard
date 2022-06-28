import { useState } from 'react'
import { useCollection } from '../../hooks/useCollection'
import { useAuthContext } from '../../hooks/useAuthContext'
// components 
import ProjectList from '../../components/ProjectList'
// styles
import './Dashboard.css'
import ProjectFilter from './ProjectFilter'

export default function Dashboard() {
  const { error, documents } = useCollection('projects')
  const [currentFilter, setCurrentFilter] = useState('all')
  const { user } = useAuthContext()

  const changeFilter = (newFilter) => {
    setCurrentFilter(newFilter)
  }

  const projects = documents ? documents.filter((doc) => {
    switch (currentFilter) {
      case 'all':
        return true
      case 'mine': 
        let assignedToMe = false
        
        doc.assignedUsersList.forEach((u) => {
          if (u.id === user.uid) {
            assignedToMe = true
          }
        })
        return assignedToMe

      case 'development':
      case 'design':
      case 'sales':
      case 'marketing':
        console.log(doc.category, currentFilter);
        return doc.category === currentFilter

      default:
        return true
    }
  }) : null

  return (
    <div>
      <h2 className="page-title">Dashboard</h2>
      {error && <p className='error'>{error}</p> }
      {documents && 
        <ProjectFilter currentFilter={currentFilter} changeFilter={changeFilter}/> 
      }
      {projects && <ProjectList projects={projects} />}
    </div>
  )
}
