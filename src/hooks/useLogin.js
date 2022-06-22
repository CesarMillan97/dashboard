import { projectAuth, projectFirestore } from "../firebase/config";
import { useState, useEffect } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
   const [isPending, setIsPending] = useState(false)
   const [error, setError] = useState(null)
   const [isCancelled, setIsCancelled] = useState(false)
   const { dispatch } = useAuthContext()

   const login = async (email, password) => {
      setError(null)
      setIsPending(true)
      try {
         const res = await projectAuth.signInWithEmailAndPassword(email, password)
         
         // update online status
         await projectFirestore.collection('users').doc(res.user.uid).update({ online: true })
         
         dispatch({ type: 'LOGIN', payload: res.user })
         // Update the state if user cancel
         if (!isCancelled) {
            setError(null)
            setIsPending(false)
         }
      } catch (err) {
         if (!isCancelled) {
            setError('Could not log the user')
            setIsPending(false)
            console.log(err.message);
         }
      }
   }

   useEffect(()=> {
      return () => setIsCancelled(true)
   },[])

   return { login, isPending, error }
}