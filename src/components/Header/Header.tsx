import { Text } from '../Text/Text';
import searchIcon from '../../assets/searchbar.png'
import { ProfileDropdown } from '../ProfileDropdown/ProfileDropdown';

interface HeaderProps {
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export const Header = ({ searchQuery = '', setSearchQuery }: HeaderProps) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (setSearchQuery) {
      setSearchQuery(e.target.value);
    }
  };

  return (

    <nav className='nav'>

        <div className='nav-content'>
                <Text variant={'h2'} style={{fontWeight: 'bold',fontFamily: "'Courier New', Courier, monospace"}}> Shopping List-App </Text>
        </div>
        <div className='search-items'>
                <img src={searchIcon} alt="search logo" className='search-logo' />
                <input 
                  type="text" 
                  placeholder='Search for Item' 
                  value={searchQuery}
                  onChange={handleSearchChange}
                  style={{padding: '10px 10px 10px 45px',borderRadius:'20px',border:'none',background:'#fdfdfd'}}
                />
        </div>
        <div className='profile-content'>
              <ProfileDropdown />
        </div>
    </nav>
  )
}
