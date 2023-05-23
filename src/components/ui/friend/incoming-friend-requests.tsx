import { trpc } from '@/src/utils/trpc';
import { formatRelative } from 'date-fns';
import { BsPersonCheck, BsPersonDash } from 'react-icons/bs';
import FriendCard, { FriendCardData } from './friend-card';
import { FaRegHandPaper } from 'react-icons/fa';
import { FriendActionData } from '@/src/lib/friend-types';
import { useWsQueryTracker } from '@/src/lib/websocket/use-ws-query-tracker';

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
  // Use the websocket query tracker
  const { usingQuery } = useWsQueryTracker();

  // Get query for incoming friend requests for
  // the specified player id
  const friendRequestsQ = trpc.getIncomingFriendRequests.useQuery({
    playerId: playerId
  });

  // Inform tracker we're using the query
  usingQuery({
    getIncomingFriendRequests: {
      playerId
    }
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
