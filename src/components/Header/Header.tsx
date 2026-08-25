import { Text } from '../Text/Text';
import searchIcon from '../../assets/searchbar.png'
import { ProfileDropdown } from '../ProfileDropdown/ProfileDropdown';
import { FaClipboardList } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';
import { useRef, useCallback } from 'react';

export const Header = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      if (query.trim()) {
        setSearchParams({ search: query });
      } else {
        setSearchParams({});
      }
    }, 300);
  }, [setSearchParams]);

  return (

    <nav className='nav'>

        <div className='nav-content'>

                <Text variant={'h2'} style={{fontWeight: 'bold',fontFamily: "'Courier New', Courier, monospace"}}><FaClipboardList style={{color:'#000',fontSize:'25px',marginRight:'-7px'}}/> Shopping List-App </Text>
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
