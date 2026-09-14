import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Text } from '../Text/Text';
import { FaClipboardList } from 'react-icons/fa';
import { API_BASE_URL } from '../../services/api';
import type { List, Item } from '../../services/api';

type SharedData = {
  list: List;
  items: Item[];
};

export const SharedListView = () => {
  const { listId } = useParams<{ listId: string }>();
  const [searchParams] = useSearchParams();

  // Use the api base from the share link query param so the link works
  // when opened on a different machine (not just localhost).
  const apiBase = searchParams.get('api')
    ? decodeURIComponent(searchParams.get('api')!)
    : API_BASE_URL;

  const [data, setData]       = useState<SharedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!listId) return;

    setLoading(true);
    setError(null);

    fetch(`${apiBase}/shared/list/${listId}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || 'List not found');
        }
        return res.json() as Promise<SharedData>;
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message || 'Failed to load shared list');
        setLoading(false);
      });
  }, [listId, apiBase]);

  /* ── Loading ─────────────────────────────────────────── */

  if (loading) {
    return (
      <div className='shared-list-view'>
        <div className='loading-state'>
          <span
            className='btn-spinner'
            style={{ width: '36px', height: '36px', borderWidth: '3px', display: 'inline-block', marginBottom: '16px' }}
          />
          <p>Loading shared list...</p>
        </div>
      </div>
    );
  }

  /* ── Error / not found ───────────────────────────────── */

  if (error || !data) {
    return (
      <div className='shared-list-view'>
        <div className='error-state'>
          <p>{error || 'List not found'}</p>
        </div>
      </div>
    );
  }

  const { list, items } = data;

  /* ── Render ──────────────────────────────────────────── */

  return (
    <div className='shared-list-view'>
      <div className='shared-list-container'>
        <div className='shared-list-header'>
          <Text
            variant={'h2'}
            style={{ color: '#000', fontWeight: 'bold', fontFamily: "'Courier New', Courier, monospace" }}
          >
            {list.name}
          </Text>
          <Text variant={'p'} style={{ fontSize: '14px', color: '#666' }}>
            Shared Shopping List — Read only
          </Text>
        </div>

        {items.length === 0 ? (
          <div className='empty-state'>
            <Text variant='h3'>
              <FaClipboardList style={{ fontSize: '50px', color: '#000' }} />
            </Text>
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
                {items.map(item => (
                  <tr
                    key={item.id}
                    className={`item-row ${item.purchased ? 'item-row-purchased' : ''}`}
                  >
                    <td className='text-left'>
                      <div className='item-cell'>
                        {item.image && (
                          <img src={item.image} alt={item.name} className='item-image' />
                        )}
                        <div className='item-details'>
                          <div className={`item-name ${item.purchased ? 'item-name-purchased' : ''}`}>
                            {item.name}
                          </div>
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
                      <span className='category-display'>{item.category || '—'}</span>
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
