import { projectAuth, projectFirestore } from '../firebase/config'
import { useState, useEffect } from 'react'
import { useAuthContext } from './useAuthContext'

export const useLogout = () => {
   const [isCancelled, setIsCancelled] = useState(false)
   const [error, setError] = useState(null)
   const [isPending, setIsPending] = useState(false)
   const { dispatch } = useAuthContext()

   const logout = async () => {
      setError(null)
      setIsPending(true)

      try {
         // update online status 
         const { uid } = projectAuth.currentUser
         await projectFirestore.collection('users').doc(uid).update({ online: false })

         await projectAuth.signOut()

         // dispatch the logout 
         dispatch({ type: 'LOGOUT'})

         // Update state
         if (!isCancelled) {
            setError(null)
            setIsPending(false)
         }
      } catch (err) {
         if (!isCancelled) {
            setError('Could not logout the user')
            setIsPending(false)
            console.log(err.message);
         }
      }
   }

   useEffect(()=> {
      return () => setIsCancelled(true)
   },[])

   return { error, isPending, logout }
}