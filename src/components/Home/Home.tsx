import React from 'react'
import { Text } from '../Text/Text';
import { FaEdit, FaEllipsisH, FaTrash } from 'react-icons/fa';

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
                <div className='List-section-card'>

                    <div className='content-list'>

                        <Text variant={'h2'} style={{ fontWeight: 'bold', fontFamily: "'Courier New', Courier, monospace", marginLeft: '-700px' }}> List</Text>
                        <button className='ellipsis-button'><FaEllipsisH />  </button>
                    </div>
                    <div className='content-list'>

                        <Text variant={'h2'} style={{ fontWeight: 'bold', fontFamily: "'Courier New', Courier, monospace", marginLeft: '-700px' }}> List</Text>
                        <button className='ellipsis-button'><FaEllipsisH />  </button>
                    </div>
                    <div className='content-list'>

                        <Text variant={'h2'} style={{ fontWeight: 'bold', fontFamily: "'Courier New', Courier, monospace", marginLeft: '-700px' }}> List</Text>
                        <button className='ellipsis-button'><FaEllipsisH />  </button>
                    </div>
                </div>
                <div>
                    <Text variant={'h2'} style={{ fontWeight: 'bold', fontFamily: "'Courier New', Courier, monospace", marginLeft: '-700px' }}> itemsss</Text>
                </div>
                <div className='Items-section-card'>
                    <table border={1} className='table-content'>
                        <tr>
                            <th>Item Picture & Name</th>
                            <th>Quantity</th>
                            <th>Edit</th>
                            <th>Remove</th>
                        </tr>
                        <tr>
                            <td>Image</td>
                            <td>2</td>
                            <td><FaEdit /></td>
                            <td><FaTrash /></td>
                        </tr>
                        <tr>
                            <td>Image</td>
                            <td>1</td>
                            <td><FaEdit /></td>
                            <td><FaTrash /></td>
                        </tr>
                        <tr>
                            <td>Image</td>
                            <td>4</td>
                            <td><FaEdit /></td>
                            <td><FaTrash /></td>
                        </tr>
                    </table>
                    {/* <div className='content-list'>

                        <Text variant={'h2'} style={{ fontWeight: 'bold', fontFamily: "'Courier New', Courier, monospace",marginLeft:'-700px' }}> itemsss</Text>

                    </div>
                      <div className='content-list'>

                        <Text variant={'h2'} style={{ fontWeight: 'bold', fontFamily: "'Courier New', Courier, monospace" ,marginLeft:'-700px'}}> itemsss</Text>

                    </div>
                      <div className='content-list'>

                        <Text variant={'h2'} style={{ fontWeight: 'bold', fontFamily: "'Courier New', Courier, monospace",marginLeft:'-700px' }}> itemsss</Text>

                    </div> */}

                </div>

            </div>


        </div>

    )
}
