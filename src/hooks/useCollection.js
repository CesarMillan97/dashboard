import { projectFirestore } from "../firebase/config";
import { useState, useRef, useEffect} from 'react'

export const useCollection = (collection, _query, _orderBy) =>{
   const [documents, setDocuments] = useState(null)
   const [error, setError] = useState('')

   const query = useRef(_query).current
   const orderBy = useRef(_orderBy).current
   

   useEffect(()=> {
      let ref = projectFirestore.collection(collection)

      if (query) {
         ref = ref.where(...query)
      }

      if (orderBy) {
         ref = ref.orderBy(...orderBy)
      }

      let unsub = ref.onSnapshot((snapshot) => {
         let results = []
         snapshot.docs.forEach((doc)=>{
            results.push({ ...doc.data(), id: doc.id })
         })

         setDocuments(results)
         setError(null)
      }, (err) => {
         setError('Could not fetch data')
         console.log(err.message);
      })
      return () => unsub()
   },[collection, query, orderBy])

   return {error, documents}
}