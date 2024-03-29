import {
    get,
    getDatabase,
    limitToFirst,
    orderByKey,
    query,
    ref,
    startAt
} from 'firebase/database';
import { useEffect, useState } from "react";
export default function useVideoList(page){
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState(false)
    const [videos,setVideos]=useState([])
    const [hasMore,setHasMore]=useState(true) //To set the scrollbar downward.

    useEffect(()=>{
        //database related works
        async function fetchVideos(){
            const db=getDatabase()
            const videosRef=ref(db,'videos')
            const videoQuery=query(
                videosRef,
                orderByKey(),
                startAt(''+page),
                limitToFirst(8)
            )
            try {
                setError('')
                setLoading(true)
              //request firebase database
              const snapshot=await get(videoQuery)
              setLoading(false)

              if(snapshot.exists()){
                   setVideos((prevVideos)=>{
            // prevVideos and Object.values returns objects and finally destructuring them returns an array// 
                      return [...prevVideos,...Object.values(snapshot.val())]
                   })
              }else{
                  setHasMore(false)  //When the items are finished.
              }
            }catch(err){
                console.log(err)
                setLoading(false)
                setError(true)
            }
        }
        setTimeout(()=>{
        fetchVideos()
    },2000)

    },[page])
    return {
        loading,
        error,
        videos,
        hasMore
    }
}