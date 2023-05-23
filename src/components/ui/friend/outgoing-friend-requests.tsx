import { FriendRequestActionData } from '@/src/lib/friend-types';
import { trpc } from '@/src/utils/trpc';
import { formatRelative } from 'date-fns';
import { BsPersonSlash } from 'react-icons/bs';
import FriendCard, { FriendCardData } from './friend-card';
import { useWsQueryTracker } from '@/src/lib/websocket/use-ws-query-tracker';

export default function OutgoingFriendRequests({
  playerId,
  onCancelClicked
}: {
  playerId: string;
  onCancelClicked: (data: FriendRequestActionData) => void;
}): JSX.Element {
  // Use the websocket query tracker
  const { usingQuery } = useWsQueryTracker();

  // Get query for outgoing friend requests for
  // the specified player id
  const friendRequestsQ = trpc.getOutgoingFriendRequests.useQuery({
    playerId: playerId
  });

  // Inform tracker we're using the query
  usingQuery({
    getOutgoingFriendRequests: {
      playerId
    }
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
              onCancelClicked({
                requesterId: playerId,
                addresseeId
              });
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
