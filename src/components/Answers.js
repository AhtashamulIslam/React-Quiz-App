import { Fragment } from 'react'
import classes from '../styles/Answers.module.css'
import Checkbox from './Checkbox'
export default function Answers({options=[],handleChange,input}){
    //As Answers is a reusable Component . One for Quiz (Questions)  and another for
    // Analysis (Result Page) Component. When User presses Checkbox then it will
    // turn true in input prop and Rendered in Questions page.
    return (
        <div className={classes.answers}>
        {options.map((option,index)=>(
        <Fragment key={index}>
          {input ? (    //  It is for submitting the answers of the questions.
            <Checkbox 
            key={index}
            className={classes.answer} 
            text={option.title} 
            value={index} 
            checked={option.checked} 
            onChange={(e)=>handleChange(e,index)} 
            />
          ) : (
            <Checkbox         //  It will be rendered in Result page.
            key={index}
        className={`${classes.answer} ${
          option.correct ?
           classes.correct 
           : option.checked 
           ? classes.wrong : null
        }`}
        text={option.title} 
        defaultChecked={option.checked} 
        disabled
        
        />
          )}
        </Fragment>
        ))}
        </div>
    )
}