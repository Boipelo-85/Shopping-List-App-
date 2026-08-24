import { useState, useRef, useEffect } from 'react'
import { Text } from '../Text/Text';
import { FaEdit, FaEllipsisH, FaTrash, FaCopy } from 'react-icons/fa';

interface ListItem {
  id: number;
  name: string;
  listType: 'Grocery list' | 'Categorized list' | 'Basic list';
  items: Item[];
}

interface Item {
  id: number;
  name: string;
  quantity: number;
  category: string;
  notes?: string;
  image?: string;
}

export const Home = ({ searchQuery = '' }: { searchQuery?: string }) => {
//   const [lists, setLists] = useState<ListItem[]>([
//     { id: 1, name: 'Grocery List', listType: 'Grocery list', items: [] },
//     { id: 2, name: 'Party Supplies', listType: 'Categorized list', items: [] },
//     { id: 3, name: 'Office Items', listType: 'Basic list', items: [] }
//   ]);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [items, setItems] = useState<Item[]>([]);

  const [editListType, setEditListType] = useState<'Grocery list' | 'Categorized list' | 'Basic list'>('Grocery list');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<number | null>(null);
  const [showAddListPopup, setShowAddListPopup] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListType, setNewListType] = useState<'Grocery list' | 'Categorized list' | 'Basic list'>('Grocery list');
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemCategory, setItemCategory] = useState('');
  const [itemNotes, setItemNotes] = useState('');
  const [itemImage, setItemImage] = useState<File | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [sortMethod, setSortMethod] = useState<'alphabetical' | 'manual'>('manual');
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

//   const saveEdit = (id: number) => {
//     setLists(lists.map(list => 
//       list.id === id ? { ...list, name: editName, listType: editListType } : list
//     ));
//     setEditingId(null);
//     setEditName('');
//     setEditListType('Grocery list');
//   };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditListType('Grocery list');
  };

//   const duplicateList = (id: number) => {
//     const listToDuplicate = lists.find(list => list.id === id);
//     if (listToDuplicate) {
//       const newId = Math.max(...lists.map(l => l.id)) + 1;
//       setLists([...lists, { 
//         ...listToDuplicate, 
//         id: newId, 
//         name: `${listToDuplicate.name} (Copy)`,
//         items: [...listToDuplicate.items]
//       }]);
//     }
//     setOpenDropdownId(null);
//   };

