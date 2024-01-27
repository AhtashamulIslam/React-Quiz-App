import { useRef, useState } from 'react'
import classes from '../styles/ProgressBar.module.css'
import Button from './Button'
export default function ProgressBar({next,prev,progress,submit}){
      const [tooltip,setTooltip]=useState(false)
      const tooltipRef=useRef()      // Take the reference of Element in Mark-Up.

      function toggleTooltip(){
        if(tooltip){
          setTooltip(false)
          tooltipRef.current.style.display='none'
        }
        else{
          setTooltip(true)
          tooltipRef.current.style.left=`calc(${progress}% - 65px)`
            //Make this tooltip dynamic in left property in ProgressBar.module.css

          tooltipRef.current.style.display='block'
        }
      }
    return (
        <div className={classes.progressBar}>
          <div className={classes.backButton} onClick={prev}>
            <span className="material-icons-outlined"> arrow_back </span>
          </div>
          <div className={classes.rangeArea}>
            <div className={classes.tooltip} ref={tooltipRef}>{progress}% Cimplete!</div>
            <div className={classes.rangeBody}>
              <div 
              className={classes.progress} 
              style={{width: `${progress}%`}}
              onMouseOver={toggleTooltip}
              onMouseOut={toggleTooltip}
              ></div>
            </div>
          </div>
           <Button className={classes.next} onClick={ progress === 100 ? submit : next}>
            <span>{ progress === 100 ? 'Submit Answers' : 'Next Question'}</span>
            <span className="material-icons-outlined"> arrow_forward </span>
           </Button>
          </div>
    )
}