import _ from 'lodash'
import { useLocation, useParams } from 'react-router-dom'
import useAnswers from '../../hooks/useAnswers'
import Analysis from '../Analysis'
import Summary from '../Summary'
export default function Result(){
    const {id}=useParams()  // Take the Video Id
     const location=useLocation()
     const {state}=location
     const {qna}=state  // Take the user's given answers
     const {loading,error,answers}=useAnswers(id)  // Pass the Video Id and returned
            // the correct answers of the questions of that video in answers

    function calculate(){
        let score=0

        answers.forEach((question,qIndex)=>{
            let correctIndexes=[]
            let checkedIndexes=[]
             question.options.forEach((option,optIndex)=>{
                if(option.correct) correctIndexes.push(optIndex)
                if(qna[qIndex].options[optIndex].checked){
                    checkedIndexes.push(optIndex)
                option.checked=true // It is to take the User's answers for        Analyzing in Analyze Component.

                }
             })
        if(_.isEqual(correctIndexes,checkedIndexes)){
            //Check the Arrays looks same or not using lodash
            score = score + 5
        }      
             
     })
         return score
    }

    const userScore=calculate()
    
    return (
        <>
        {loading && <div>Loading...</div>}
        {error && <div>There was an Error !</div>}
        {answers && answers.length > 0 && (
        <>
        <Summary score={userScore} noq={answers.length}/>
        <Analysis answers={answers}/>
        </>
        )}
        </>
    )
}