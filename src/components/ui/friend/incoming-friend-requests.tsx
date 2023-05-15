import { trpc } from '@/src/utils/trpc';
import React from 'react';
import { formatRelative } from 'date-fns';
import { BsFillPersonCheckFill, BsFillPersonDashFill } from 'react-icons/bs';
import FriendCard, { FriendCardData } from './friend-card';
import { FaHandPaper } from 'react-icons/fa';

export default function IncomingFriendRequests({
  playerId
}: {
  playerId: string;
}): JSX.Element {
  // Get query for incoming friend requests for
  // the specified player id
  const friendRequestsQ = trpc.getIncomingFriendRequests.useQuery({
    playerId: playerId
  });

  // Transform trpc data into friend card data
  let data: FriendCardData[] = [];
  if (friendRequestsQ.isSuccess) {
    data = friendRequestsQ.data.map(({ requesterId, createdAt }) => {
      return {
        playerId: requesterId,
        addedText: formatRelative(new Date(createdAt), new Date()),
        buttons: [
          {
            icon: <BsFillPersonCheckFill color={'#0f0'} />,
            text: 'Accept'
          },
          {
            icon: <BsFillPersonDashFill color={'#f00'} />,
            text: 'Reject'
          },
          {
            icon: <FaHandPaper color={'#f00'} />,
            text: 'Block'
          }
        ]
      };
    });
  }

  return (
    <FriendCard
      heading={'Incoming Requests'}
      dataIsGood={friendRequestsQ.isSuccess}
      data={data}
      emptyText={'No pending requests'}
    />
  );
}
