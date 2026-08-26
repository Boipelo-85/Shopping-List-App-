import { useState, useRef, useEffect } from 'react'
import { Text } from '../Text/Text';
import { FaEdit, FaEllipsisH, FaTrash, FaCopy, FaPlus, FaClipboardList } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { addList, removeList as removeListAction, updateListName, incrementItemCount, decrementItemCount } from '../../store/listSlice';
import { addItem, removeItem as deleteItemAction, updateItemQuantity } from '../../store/itemsSlice';
import type { RootState } from '../../store/store';
import type { AppDispatch } from '../../store/store';
import type { List } from '../../store/listSlice';
import type { Item } from '../../store/itemsSlice';

export const Home = ({ searchQuery = '' }: { searchQuery?: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const lists = useSelector((state: RootState) => state.lists.lists);
  const items = useSelector((state: RootState) => state.items.items);
  
  // Tab Navigation
  const [activeTab, setActiveTab] = useState<'lists' | 'items'>('lists');

  // Dropdown State
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Editing State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  // Confirmation Dialog State
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<number | null>(null);

  // Add List Modal State
  const [showAddListModal, setShowAddListModal] = useState(false);
  const [newListName, setNewListName] = useState('');

  // Add Item Modal State
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemCategory, setItemCategory] = useState('');
  const [itemListId, setItemListId] = useState<number | null>(null);
  const [showNewListInput, setShowNewListInput] = useState(false);
  const [newListFromItem, setNewListFromItem] = useState('');
  const [itemNotes, setItemNotes] = useState('');
  const [itemImage, setItemImage] = useState<File | null>(null);

  // Toast Notification State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Sorting State
  const [sortMethod, setSortMethod] = useState<'alphabetical' | 'manual'>('manual');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdownId !== null && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdownId]);

  // Auto-select newly created list in Add Item modal
  useEffect(() => {
    if (itemCategory && !itemListId) {
      const list = lists.find(l => l.name === itemCategory);
      if (list) {
        setItemListId(list.id);
      }
    }
  }, [lists, itemCategory, itemListId]);

  const toggleDropdown = (id: number) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const startEditing = (id: number, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
    setOpenDropdownId(null);
  };

  const saveEdit = (id: number) => {
    dispatch(updateListName({ id, name: editName }));
    setEditingId(null);
    setEditName('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const duplicateList = (id: number) => {
    const listToDuplicate = lists.find(list => list.id === id);
    if (listToDuplicate) {
      dispatch(addList(`${listToDuplicate.name} (Copy)`));
    }
    setOpenDropdownId(null);
  };

  const addNewList = () => {
    if (newListName.trim()) {
      dispatch(addList(newListName.trim()));
      setNewListName('');
      setShowAddListModal(false);
      setToastMessage('List created successfully!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const cancelAddList = () => {
    setNewListName('');
    setShowAddListModal(false);
  };

  const createListFromItem = () => {
    if (newListFromItem.trim()) {
      const listName = newListFromItem.trim();
      dispatch(addList(listName));
      setItemCategory(listName);
      setNewListFromItem('');
      setShowNewListInput(false);
      setToastMessage('List created successfully!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const confirmRemove = (id: number) => {
    setItemsToDelete(id);
    setShowConfirmDialog(true);
    setOpenDropdownId(null);
  };

  const handleRemoveList = () => {
    if (itemsToDelete !== null) {
      // Remove list and all its items
      dispatch(removeListAction(itemsToDelete));
      const listItems = items.filter(item => item.listId === itemsToDelete);
      listItems.forEach(item => dispatch(deleteItemAction(item.id)));
      setItemsToDelete(null);
      setShowConfirmDialog(false);
      setToastMessage('List removed successfully!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  const handleRemoveItem = (id: number) => {
    const item = items.find(i => i.id === id);
    if (item && item.listId) {
      dispatch(decrementItemCount(item.listId));
    }
    dispatch(deleteItemAction(id));
    setToastMessage('Item removed successfully');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const closeAddItemModal = () => {
    setShowAddItemModal(false);
    // Don't reset itemListId to preserve the selected list filter
    setShowNewListInput(false);
    setNewListFromItem('');
    setItemName('');
    setItemQuantity(1);
    setItemCategory('');
    setItemNotes('');
    setItemImage(null);
  };

  const handleAddItem = () => {
    if (itemName.trim() && itemListId) {
      const selectedList = lists.find(l => l.id === itemListId);
      if (!selectedList) return;

      const newItem = {
        name: itemName,
        quantity: itemQuantity,
        category: itemCategory,
        listId: itemListId,
        notes: itemNotes || undefined,
        image: itemImage ? URL.createObjectURL(itemImage) : undefined
      };

      dispatch(addItem(newItem));
      dispatch(incrementItemCount(itemListId));
      closeAddItemModal();
      setToastMessage('Item added successfully');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity >= 1) {
      dispatch(updateItemQuantity({ id: itemId, quantity: newQuantity }));
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

  // Filter items by selected list
  const filteredItems = itemListId 
    ? items.filter(item => item.listId === itemListId)
    : items;

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
                {/* Tab Navigation */}
                <div className='tab-navigation'>
                    <button 
                        type='button'
                        className={`tab-button ${activeTab === 'lists' ? 'active' : 'inactive'}`}
                        onClick={() => setActiveTab('lists')}
                    >
                        Lists
                    </button>
                    <button 
                        type='button'
                        className={`tab-button ${activeTab === 'items' ? 'active' : 'inactive'}`}
                        onClick={() => {
                            setActiveTab('items');
                            setItemListId(null);
                        }}
                    >
                        Items
                    </button>
                </div>

                {/* Action buttons based on active tab */}
                <div className='buttons-content'>
                    {/* <div className='sort-section'>
                        <label className='sort-label'>Sort by:</label>
                           <select name="" id="" >
                            <option value="">Name</option>
                            <option value="">Category</option>
                            <option value="">Date Created</option>
                           </select>
                    </div> */}
                    
                    {activeTab === 'lists' && (
                        <button type='button' className='addList-content' onClick={() => setShowAddListModal(true)}>
                            <FaPlus style={{ marginRight: '8px' }} /> Add List
                        </button>
                    )}
                    {activeTab === 'items' && (
                        <button type='button' className='addList-content' onClick={() => {
                            // Pre-select the current filtered list if one is selected
                            if (itemListId) {
                                const selectedList = lists.find(l => l.id === itemListId);
                                if (selectedList) {
                                    setItemCategory(selectedList.name);
                                }
                            }
                            setShowAddItemModal(true);
                        }}>
                            <FaPlus style={{ marginRight: '8px' }} /> Add Item
                        </button>
                    )}
                </div>
            </div>
            {/* Main content where my list and the items will be placed */}
            <div className='main-content-card'>

                {/* Lists Tab Content */}
                {activeTab === 'lists' && (
                    <>
                        <div className='heading-names'>
                            <Text variant={'h2'} style={{ fontWeight: 'bold', fontFamily: "'Courier New', Courier, monospace" }}> Lists </Text>
                        </div>
                        <div className='List-section-card'>
                            {lists.length === 0 ? (
                                <div className='empty-state'>
                                    <Text variant='h3'><FaClipboardList style={{fontSize:'50px',color:'#000'}}/></Text>
                                    <p>No lists yet. Create your first list!</p>
                                </div>
                            ) : (
                                lists.map((list) => (
                           
                                    
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
                                                    <button type='button' onClick={() => saveEdit(list.id)} className='save-edit-btn'>Save</button>
                                                    <button type='button' onClick={cancelEdit} className='cancel-edit-btn'>Cancel</button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div 
                                                        style={{ color:'#000',fontWeight: 'bold', fontFamily: "'Courier New', Courier, monospace", marginLeft: '-640px',paddingLeft:'15px', cursor: 'pointer', fontSize: '24px' }} 
                                                        onClick={() => {
                                                            setItemListId(list.id);
                                                            setActiveTab('items');
                                                        }}
                                                    >
                                                    {list.name}</div>
                                                    <Text variant={'p'} style={{ fontSize: '12px', color: '#999', marginLeft: '-620px', marginTop: '5px' }}>{list.itemCount} items</Text>
                                                </>
                                            )}
                                        </div>
                                        <div className='list-actions'>
                                            <button 
                                                type='button'
                                                className='ellipsis-button' 
                                                onClick={() => toggleDropdown(list.id)}
                                                title='Action Section'
                                            >
                                                <FaEllipsisH />
                                            </button>
                                            {openDropdownId === list.id && (
                                                <div className='dropdown-menu'>
                                                    <button type='button' onClick={() => startEditing(list.id, list.name)} className='dropdown-item'>
                                                        <FaEdit /> Edit Name
                                                    </button>
                                                    <button type='button' onClick={() => duplicateList(list.id)} className='dropdown-item'>
                                                        <FaCopy /> Duplicate
                                                    </button>
                                                    <button type='button' onClick={() => confirmRemove(list.id)} className='dropdown-item dropdown-item-danger'>
                                                        <FaTrash /> Remove
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}

                {/* Items Tab Content */}
                {activeTab === 'items' && (
                    <>
                        <div className='heading-names'>
                            <Text variant={'h2'} style={{ paddingLeft:'15px', fontWeight: 'bold', fontFamily: "'Courier New', Courier, monospace" }}>
                                {itemListId ? lists.find(l => l.id === itemListId)?.name || 'Items' : 'All Items'}
                            </Text>
                           
                        </div>

                        <div className='Items-section-card'>
                            {filteredItems.length === 0 ? (
                                <div className='empty-state'>
                                    <p>{itemListId ? 'No items in this list yet.' : 'No items yet. Add your first item!'}</p>
                                </div>
                            ) : (
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
                                        {filteredItems.map(item => (
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
                                                        <button type='button' className='stepper-btn' onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                                        <span className='stepper-value'>{item.quantity}</span>
                                                        <button type='button' className='stepper-btn' onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                                                    </div>
                                                </td>
                                                <td className='text-center'>
                                                    <button type='button' onClick={() => {}} className='dropdown-item'>
                                                        <FaEdit /> 
                                                    </button>
                                                </td>
                                                <td className='text-right'>
                                                    <button type='button' onClick={() => handleRemoveItem(item.id)} className='delete-btn'>
                                                        <FaTrash />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </>
                )}

            </div>

            {/* Confirm Dialog */}
            {showConfirmDialog && (
                <div className='confirm-dialog-overlay'>
                    <div className='confirm-dialog'>
                        <h3>Confirm Remove</h3>
                        <p>Are you sure you want to remove this item?</p>
                        <div className='confirm-dialog-buttons'>
                            <button type='button' onClick={() => setShowConfirmDialog(false)} className='cancel-btn'>Cancel</button>
                            <button type='button' onClick={handleRemoveList} className='remove-btn'>Remove</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add List Modal */}
            {showAddListModal && (
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
                                    placeholder='Enter list name'
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className='add-list-buttons'>
                            <button type='button' onClick={cancelAddList} className='cancel-btn'>Cancel</button>
                            <button type='button' onClick={addNewList} className='confirm-btn'>Add List</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Item Modal */}
            {showAddItemModal && (
                <div className='add-item-modal-overlay'>
                    <div className='add-item-modal'>
                        <div className='modal-header'>
                            <h3>Add New Item</h3>
                            <p className='modal-subtitle'>Add a new item to this list</p>
                            <button type='button' className='modal-close-btn' onClick={closeAddItemModal}>×</button>
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
                                    <label>Category (List)</label>
                                    <select
                                        value={itemListId || ''}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value === 'new') {
                                                setShowNewListInput(true);
                                                setItemListId(null);
                                                setItemCategory('');
                                            } else {
                                                const selectedList = lists.find(l => l.id === Number(value));
                                                setItemListId(Number(value));
                                                setItemCategory(selectedList?.name || '');
                                                setShowNewListInput(false);
                                            }
                                        }}
                                        className='item-select'
                                    >
                                        <option value=''>Select a list</option>
                                        {lists.map(list => (
                                            <option key={list.id} value={list.id}>{list.name}</option>
                                        ))}
                                        <option value='new'>+ Create new list</option>
                                    </select>
                                </div>
                            </div>
                            {showNewListInput && (
                                <div className='form-group-item'>
                                    <label>New List Name</label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input
                                            type='text'
                                            value={newListFromItem}
                                            onChange={(e) => setNewListFromItem(e.target.value)}
                                            className='item-input'
                                            placeholder='Enter new list name'
                                        />
                                        <button type='button' onClick={createListFromItem} className='confirm-btn' style={{ padding: '10px 20px' }}>Create</button>
                                    </div>
                                </div>
                            )}
                            <div className='form-group-item'>
                                <label>Quantity</label>
                                <input
                                    type='number'
                                    value={itemQuantity}
                                    onChange={(e) => setItemQuantity(parseInt(e.target.value) || 0)}
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
                                {itemImage && (
                                    <div className='image-preview'>
                                        <img src={URL.createObjectURL(itemImage)} alt='Preview' />
                                        <button type='button' onClick={() => setItemImage(null)} className='remove-image-btn'>×</button>
                                    </div>
                                )}
                                </div>

                            </div>
                        </div>
                        <div className='add-item-buttons'>
                            <button type='button' onClick={closeAddItemModal} className='cancel-btn'>Cancel</button>
                            <button type='button' onClick={handleAddItem} className='confirm-btn'>Add Item</button>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </>

    )
}
