
import React from 'react'

type ButtonProps = {

  label: string                                        
  className?: string

}  

export const Button : React.FC<ButtonProps> = ({label,className}) => {
  return (
    <button 
    
            className={`${className || ''}`}
    >
            {label}

    </button>
  )
}
