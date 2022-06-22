import { projectFirestore } from "../firebase/config";
import { useState, useRef, useEffect} from 'react'

export const useCollection = (collection, _query, _orderBy) =>{
   const [data, setData] = useState({})
   const [error, setError] = useState('')

   const query = useRef(_query)
   const orderBy = useRef(orderBy)

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
            results.push({...doc.data(), id: doc.id})
         })

         setData(results)
         setError(null)
      }, (err) => {
         setError('Could not fetch data')
         console.log(err.message);
      })
      return () => unsub()
   },[collection, query, orderBy])

   return {error, data}
}