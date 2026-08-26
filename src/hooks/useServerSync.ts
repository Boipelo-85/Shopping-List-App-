// import { useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import type { RootState } from '../store/store';

// export const useServerSync = () => {
//   const lists = useSelector((state: RootState) => state.lists.lists);
//   const items = useSelector((state: RootState) => state.items.items);

//   useEffect(() => {
//     // Sync data to server whenever lists or items change
//     const syncData = async () => {
//       try {
//         await fetch('http://localhost:3000/sync', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ lists, items }),
//         });
//       } catch (error) {
//         console.error('Error syncing to server:', error);
//       }
//     };

//     // Debounce sync to avoid too frequent requests
//     const timeoutId = setTimeout(() => {
//       syncData();
//     }, 500);

//     return () => clearTimeout(timeoutId);
//   }, [lists, items]);
// };
