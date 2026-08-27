import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { fetchListById } from '../../store/listSlice';
import { fetchItemsByListId } from '../../store/itemsSlice';
import type { RootState } from '../../store/store';
import type { AppDispatch } from '../../store/store';
import { Text } from '../Text/Text';
import { FaClipboardList } from 'react-icons/fa';

export const SharedListView = () => {
  const { listId } = useParams<{ listId: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const currentList = useSelector((state: RootState) =>
    state.lists.lists.find(list => list.id === Number(listId))
  );
  const items = useSelector((state: RootState) => state.items.items);
  const listLoading = useSelector((state: RootState) => state.lists.loading);
  const itemsLoading = useSelector((state: RootState) => state.items.loading);
  const listError = useSelector((state: RootState) => state.lists.error);
  const itemsError = useSelector((state: RootState) => state.items.error);

  useEffect(() => {
    if (listId) {
      dispatch(fetchListById(Number(listId)));
      dispatch(fetchItemsByListId(Number(listId)));
    }
  }, [dispatch, listId]);

  if (listLoading || itemsLoading) {
    return (
      <div className='shared-list-view'>
        <div className='loading-state'>
          <p>Loading shared list...</p>
        </div>
      </div>
    );
  }

  if (listError || itemsError) {
    return (
      <div className='shared-list-view'>
        <div className='error-state'>
          <p>{listError || itemsError || 'Failed to load shared list'}</p>
        </div>
      </div>
    );
  }

  if (!currentList) {
    return (
      <div className='shared-list-view'>
        <div className='error-state'>
          <p>List not found</p>
        </div>
      </div>
    );
  }

  const listItems = items.filter(item => item.listId === Number(listId));

  return (
    <div className='shared-list-view'>
      <div className='shared-list-container'>
        <div className='shared-list-header'>
          <Text variant={'h2'} style={{ color: '#000', fontWeight: 'bold', fontFamily: "'Courier New', Courier, monospace" }}>
            {currentList.name}
          </Text>
          <Text variant={'p'} style={{ fontSize: '14px', color: '#666' }}>
            Shared Shopping List (Read-only)
          </Text>
        </div>

        {listItems.length === 0 ? (
          <div className='empty-state'>
            <Text variant='h3'><FaClipboardList style={{fontSize:'50px',color:'#000'}}/></Text>
            <p>This list has no items yet.</p>
          </div>
        ) : (
          <div className='shared-items-section'>
            <table className='table-content'>
              <thead>
                <tr>
                  <th className='text-left'>Item picture and name</th>
                  <th className='text-center'>Quantity</th>
                  <th className='text-center'>Category</th>
                </tr>
              </thead>
              <tbody>
                {listItems.map(item => (
                  <tr key={item.id} className='item-row'>
                    <td className='text-left'>
                      <div className='item-cell'>
                        {item.image && (
                          <img src={item.image} alt={item.name} className='item-image' />
                        )}
                        <div className='item-details'>
                          <div className='item-name'>{item.name}</div>
                          {item.notes && (
                            <div className='item-subtext'>Notes: {item.notes}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className='text-center'>
                      <span className='quantity-display'>{item.quantity}</span>
                    </td>
                    <td className='text-center'>
                      <span className='category-display'>{item.category || '-'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};