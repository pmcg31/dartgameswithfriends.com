import { trpc } from '@/src/utils/trpc';
import React from 'react';
import { formatRelative } from 'date-fns';
import { BsPersonCheck, BsPersonDash } from 'react-icons/bs';
import FriendCard, { FriendCardData } from './friend-card';
import { FaRegHandPaper } from 'react-icons/fa';
import { FriendActionData } from '@/src/lib/friend-types';

export default function IncomingFriendRequests({
  playerId,
  onAcceptClicked,
  onRejectClicked,
  onBlockClicked
}: {
  playerId: string;
  onAcceptClicked: (data: FriendActionData) => void;
  onRejectClicked: (data: FriendActionData) => void;
  onBlockClicked: (data: FriendActionData) => void;
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
            icon: <BsPersonCheck color={'#0f0'} />,
            text: 'Accept',
            onClick: () => {
              console.log(`ifr accept clicked: requesterId: ${requesterId}`);
              onAcceptClicked({
                requesterId,
                createdAt
              });
            }
          },
          {
            icon: <BsPersonDash color={'#f00'} />,
            text: 'Reject',
            onClick: () => {
              onRejectClicked({
                requesterId,
                createdAt
              });
            }
          },
          {
            icon: <FaRegHandPaper color={'#f00'} />,
            text: 'Block',
            onClick: () => {
              onBlockClicked({ requesterId, createdAt });
            }
          }
        ],
        buttonsAsPopover: true
      };
    });
  }

  return (
    <FriendCard
      dataIsGood={friendRequestsQ.isSuccess}
      data={data}
      emptyText={'No pending requests'}
    />
  );
}
