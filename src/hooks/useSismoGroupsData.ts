// import { useEffect, useState } from 'react';
// import { ISismoGroup, IUser } from '../types';
// import { getSismoGroupSnapshot } from '../queries/sismo';
// import { callUrl } from '../utils/rest';
//
// const useSismoGroupData = (sismoGroupIds: string[], userAddress: string): ISismoGroup | null => {
//   const [groupData, setGroupData] = useState<ISismoGroup | null>(null);
//
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await getSismoGroupsSnapshot(sismoGroupIds);
//         if (response?.data?.data?.groups?.length > 0) {
//           const groupUsers = await callUrl(response.data.data.groups[0].latestSnapshot.dataUrl);
//           const userInGroup = groupUsers.data[userAddress] == 1;
//           setGroupData({
//             description: response.data.data.groups[0].description,
//             id: response.data.data.groups[0].id,
//             name: response.data.data.groups[0].name,
//             specs: response.data.data.groups[0].specs,
//             link: '',
//             image: '',
//             userInGroup,
//           });
//         }
//       } catch (err: any) {
//         // eslint-disable-next-line no-console
//         console.error(err);
//       }
//     };
//     fetchData();
//   }, []);
//
//   return groupData;
// };
//
// export default useSismoGroupData;
