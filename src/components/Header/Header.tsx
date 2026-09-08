import { Text } from '../Text/Text';
import searchIcon from '../../assets/searchbar.png'
import { ProfileDropdown } from '../ProfileDropdown/ProfileDropdown';
import { FaClipboardList } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';
import { useRef, useCallback, useEffect, useState } from 'react';

export const Header = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [inputValue, setInputValue] = useState(searchQuery);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setInputValue(query);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setSearchParams((currentParams) => {
        if (query.trim()) {
          currentParams.set('search', query);
        } else {
          currentParams.delete('search');
        }
        return currentParams;
      });
    }, 300);
  }, [setSearchParams]);

  return (

    <nav className='nav'>

        <div className='nav-content'>

                <Text variant={'h2'} style={{fontWeight: 'bold',fontFamily: "'Courier New', Courier, monospace"}}><FaClipboardList style={{color:'#000',fontSize:'25px',marginRight:'-10px'}}/> Shopping List-App </Text>
        </div>
        <div className='search-items'>
                <img src={searchIcon} alt="search logo" className='search-logo' />
                <input 
                  type="text" 
                  className='search-input'
                  placeholder='Search for Item' 
                  value={inputValue}
                  onChange={handleSearchChange}
                />
                
        </div>
        <div className='profile-content'>
              <ProfileDropdown />
        </div>
    </nav>
  )
}
