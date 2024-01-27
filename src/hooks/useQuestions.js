import {
    get,
    getDatabase,
    orderByKey,
    query,
    ref
} from 'firebase/database';
import { useEffect, useState } from "react";
export default function useQuestions(videoID){
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState(false)
    const [questions,setQuestions]=useState([])
    
    useEffect(()=>{
        //database related works
        async function fetchQuestions(){
            const db=getDatabase()
            const quizRef=ref(db,'quiz/'+videoID+'/questions')
            const quizQuery=query(
                quizRef,
                orderByKey()
            )
            try {
                setError('')
                setLoading(true)
              //request firebase database
              const snapshot=await get(quizQuery)
              setLoading(false)

              if(snapshot.exists()){
                   setQuestions((prevQuestions)=>{
            // prevVideos and Object.values returns objects and finally destructuring them returns an array// 
                      return [...prevQuestions,...Object.values(snapshot.val())]
                   })
              }
            }catch(err){
                console.log(err)
                setLoading(false)
                setError(true)
            }
        }
        
        fetchQuestions()
    

    },[videoID])
    return {
        loading,
        error,
        questions,
    }
}