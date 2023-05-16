import { trpc } from '@/src/utils/trpc';
import { formatRelative } from 'date-fns';
import React from 'react';
import { BsPersonSlash } from 'react-icons/bs';
import FriendCard, { FriendCardData } from './friend-card';

export default function OutgoingFriendRequests({
  playerId
}: {
  playerId: string;
}): JSX.Element {
  // Get query for outgoing friend requests for
  // the specified player id
  const friendRequestsQ = trpc.getOutgoingFriendRequests.useQuery({
    playerId: playerId
  });

  // Transform trpc data into friend card data
  let data: FriendCardData[] = [];
  if (friendRequestsQ.isSuccess) {
    data = friendRequestsQ.data.map(({ addresseeId, createdAt }) => {
      return {
        playerId: addresseeId,
        addedText: formatRelative(new Date(createdAt), new Date()),
        buttons: [
          {
            icon: <BsPersonSlash color={'#f00'} />,
            text: 'Cancel',
            onClick: () => {
              console.log('cancel friend request clicked');
            }
          }
        ],
        buttonsAsPopover: true
      };
    });
  }

  return (
    <FriendCard
      heading={'Outgoing Requests'}
      dataIsGood={friendRequestsQ.isSuccess}
      data={data}
      emptyText={'No pending requests'}
    />
  );
}
