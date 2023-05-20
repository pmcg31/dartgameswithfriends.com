import { trpc } from '@/src/utils/trpc';
import React from 'react';
import { BsPersonX } from 'react-icons/bs';
import FriendCard, { FriendCardData } from './friend-card';

function formatFriendSince(when: Date) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  const now = new Date();

  if (now.getFullYear() !== when.getFullYear()) {
    return `since ${when.getFullYear()}`;
  }

  if (now.getMonth() !== when.getMonth()) {
    return `since ${months[when.getMonth()]} ${when.getFullYear()}`;
  }

  return `new!`;
}

export default function FriendsList({
  playerId
}: {
  playerId: string;
}): JSX.Element {
  // Get query for friends list for
  // the specified player id
  const friendsListQ = trpc.getFriendsList.useQuery({
    playerId: playerId
  });

  // Transform trpc data into friend card data
  const data: FriendCardData[] = [];
  if (friendsListQ.isSuccess && friendsListQ.data) {
    let aIdx = 0;
    let bIdx = 0;
    while (
      aIdx < friendsListQ.data.aSideFriends.length ||
      bIdx < friendsListQ.data.bSideFriends.length
    ) {
      // Take next from A side or B side?
      let isASide = true;
      if (!(aIdx < friendsListQ.data.aSideFriends.length)) {
        // A side exhausted; take from B
        isASide = false;
      } else if (!(bIdx < friendsListQ.data.bSideFriends.length)) {
        // B side exhausted; take from A
        isASide = true;
      } else if (
        friendsListQ.data.aSideFriends[aIdx].playerB.handle <
        friendsListQ.data.bSideFriends[bIdx].playerA.handle
      ) {
        // A side handle less; take from A side
        isASide = true;
      } else {
        // B side handle less; take from B side
        isASide = false;
      }

      // Consume data from chosen side
      const buttons = [
        {
          icon: <BsPersonX color={'#f00'} />,
          text: 'Unfriend',
          onClick: () => {
            console.log('unfriend clicked');
          }
        }
      ];
      if (isASide) {
        // Take from A side
        data.push({
          playerId: friendsListQ.data.aSideFriends[aIdx].playerB.id,
          addedText: formatFriendSince(
            new Date(friendsListQ.data.aSideFriends[aIdx].createdAt)
          ),
          buttons,
          buttonsAsPopover: true
        });
        aIdx++;
      } else {
        // Take from B side
        data.push({
          playerId: friendsListQ.data.bSideFriends[bIdx].playerA.id,
          addedText: formatFriendSince(
            new Date(friendsListQ.data.bSideFriends[bIdx].createdAt)
          ),
          buttons,
          buttonsAsPopover: true
        });
        bIdx++;
      }
    }
  }

  return (
    <FriendCard
      heading={'Friends List'}
      dataIsGood={friendsListQ.isSuccess}
      data={data}
      emptyText={'No friends'}
    />
  );
}