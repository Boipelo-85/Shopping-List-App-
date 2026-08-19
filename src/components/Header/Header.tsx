import { Text } from '../Text/Text';
import searchIcon from '../../assets/searchbar.png'
import { FaUserCircle } from 'react-icons/fa';

export const Header = () => {
  return (

    <nav className='nav'>

        <div className='nav-content'>
                <Text variant={'h2'} style={{fontWeight: 'bold',fontFamily: "'Courier New', Courier, monospace"}}> Boipelo </Text>
        </div>
        <div className='search-items'>
                <img src={searchIcon} alt="search logo" className='search-logo' />
                <input type="text" placeholder='Search for Item' style={{padding: '10px 10px 10px 45px',borderRadius:'20px',border:'none',background:'#fdfdfd'}}/>
        </div>
        <div className='profile-content'>

              <a href="#profile"><Text variant={'h3'}> <FaUserCircle className='profile-icon'/></Text></a>
                
        </div>
    </nav>
  )
}
