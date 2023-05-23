import { trpc } from '@/src/utils/trpc';
import { Button, Flex, Text } from '@chakra-ui/react';
import FullNotificationCard from './full-notification-card';
import { BsPersonCheck, BsPersonDash } from 'react-icons/bs';
import { FaRegHandPaper } from 'react-icons/fa';
import PopoverNotificationCard from './popover-notification-card';
import {
  ToggleNotificationReadClickedCallback,
  DeleteNotificationClickedCallback,
  FriendRequestNotificationData
} from '@/src/lib/notification-types';
import { FriendActionData } from '@/src/lib/friend-types';
import { CSSProperties } from 'react';
import { useWsQueryTracker } from '@/src/lib/websocket/use-ws-query-tracker';

export default function FriendRequestNotification({
  variant,
  id,
  notificationId,
  isNew,
  createdAt,
  data,
  style,
  onAcceptClicked,
  onRejectClicked,
  onBlockClicked,
  onToggleReadClicked,
  onDeleteClicked
}: {
  variant: 'popover' | 'full';
  id?: string;
  notificationId: number;
  isNew: boolean;
  createdAt: Date;
  data: FriendRequestNotificationData & { userId: string };
  style?: CSSProperties;
  onAcceptClicked: (data: FriendActionData) => void;
  onRejectClicked: (data: FriendActionData) => void;
  onBlockClicked: (data: FriendActionData) => void;
  onToggleReadClicked: ToggleNotificationReadClickedCallback;
  onDeleteClicked: DeleteNotificationClickedCallback;
}): JSX.Element | null {
  // Use the websocket query tracker
  const { usingQuery } = useWsQueryTracker();

  // Set up player query
  const getPlayerQ = trpc.getPlayer.useQuery({ id: data.from });

  // Set up friend request existence query
  const friendRequestExistsQ = trpc.friendRequestExists.useQuery({
    requesterId: data.from,
    addresseeId: data.userId
  });

  // Inform tracker we're using the query
  usingQuery({
    friendRequestExists: { requesterId: data.from, addresseeId: data.userId }
  });

  if (variant === 'popover') {
    return (
      <PopoverNotificationCard
        id={id}
        buttonData={
          getPlayerQ.isSuccess &&
          friendRequestExistsQ.isSuccess &&
          friendRequestExistsQ.data
            ? [
                {
                  icon: <BsPersonCheck color={'#0f0'} />,
                  onClick: () => {
                    onAcceptClicked({
                      requesterId: data.from,
                      createdAt: data.createdAt
                    });
                  },
                  text: 'Accept'
                },
                {
                  icon: <BsPersonDash color={'#f00'} />,
                  onClick: () => {
                    onRejectClicked({
                      requesterId: data.from,
                      createdAt: data.createdAt
                    });
                  },
                  text: 'Reject'
                },
                {
                  icon: <FaRegHandPaper color={'#f00'} />,
                  onClick: () => {
                    onBlockClicked({
                      requesterId: data.from,
                      createdAt: data.createdAt
                    });
                  },
                  text: 'Block'
                }
              ]
            : []
        }
        notificationId={notificationId}
        isNew={isNew || false}
        createdAt={createdAt}
        isDefunct={friendRequestExistsQ.isSuccess && !friendRequestExistsQ.data}
        style={style}
        onToggleReadClicked={onToggleReadClicked}
        onDeleteClicked={onDeleteClicked}
      >
        <span style={{ fontWeight: 700 }}>
          @{(getPlayerQ.isSuccess && getPlayerQ.data?.handle) || 'unknown'}
        </span>{' '}
        wants to be friends
      </PopoverNotificationCard>
    );
  } else if (variant === 'full') {
    return (
      <FullNotificationCard
        id={id}
        buttonData={
          getPlayerQ.isSuccess &&
          friendRequestExistsQ.isSuccess &&
          friendRequestExistsQ.data
            ? [
                {
                  icon: <FaRegHandPaper color={'#f00'} />,
                  onClick: () => {
                    onBlockClicked({
                      requesterId: data.from,
                      createdAt: data.createdAt
                    });
                  },
                  text: `Block @${getPlayerQ.data?.handle}`
                }
              ]
            : []
        }
        notificationId={notificationId}
        isNew={isNew || false}
        createdAt={createdAt}
        title={
          getPlayerQ.isSuccess
            ? `Friend Request from @${getPlayerQ.data?.handle}`
            : 'Friend Request'
        }
        onToggleReadClicked={onToggleReadClicked}
        onDeleteClicked={onDeleteClicked}
      >
        <Flex gap={'0.5rem'} wrap={'wrap'} justifyContent={'center'}>
          {friendRequestExistsQ.isSuccess && friendRequestExistsQ.data ? (
            <>
              <Button
                //
                leftIcon={<BsPersonCheck color={'#0f0'} />}
                size={{ base: 'sm', sm: 'md' }}
                onClick={() => {
                  onAcceptClicked({
                    requesterId: data.from,
                    createdAt: data.createdAt
                  });
                }}
              >
                Accept
              </Button>
              <Button
                leftIcon={<BsPersonDash color={'#f00'} />}
                size={{ base: 'sm', sm: 'md' }}
                onClick={() => {
                  onRejectClicked({
                    requesterId: data.from,
                    createdAt: data.createdAt
                  });
                }}
              >
                Reject
              </Button>
            </>
          ) : (
            <Text opacity={'30%'}>This request is no longer active.</Text>
          )}
        </Flex>
      </FullNotificationCard>
    );
  }

  return null;
}
