import { trpc } from '@/src/utils/trpc';
import { Button, Flex } from '@chakra-ui/react';
import FullNotificationCard from './full-notification-card';
import { BsPersonCheck, BsPersonDash } from 'react-icons/bs';
import { FaRegHandPaper } from 'react-icons/fa';
import PopoverNotificationCard from './popover-notification-card';
import {
  ToggleNotificationReadClickedCallback,
  DeleteNotificationClickedCallback,
  FriendRequestNotificationData
} from '@/src/lib/notification-types';
import { FriendActionClickedCallback } from '@/src/lib/friend-types';
import { CSSProperties } from 'react';

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
  data: FriendRequestNotificationData;
  style?: CSSProperties;
  onAcceptClicked: FriendActionClickedCallback;
  onRejectClicked: FriendActionClickedCallback;
  onBlockClicked: FriendActionClickedCallback;
  onToggleReadClicked: ToggleNotificationReadClickedCallback;
  onDeleteClicked: DeleteNotificationClickedCallback;
}): JSX.Element | null {
  // Set up player query
  const getPlayerQ = trpc.getPlayer.useQuery({ id: data.from });

  if (variant === 'popover') {
    return (
      <PopoverNotificationCard
        id={id}
        buttonData={
          getPlayerQ.isSuccess
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
          getPlayerQ.isSuccess
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
        </Flex>
      </FullNotificationCard>
    );
  }

  return null;
}
