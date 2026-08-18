import { useState, useRef, useEffect } from 'react'
import { Text } from '../Text/Text';
import { FaEdit, FaEllipsisH, FaTrash, FaCopy } from 'react-icons/fa';

interface ListItem {
  id: number;
  name: string;
  listType: 'Grocery list' | 'Categorized list' | 'Basic list';
  items: string[];
}

export const Home = () => {
  const [lists, setLists] = useState<ListItem[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editListType, setEditListType] = useState<'Grocery list' | 'Categorized list' | 'Basic list'>('Grocery list');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [listToDelete, setListToDelete] = useState<number | null>(null);
  const [showAddListPopup, setShowAddListPopup] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListType, setNewListType] = useState<'Grocery list' | 'Categorized list' | 'Basic list'>('Grocery list');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdownId !== null && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdownId]);

  const toggleDropdown = (id: number) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const startEditing = (id: number, currentName: string, currentListType: 'Grocery list' | 'Categorized list' | 'Basic list') => {
    setEditingId(id);
    setEditName(currentName);
    setEditListType(currentListType);
    setOpenDropdownId(null);
  };

  const saveEdit = (id: number) => {
    setLists(lists.map(list => 
      list.id === id ? { ...list, name: editName, listType: editListType } : list
    ));
    setEditingId(null);
    setEditName('');
    setEditListType('Grocery list');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditListType('Grocery list');
  };

  const duplicateList = (id: number) => {
    const listToDuplicate = lists.find(list => list.id === id);
    if (listToDuplicate) {
      const newId = Math.max(...lists.map(l => l.id)) + 1;
      setLists([...lists, { 
        ...listToDuplicate, 
        id: newId, 
        name: `${listToDuplicate.name} (Copy)`,
        items: [...listToDuplicate.items]
      }]);
    }
    setOpenDropdownId(null);
  };

  const addNewList = () => {
    if (newListName.trim()) {
      const newId = lists.length > 0 ? Math.max(...lists.map(l => l.id)) + 1 : 1;
      setLists([...lists, {
        id: newId,
        name: newListName,
        listType: newListType,
        items: []
      }]);
      setNewListName('');
      setNewListType('Grocery list');
      setShowAddListPopup(false);
    }
  };

  const cancelAddList = () => {
    setNewListName('');
    setNewListType('Grocery list');
    setShowAddListPopup(false);
  };

  const confirmRemove = (id: number) => {
    setListToDelete(id);
    setShowConfirmDialog(true);
    setOpenDropdownId(null);
  };

  const removeList = () => {
    if (listToDelete !== null) {
      setLists(lists.filter(list => list.id !== listToDelete));
      setListToDelete(null);
      setShowConfirmDialog(false);
    }
  };

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
                    <button className='addList-content' onClick={() => setShowAddListPopup(true)}>
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
                    {lists.map((list) => (
                        <div key={list.id} className='content-list' ref={openDropdownId === list.id ? dropdownRef : null}>
                            <div className='list-info'>
                                {editingId === list.id ? (
                                    <div className='edit-name-container'>
                                        <input
                                            type='text'
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className='edit-name-input'
                                            autoFocus
                                        />
                                        <select
                                            value={editListType}
                                            onChange={(e) => setEditListType(e.target.value as 'Grocery list' | 'Categorized list' | 'Basic list')}
                                            className='edit-type-select'
                                        >
                                            <option value='Grocery list'>Grocery list</option>
                                            <option value='Categorized list'>Categorized list</option>
                                            <option value='Basic list'>Basic list</option>
                                        </select>
                                        <button onClick={() => saveEdit(list.id)} className='save-edit-btn'>Save</button>
                                        <button onClick={cancelEdit} className='cancel-edit-btn'>Cancel</button>
                                    </div>
                                ) : (
                                    <>
                                        <Text variant={'h2'} style={{ fontWeight: 'bold', fontFamily: "'Courier New', Courier, monospace", marginLeft: '-650px',paddingLeft:'5px' }}> {list.name}</Text>
                                        <Text variant={'p'} style={{ fontSize: '12px', color: '#999', marginLeft: '-700px', marginTop: '5px' }}>{list.items.length} items</Text>
                                    </>
                                )}
                            </div>
                            <div className='list-actions'>
                                <button 
                                    className='ellipsis-button' 
                                    onClick={() => toggleDropdown(list.id)}
                                    title='Action Section'
                                >
                                    <FaEllipsisH />
                                </button>
                                {openDropdownId === list.id && (
                                    <div className='dropdown-menu'>
                                        <button onClick={() => startEditing(list.id, list.name, list.listType)} className='dropdown-item'>
                                            <FaEdit /> Edit Name
                                        </button>
                                        <button onClick={() => duplicateList(list.id)} className='dropdown-item'>
                                            <FaCopy /> Duplicate
                                        </button>
                                        <button onClick={() => confirmRemove(list.id)} className='dropdown-item dropdown-item-danger'>
                                            <FaTrash /> Remove
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
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

            {/* Confirm Dialog */}
            {showConfirmDialog && (
                <div className='confirm-dialog-overlay'>
                    <div className='confirm-dialog'>
                        <h3>Confirm Remove</h3>
                        <p>Are you sure you want to remove this list?</p>
                        <div className='confirm-dialog-buttons'>
                            <button onClick={() => setShowConfirmDialog(false)} className='cancel-btn'>Cancel</button>
                            <button onClick={removeList} className='confirm-btn'>Remove</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add List Popup */}
            {showAddListPopup && (
                <div className='add-list-popup-overlay'>
                    <div className='add-list-popup'>
                        <h3>Add New List</h3>
                        <div className='add-list-form'>
                            <div className='form-row'>
                                <label>List Name :</label>
                                <input
                                    type='text'
                                    value={newListName}
                                    onChange={(e) => setNewListName(e.target.value)}
                                    className='add-list-input'
                                    placeholder='Enter list name'
                                    autoFocus
                                />
                            </div>
                            <div className='form-row'>
                                <label>List Type :</label>
                                <select
                                    value={newListType}
                                    onChange={(e) => setNewListType(e.target.value as 'Grocery list' | 'Categorized list' | 'Basic list')}
                                    className='add-list-select'
                                >
                                    <option value='Grocery list'>Grocery list</option>
                                    <option value='Categorized list'>Categorized list</option>
                                    <option value='Basic list'>Basic list</option>
                                </select>
                            </div>
                        </div>
                        <div className='add-list-buttons'>
                            <button onClick={cancelAddList} className='cancel-btn'>Cancel</button>
                            <button onClick={addNewList} className='confirm-btn'>Add List</button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    )
}
