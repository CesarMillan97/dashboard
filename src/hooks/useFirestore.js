import { projectFirestore, timestamp } from "../firebase/config";
import { useState, useEffect, useReducer } from "react";

let initialState = {
   document: null,
   error: null,
   isPending: false, 
   success: null
}

const firestoreReducer = (state, action) => {
   switch (action.type) {
      case 'IS_PENDING':
         return { document: null, error: null, isPending: true, success: false }
      case 'ADDED_DOCUMENT':
         return { document: action.payload, error: null, isPending: false, success: true }
      case 'UPDATED_DOCUMENT':
         return { isPending: false, document: action.payload, success: true, error: null}
      case 'DELETED_DOCUMENT':
         return { document: action.payload, error: null, isPending: false, success: true }
      case 'ERROR':
         return { document: null, error: action.payload, isPending: false, success: false}
   
   
      default:
         return state
   }
}

export const useFirestore = (collection) => {
   const [response, dispatch] = useReducer(firestoreReducer, initialState)
   const [isCancelled, setIsCancelled] = useState(false)

   // reference of collection 
   let ref = projectFirestore.collection(collection)

   const dispatchIfNotCancelled = (action) =>{
      if (!isCancelled) {
         dispatch(action)
      }
   }
   // Adding documents
   const addDocument = async(doc) => {
      dispatch({type:'IS_PENDING'})
      try {
         const createdAt = timestamp.fromDate(new Date())
         const addedDocument = await ref.add({...doc, createdAt})
         dispatchIfNotCancelled({ type: 'ADDED_DOCUMENT', payload: addedDocument })
      } catch (err) {
         dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
      }
   }
   // Update Documents 
   const updateDocument = async (id, updates) => {
      dispatch('IS_PENDING')
      try {
         const updatedDocument = await ref.doc(id).update(updates)
         dispatchIfNotCancelled({ type: 'UPDATE_DOCUMENT', payload: updatedDocument})
         return updatedDocument
      } catch (err) {
         dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
         return null
      }
   }
   // Deleting documents
   const deleteDocument = async (id) => {
      dispatch({ type: 'IS_PENDING' })
      try {
         const deletedDocument = await ref.doc(id).delete()
         dispatchIfNotCancelled({ type: 'DELETED_DOCUMENT', payload: deletedDocument })
      } catch (err) {
         dispatchIfNotCancelled({ type: 'ERROR', payload: 'Could not delete' })
      }
   }

   useEffect(() => {
      return () => setIsCancelled(true)
   },[])
   
   return {addDocument, deleteDocument, updateDocument, response }
}