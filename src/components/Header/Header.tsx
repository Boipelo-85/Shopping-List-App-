import React from 'react'
import { Text } from '../Text/Text';

export const Header = () => {
  return (

    <nav className='nav'>

        <div className='nav-content'>
                <Text variant={'h2'}> Boipelo </Text>
        </div>
        <div className='search-items'>
                <input type="text" placeholder='seach for item' style={{padding: '10px',borderRadius:'20px',border:'none'}}/>
        </div>
    </nav>
  )
}
