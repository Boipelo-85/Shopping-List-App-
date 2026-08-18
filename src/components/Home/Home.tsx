import React from 'react'
import { Text } from '../Text/Text';

export const Home = () => {
    return (

        // home content for its
        <div className='home-content'>

            <div className='innerContent'>
                {/* Button at the top right for sort by and add list */}
                <div className='buttons-content'>
                    <label className='sort-label' >Sort by :</label>
                    <select className='sort-by-section'>
                        <option value="alphabetical">Aplhabetically</option>
                        <option value="mannual">Mannually</option>
                    </select>

                    <button className='addList-content'>
                        Add list
                    </button>
                </div>
            </div>
            {/* Main content where my list and the items will be placed */}
            <div className='main-content-card'>

                <div className='heading-names'>
                    <Text variant={'h2'} style={{ fontWeight: 'bold', fontFamily: "'Courier New', Courier, monospace" }}> List</Text>
                </div>

                {/* List and Items section */}
                <div className='List-Items-section-card'>

                    <div className='content-list'>

                        <Text variant={'h2'} style={{ fontWeight: 'bold', fontFamily: "'Courier New', Courier, monospace",marginLeft:'-700px' }}> itemsss</Text>

                    </div>
                      <div className='content-list'>

                        <Text variant={'h2'} style={{ fontWeight: 'bold', fontFamily: "'Courier New', Courier, monospace" ,marginLeft:'-700px'}}> itemsss</Text>

                    </div>
                      <div className='content-list'>

                        <Text variant={'h2'} style={{ fontWeight: 'bold', fontFamily: "'Courier New', Courier, monospace",marginLeft:'-700px' }}> itemsss</Text>

                    </div>
                    

                </div>

            </div>




        </div>

    )
}
