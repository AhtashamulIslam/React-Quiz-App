import { getDatabase, ref, set } from 'firebase/database';
import _ from 'lodash';
import { useEffect, useReducer, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // To import the currentUser
import useQuestions from '../../hooks/useQuestions';
import Answers from '../Answers';
import MiniPlayer from '../MiniPlayer';
import ProgressBar from '../ProgressBar';

const initialState=null
const reducer = (state,action) => {
       switch(action.type){        //The Questions are Cloned Here .         
        case "questions" :          //Here the data come from database make false
              action.value.forEach((question) => {   // until the user checks it.
                question.options.forEach((option)=>{
                    option.checked=false
                })
              })
              return action.value
        case "answer" :     //This case will be fired when user press checkbox
             const questions=_.cloneDeep(state)   // to select an Answer.
                   questions[action.questionID].options[action.optionIndex].checked=action.value
            return questions   
            
   //When any user goes for an option to answer then it will be dispatched.
        default:
            return state

       }
        
}
export default function Quiz(){
    const {id}=useParams() //Take the id of a particular video.
    const {loading,error,questions} = useQuestions(id)
    const [currentQuestion,setCurrentQuestion]=useState(0)
    const [qna,dispatch] = useReducer(reducer,initialState)
    const {currentUser} = useAuth()
    const location=useLocation()
    const {state}=location
    const {videoTitle}=state
    //const {videoTitle}=state
    const navigate=useNavigate()

    useEffect(()=>{    //As the Clone operation is a side effect so it will occur once
        dispatch({
            type:"questions",
            value: questions,
    })
    },[questions])  //After getting the questions the dispatch function is invoked.

    //After Calling the function the whole OPTIONS  are stored in qna with a state
    // checked False so that this state can be controlled/checked by user.

    function handleAnswerChange(e,index){
        dispatch({
            type:"answer",
            questionID: currentQuestion,
            optionIndex: index,
            value: e.target.checked,
        })
    }

//Handle the NEXT button to get the next question.

function nextQuestion(){
    if(currentQuestion+1 < questions.length){
    setCurrentQuestion((prevCurrent)=>prevCurrent+1)
    }
}

// Handle the PREVIOUS button to get back to the PREVIOUS question.

function prevQuestion(){
    if(currentQuestion >= 1 && currentQuestion <= questions.length){
    setCurrentQuestion((prevCurrent)=>prevCurrent-1)
    }
}

//Calculate Percentage of progress.

const percentage=questions.length > 0 ? ((currentQuestion + 1)/questions.length) * 100 : 0

async function submit(){
    const {uid}= currentUser  // Come from the firebase database
    //To submit the user's answers to database 
    const db=getDatabase()
    const resultRef=ref(db,`result/${uid}`) // Here Create a result node under uid

    await set(resultRef,{
        [id]:qna,  // user can hit any video (id will be dynamic) to play quiz 
        })
        navigate(`/result/${id}`,
        {state:{
            qna
        }}
        )

}

    return (
        <>
        {loading && <div>Loading...</div>}
        {error && <div>There was an Error ! </div>}
        {!loading && !error && qna && qna.length>0 && (
        <>
        <h1>{qna[currentQuestion].title}</h1>
   {/*Here qna holds the questions as an array and [currentQuestin] is index*/}
        <h4>Question can have multiple answers</h4>
        <Answers input options={qna[currentQuestion].options} handleChange={handleAnswerChange}/>
        <ProgressBar 
          next={nextQuestion} 
          prev={prevQuestion} 
          submit={submit}
          progress={percentage}
          />
        <MiniPlayer id={id} title={videoTitle}/>
        </>
    )}
    </>
    )
}