//   const addNewList = () => {
//     if (newListName.trim()) {
//       const newId = lists.length > 0 ? Math.max(...lists.map(l => l.id)) + 1 : 1;
//       setLists([...lists, {
//         id: newId,
//         name: newListName,
//         listType: newListType,
//         items: []
//       }]);
//       setNewListName('');
//       setNewListType('Grocery list');
//       setShowAddListPopup(false);
//     }
//   };

  const cancelAddList = () => {
    setNewListName('');
    setNewListType('Grocery list');
    setShowAddListPopup(false);
  };

  const confirmRemove = (id: number) => {
    setItemsToDelete(id);
    setShowConfirmDialog(true);
    setOpenDropdownId(null);
  };

  const removeList = () => {
    if (itemsToDelete !== null) {
      setItems(items.filter(item => item.id !== itemsToDelete));
      setItemsToDelete(null);
      setShowConfirmDialog(false);
    }
  };

  const openAddItemModal = (listId: number) => {
    setSelectedListId(listId);
    setShowAddItemModal(true);
  };

  const closeAddItemModal = () => {
    setShowAddItemModal(false);
    setSelectedListId(null);
    setItemName('');
    setItemQuantity(1);
    setItemCategory('');
    setItemNotes('');
    setItemImage(null);
  };

  const addItem = () => {
   if (itemName.trim()) {
    const newItem: Item = {
      id: Date.now(),
      name: itemName,
      quantity: itemQuantity,
      category: itemCategory,
      notes: itemNotes || undefined,
      image: itemImage ? URL.createObjectURL(itemImage) : undefined
    };
    setItems([...items, newItem]);
    closeAddItemModal();
    setToastMessage('Item added successfully!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setItemImage(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setItemImage(file);
    }
  };

  const getSortedLists = () => {
    if (sortMethod === 'alphabetical') {
      return [...items].sort((a, b) => a.name.localeCompare(b.name));
    }
    return items;
  };

  // Search filtering logic
  const getFilteredLists = () => {
    if (!searchQuery.trim()) {
      return getSortedLists();
    }

    const query = searchQuery.toLowerCase();
    
    return items.filter(Itemslist => {
      // Check if list name matches
      const listNameMatches = Itemslist.name.toLowerCase().includes(query);
      
      // Check if any items in this list match
      const hasMatchingItems = items.some(item => 
        item.name.toLowerCase().includes(query)
      );
      
      return listNameMatches || hasMatchingItems;
    });
  };

  const getFilteredItems = () => {
    if (!searchQuery.trim()) {
      return items.flatMap(list => list.id);
    }

    const query = searchQuery.toLowerCase();
    
    return items.flatMap(item =>
      item.id
    );
  };

  return (
        <>
            {/* Toast Notification */}
            {showToast && (
                <div className='toast-notification'>
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* home content for its */}
            <div className='home-content'>

            <div className='innerContent'>
                {/* Button at the top right for sort by and add list */}
                <div className='buttons-content'>
                    <label className='sort-label' >Sort by :</label>
                    <select className='sort-by-section' value={sortMethod} onChange={(e) => setSortMethod(e.target.value as 'alphabetical' | 'manual')}>
                        <option value="alphabetical">Alphabetically</option>
                        <option value="manual">Manually</option>
                    </select>
                    <button className='addList-content' onClick={() => setShowAddItemModal(true)}>
                        Add Item
                    </button>
                </div>
            </div>
            {/* Main content where my list and the items will be placed */}
            <div className='main-content-card'>

                <div className='heading-names'>
                    <Text variant={'h2'} style={{ fontWeight: 'bold', fontFamily: "'Courier New', Courier, monospace" }}> Items </Text>
                </div>

                {/* List and Items section */}
                {/* <div className='List-section-card'>
                    {getFilteredLists().map((list) => (
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
                                        <div 
                                            style={{ color:'#000',fontWeight: 'bold', fontFamily: "'Courier New', Courier, monospace", marginLeft: '-640px',paddingLeft:'15px', cursor: 'pointer', fontSize: '24px' }} 
                                            onClick={() => openAddItemModal(list.id)}
                                        >
                                         {list.name}</div>
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
                </div> */}
                {/* <div>
                    <Text variant={'h2'} style={{ fontWeight: 'bold', fontFamily: "'Courier New', Courier, monospace", marginLeft: '-700px' }}> Items</Text>
                </div> */}

                <div className='Items-section-card'>
                    <table className='table-content'>
                        <thead>
                            <tr>
                                <th className='text-left'>Item picture and name</th>
                                <th className='text-center'>Quantity</th>
                                <th className='text-center'>Edit</th>
                                <th className='text-right'>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id} className='item-row'>
                                    <td className='text-left'>
                                        <div className='item-cell'>
                                            {item.image && (
                                                <img src={item.image} alt={item.name} className='item-image' />
                                            )}
                                            <div className='item-details'>
                                                <div className='item-name'>{item.name}</div>
                                                {item.category && (
                                                    <div className='item-subtext'>Category: {item.category}</div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className='text-center'>
                                        <div className='quantity-stepper'>
                                            <button className='stepper-btn'>+</button>
                                            <span className='stepper-value'>{item.quantity}</span>
                                            <button className='stepper-btn'>−</button>
                                        </div>
                                    </td>
                                    <td className='text-center'>
                                        <button onClick={() => startEditing} className='dropdown-item'>
                                            <FaEdit /> 
                                        </button>
                                    </td>
                                    <td className='text-right'>
                                        <button  onClick={() => confirmRemove(item.id)} className='delete-btn'>
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
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
                        <p>Are you sure you want to remove this item?</p>
                        <div className='confirm-dialog-buttons'>
                            <button onClick={() => setShowConfirmDialog(false)} className='cancel-btn'>Cancel</button>
                            <button onClick={removeList} className='remove-btn'>Remove</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add List Popup */}
            {/* {showAddListPopup && (
                <div className='add-list-popup-overlay'>
                    <div className='add-list-popup'>
                        <h3>Add New List</h3>
                        <div className='add-list-form'>
                            <div className='form-row'>
                                <label className='list-label'>List Name :</label>
                                <input
                                    type='text'
                                    value={newListName}
                                    onChange={(e) => setNewListName(e.target.value)}
                                    className='add-list-input'
                                    placeholder='.Enter list name'
                                    autoFocus
                                />
                            </div>
                            <div className='form-row'>
                                <label className='list-label'>List Type :</label>
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
            )} */}

            {/* Add Item Modal */}
            {showAddItemModal && (
                <div className='add-item-modal-overlay'>
                    <div className='add-item-modal'>
                        <div className='modal-header'>
                            <h3>Add New Item</h3>
                            <p className='modal-subtitle'>Add a new item to this list</p>
                            <button className='modal-close-btn' onClick={closeAddItemModal}>×</button>
                        </div>
                        <div className='add-item-form'>
                            <div className='form-row-two-col'>
                                <div className='form-group-item'>
                                    <label>Item Name</label>
                                    <input
                                        type='text'
                                        value={itemName}
                                        onChange={(e) => setItemName(e.target.value)}
                                        className='item-input'
                                        placeholder='Fill your item name'
                                        autoFocus
                                    />
                                </div>
                                <div className='form-group-item'>
                                    <label>Category</label>
                                    <select
                                        value={itemCategory}
                                        onChange={(e) => setItemCategory(e.target.value)}
                                        className='item-select'
                                    >
                                        <option value=''>Search Category</option>
                                        <option value='Food'>Food</option>
                                        <option value='Beverages'>Beverages</option>
                                        <option value='Household'>Household</option>
                                        <option value='Personal Care'>Personal Care</option>
                                        <option value='Other'>Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className='form-group-item'>
                                <label>Quantity</label>
                                <input
                                    type='number'
                                    value={itemQuantity}
                                    onChange={(e) => setItemQuantity(parseInt(e.target.value) || 1)}
                                    className='item-input'
                                    min='1'
                                />
                            </div>
                            <div className='form-group-item'>
                                <label>Optional Notes</label>
                                <textarea
                                    value={itemNotes}
                                    onChange={(e) => setItemNotes(e.target.value)}
                                    className='item-textarea'
                                    placeholder='Add any additional notes (optional)'
                                    rows={3}
                                />
                            </div>
                            <div className='form-group-item'>
                                <label>Upload Image</label>
                                <div 
                                    className='image-upload-zone'
                                    onDrop={handleDrop}
                                    onDragOver={(e) => e.preventDefault()}
                                >
                                    <div className='upload-prompt'>
                                        <span>Choose file or Drag and drop image here</span>
                                    </div>
                                    <input
                                        type='file'
                                        accept='image/*'
                                        onChange={handleImageUpload}
                                        className='file-input'
                                    />
                                    <button className='browse-btn'>Browse file</button>
                                </div>
                                {itemImage && (
                                    <div className='image-preview'>
                                        <img src={URL.createObjectURL(itemImage)} alt='Preview' />
                                        <button onClick={() => setItemImage(null)} className='remove-image-btn'>×</button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='add-item-buttons'>
                            <button onClick={closeAddItemModal} className='cancel-btn'>Cancel</button>
                            <button onClick={addItem} className='confirm-btn'>Add Item</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </>

    )
}
