import { useState } from 'react'
import { useSignup } from '../../hooks/useSignup'
// styles
import './Signup.css'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [tumbnail, setTumbnail] = useState(null)
  const [tumbnailError, setTumbnailError] = useState(null)
  const { signup, isPending, error } = useSignup()

  const handleSubmit = (e) => {
    e.preventDefault()
    signup(email, password, displayName, tumbnail);
  }

  const handleFileChange = (e) => {
    setTumbnail(null)
    let selected = e.target.files[0]
    console.log(selected);
    if(!selected){
      setTumbnailError('Please select a file')
      return 
    } 
    if (!selected.type.includes('image')) {
      setTumbnailError('Please select an image')
      return 
    } 
    if (!selected.size > 100000) {
      setTumbnailError('Image file size must be less than 100kb')
      return 
    }

    setTumbnailError(null)
    setTumbnail(selected)
    console.log('tumbnail updated');

  }

  return (
    <div>
      <form className='auth-form' onSubmit={handleSubmit}>
        <h2>Sign up</h2>
        <label>
          <span>Email</span>
          <input type="email" 
            required 
            onChange={(e) => setEmail(e.target.value)} 
            value={email}/>
        </label>
        <label>
          <span>Password</span>
          <input 
            type="password" 
            required 
            onChange={(e) => setPassword(e.target.value)} 
            value={password}/>
        </label>
        <label>
          <span>Display Name</span>
          <input type="text" 
            required 
            onChange={(e) => setDisplayName(e.target.value)}
            value={displayName}/>
        </label>
        <label>
          <span>Profile Tumbnail</span>
          <input type="file" 
            required 
            onChange={handleFileChange}
            />
            {tumbnailError && <div className='error'>{tumbnailError}</div>}
        </label>
        {!isPending && <button className='btn'>Sign up</button>}
        {isPending && <button  className='btn' disabled>Loading...</button>}
        {error && <div className='error'>{error}</div> }
      </form>
    </div>
  )
}
