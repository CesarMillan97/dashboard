import { useState, useEffect } from "react";
import { useAuthContext } from "./useAuthContext";
import { projectAuth, projectStorage, projectFirestore } from "../firebase/config";

export const useSignup = () => {
   const [isCancelled, setIsCancelled] = useState(false)
   const [error, setError] = useState(null)
   const [isPending, setIsPending] = useState(false)
   const { dispatch } = useAuthContext()

   const signup = async (email, password, displayName, thumbnail) => {
      setIsPending(true)
      setError(null)

      try {
         // signup the user 
         let res = await projectAuth.createUserWithEmailAndPassword(email, password)

         if (!res) {
            throw Error('Could not create this user')
         }

         // Upload user thumbnail 
         const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`
         const img = await projectStorage.ref(uploadPath).put(thumbnail)
         const imgUrl = await img.ref.getDownloadURL()
         
         // Create the name of the user
         await res.user.updateProfile({ displayName, photoURL: imgUrl })

         // Create a user document
         await projectFirestore.collection('users').doc(res.user.uid).set({
            online: true, 
            displayName,
            photoURL: imgUrl
         })

         // dispatch login
         dispatch({ type: 'LOGIN', payload: res.user })
         if (!isCancelled) {
            setIsPending(false)
            setError(null)
         }
      } catch (err) {
         if (!isCancelled) {
            setIsPending(false)
            setError(err.message)
            console.log(err.message)
         }
      }
   }

   useEffect(() => {
      return () => setIsCancelled(true)
   },[])
   return { error, isPending, signup }
}