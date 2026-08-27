import { useState, useRef, useEffect } from 'react'
import { Text } from '../Text/Text';
import { FaEdit, FaEllipsisH, FaTrash, FaCopy, FaPlus, FaClipboardList } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { createList, deleteList, updateListName, incrementItemCount, decrementItemCount } from '../../store/listSlice';
import { createItem, updateItem,deleteItem, fetchItems,} from '../../store/itemsSlice';
import type { RootState } from '../../store/store';
import type { AppDispatch } from '../../store/store';
import { PaxiBayResources } from '../../PaxiBayResources';
import { useSearchParams } from 'react-router-dom';

// import type { List } from '../../store/listSlice';
// import type { Item } from '../../store/itemsSlice';

export const Home = ({ searchQuery = '' }: { searchQuery?: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
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
  const [selectedItemImage, setSelectedItemImage] = useState("")

  // Edit Item Modal State
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editItemName, setEditItemName] = useState('');
  const [editItemQuantity, setEditItemQuantity] = useState(1);
  const [editItemCategory, setEditItemCategory] = useState('');
  const [editItemListId, setEditItemListId] = useState<number | null>(null);
  const [editItemNotes, setEditItemNotes] = useState('');
  const [editItemImage, setEditItemImage] = useState<string>('');

// Fetch from database
    useEffect(() => {
    dispatch(fetchItems());
    }, [dispatch]);

  // Toast Notification State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

    const sortMethod = searchParams.get('sort') || '';


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
    setToastMessage('List name updated successfully');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const duplicateList = (id: number) => {
    const listToDuplicate = lists.find(list => list.id === id);
    if (listToDuplicate) {
      dispatch(createList(`${listToDuplicate.name} (Copy)`));
      setToastMessage('List duplicated successfully');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
    setOpenDropdownId(null);
  };

  const addNewList = () => {
    if (newListName.trim()) {
      dispatch(createList(newListName.trim()));
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
      dispatch(createList(listName));
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
      dispatch(deleteList(itemsToDelete));
      const listItems = items.filter(item => item.listId === itemsToDelete);
      listItems.forEach(item => dispatch(deleteList(item.id)));
      setItemsToDelete(null);
      setShowConfirmDialog(false);
      setToastMessage('List removed successfully!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);

    }
  };

  const handleRemoveItem = async (
  id: number
) => {
  const item = items.find(
    (item) => item.id === id
  );

  if (!item) {
    return;
  }

  try {
    await dispatch(
      deleteItem(id)
    ).unwrap();

    /*
     * Update the list count only after the
     * item has actually been deleted.
     */
    if (item.listId) {
      dispatch(
        decrementItemCount(item.listId)
      );
    }

    setToastMessage(
      'Item removed successfully'
    );

    setShowToast(true);

    setTimeout(
      () => setShowToast(false),
      2000
    );

  } catch (error) {
    console.error(
      'Failed to delete item:',
      error
    );

    setToastMessage(
      'Failed to remove item'
    );

    setShowToast(true);

    setTimeout(
      () => setShowToast(false),
      2000
    );
  }
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
    setSelectedItemImage('');

  };

 const handleAddItem = async () => {
  if (!itemName.trim() || itemListId === null) {
    return;
  }

  const selectedList = lists.find(
    (list) => list.id === itemListId
  );

  if (!selectedList) {
    return;
  }

  const newItem = {
    name: itemName.trim(),
    quantity: Math.max(1, itemQuantity),
    category: itemCategory.trim(),
    listId: itemListId,
    notes: itemNotes.trim() || undefined,
    image: selectedItemImage || undefined,
  };

  try {
    await dispatch(
      createItem(newItem)
    ).unwrap();

    /*
     * Only update the list count after the item
     * was successfully saved to the API.
     */

    dispatch(
      incrementItemCount(itemListId)
    );

    closeAddItemModal();

    setToastMessage(
      'Item added successfully'
    );

    setShowToast(true);

    setTimeout(
      () => setShowToast(false),
      3000
    );

  } catch (error) {
    console.error(
      'Failed to add item:',
      error
    );

    setToastMessage(
      error instanceof Error
        ? error.message
        : 'Failed to add item'
    );

    setShowToast(true);

    setTimeout(
      () => setShowToast(false),
      3000
    );
  }
};

const updateQuantity = async (
  itemId: number,
  newQuantity: number) => {
  if (newQuantity < 1) {
    return;
  }

  try {
    await dispatch(
      updateItem({
        id: itemId,
        data: {
          quantity: newQuantity,
        },
      })
    ).unwrap();

  } catch (error) {
    console.error(
      'Failed to update quantity:',
      error
    );

    setToastMessage(
      'Failed to update quantity'
    );

    setShowToast(true);

    setTimeout(
      () => setShowToast(false),
      2000
    );
  }
};

  const startEditItem = (itemId: number) => {
    const itemToEdit = items.find(item => item.id === itemId);
    if (itemToEdit) {
      setEditingItemId(itemId);
      setEditItemName(itemToEdit.name);
      setEditItemQuantity(itemToEdit.quantity);
      setEditItemCategory(itemToEdit.category || '');
      setEditItemListId(itemToEdit.listId);
      setEditItemNotes(itemToEdit.notes || '');
      setEditItemImage(itemToEdit.image || '');
      setShowEditItemModal(true);
    }
  };

  const closeEditItemModal = () => {
    setShowEditItemModal(false);
    setEditingItemId(null);
    setEditItemName('');
    setEditItemQuantity(1);
    setEditItemCategory('');
    setEditItemListId(null);
    setEditItemNotes('');
    setEditItemImage('');
  };

  const handleUpdateItem = async () => {
  if (
    editingItemId === null ||
    !editItemName.trim() ||
    editItemListId === null
  ) {
    return;
  }

  const updatedItem = {
    name: editItemName.trim(),
    quantity: Math.max(
      1,
      editItemQuantity
    ),
    category: editItemCategory.trim(),
    listId: editItemListId,
    notes:
      editItemNotes.trim() ||
      undefined,
    image:
      editItemImage ||
      undefined,
  };

  try {
    await dispatch(
      updateItem({
        id: editingItemId,
        data: updatedItem,
      })
    ).unwrap();

    closeEditItemModal();

    setToastMessage(
      'Item updated successfully'
    );

    setShowToast(true);

    setTimeout(
      () => setShowToast(false),
      3000
    );

  } catch (error) {
    console.error(
      'Failed to update item:',
      error
    );

    setToastMessage(
      error instanceof Error
        ? error.message
        : 'Failed to update item'
    );

    setShowToast(true);

    setTimeout(
      () => setShowToast(false),
      3000
    );
  }
};



    const normalizedSearchQuery = searchQuery.trim().toLowerCase();
    const hasItemsInCurrentView = itemListId
        ? items.some(item => item.listId === itemListId)
        : items.length > 0;
    const filteredLists = lists
        .filter(list => !normalizedSearchQuery || list.name.toLowerCase().includes(normalizedSearchQuery))
        .sort((firstList, secondList) => {
            if (sortMethod === 'dateAdded') return secondList.createdAt - firstList.createdAt;
            if (sortMethod === 'name' || sortMethod === 'category') {
                return firstList.name.localeCompare(secondList.name);
            }
            return 0;
        });

    const filteredItems = items
        .filter(item => {
            const matchesSelectedList = !itemListId || item.listId === itemListId;
            const matchesSearch = !normalizedSearchQuery ||
                item.name.toLowerCase().includes(normalizedSearchQuery) ||
                (item.category ?? '').toLowerCase().includes(normalizedSearchQuery);

            return matchesSelectedList && matchesSearch;
        })
        .sort((firstItem, secondItem) => {
            if (sortMethod === 'dateAdded') return secondItem.createdAt - firstItem.createdAt;
            if (sortMethod === 'category') {
                return (firstItem.category ?? '').localeCompare(secondItem.category ?? '') ||
                    firstItem.name.localeCompare(secondItem.name);
            }
            if (sortMethod === 'name') return firstItem.name.localeCompare(secondItem.name);
            return 0;
        });

    const handleSortChange = (value: string) => {
        setSearchParams((currentParams) => {
            if (value) {
                currentParams.set('sort', value);
            } else {
                currentParams.delete('sort');
            }
            return currentParams;
        });
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
                    <div className='sort-section'>
                        <label className='sort-label'>Sort by:</label>
                           <select className='sort-part' name='sort' value={sortMethod} onChange={(e) => handleSortChange(e.target.value)}>
                            <option value=''></option>
                            <option value='name'>Name</option>
                            <option value='category'>Category</option>
                            <option value='dateAdded'>Date Added</option>
                           </select>
                    </div>
                    
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
                            {filteredLists.length === 0 ? (
                                <div className='empty-state'>
                                    <Text variant='h3'><FaClipboardList style={{fontSize:'50px',color:'#000'}}/></Text>
                                    <p>{normalizedSearchQuery ? 'No lists or items match your search.' : 'No lists yet. Create your first list!'}</p>
                                </div>
                            ) : (
                                filteredLists.map((list) => (
                           
                                    
                                    <div key={list.id} className='content-list' ref={openDropdownId === list.id ? dropdownRef : null}>
                                        <div className='list-info'>
                                            {editingId === list.id ? (
                                                <div className='edit-name-container'>
                                                    <input
                                                        type='text'
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        className='edit-name-input'
                                                        autoFocus={true}
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
                                    <p>{normalizedSearchQuery
                                        ? 'No lists or items match your search.'
                                        : itemListId
                                            ? 'No items in this list yet.'
                                            : 'No items yet. Add your first item!'}</p>
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
                                                    <button type='button' onClick={() => startEditItem(item.id)} className='dropdown-item'>
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
                                    autoFocus={true}
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
                                        autoFocus={true}
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
                                <label>Image :</label>
    
                                <PaxiBayResources onImageSelect={(url) => setSelectedItemImage(url)} />
                                
                            </div>
                        </div>
                        <div className='add-item-buttons'>
                            <button type='button' onClick={closeAddItemModal} className='cancel-btn'>Cancel</button>
                            <button type='button' onClick={handleAddItem} className='confirm-btn'>Add Item</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Item Modal */}
            {showEditItemModal && (
                <div className='add-item-modal-overlay'>
                    <div className='add-item-modal'>
                        <div className='modal-header'>
                            <h3>Edit Item</h3>
                            <p className='modal-subtitle'>Edit item details</p>
                            <button type='button' className='modal-close-btn' onClick={closeEditItemModal}>×</button>
                        </div>
                        <div className='add-item-form'>
                            <div className='form-row-two-col'>
                                <div className='form-group-item'>
                                    <label>Item Name</label>
                                    <input
                                        type='text'
                                        value={editItemName}
                                        onChange={(e) => setEditItemName(e.target.value)}
                                        className='item-input'
                                        placeholder='Fill your item name'
                                        autoFocus={true}
                                    />
                                </div>
                                <div className='form-group-item'>
                                    <label>Category (List)</label>
                                    <select
                                        value={editItemListId || ''}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const selectedList = lists.find(l => l.id === Number(value));
                                            setEditItemListId(Number(value));
                                            setEditItemCategory(selectedList?.name || '');
                                        }}
                                        className='item-select'
                                    >
                                        <option value=''>Select a list</option>
                                        {lists.map(list => (
                                            <option key={list.id} value={list.id}>{list.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className='form-group-item'>
                                <label>Quantity</label>
                                <input
                                    type='number'
                                    value={editItemQuantity}
                                    onChange={(e) => setEditItemQuantity(parseInt(e.target.value) || 0)}
                                    className='item-input'
                                    min='1'
                                />
                            </div>
                            <div className='form-group-item'>
                                <label>Optional Notes</label>
                                <textarea
                                    value={editItemNotes}
                                    onChange={(e) => setEditItemNotes(e.target.value)}
                                    className='item-textarea'
                                    placeholder='Add any additional notes (optional)'
                                    rows={3}
                                />
                            </div>
                            <div className='form-group-item'>
                                <label>Image :</label>
                                {editItemImage && (
                                    <div className='selected-image-preview'>
                                        <p className='selected-label'>Current image:</p>
                                        <img src={editItemImage} alt="Current" className='selected-preview' />
                                    </div>
                                )}
                                <PaxiBayResources onImageSelect={(url) => setEditItemImage(url)} />
                            </div>
                        </div>
                        <div className='add-item-buttons'>
                            <button type='button' onClick={closeEditItemModal} className='cancel-btn'>Cancel</button>
                            <button type='button' onClick={handleUpdateItem} className='confirm-btn'>Update Item</button>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </>

    )
}
