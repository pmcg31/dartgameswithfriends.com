import { FriendRequestNotificationData } from '@/src/lib/dart-types';
import { trpc } from '@/src/utils/trpc';
import { Button, Flex, Text } from '@chakra-ui/react';
import FullNotificationCard from './full-notification-card';
import { BsPersonCheck, BsPersonDash } from 'react-icons/bs';
import { FaRegHandPaper } from 'react-icons/fa';
import formatRelative from 'date-fns/formatRelative';
import { FriendRequestData } from '../friend/incoming-friend-requests';

export default function FriendRequestNotification({
  variant,
  id,
  notificationId,
  isNew,
  createdAt,
  data,
  onAcceptClicked,
  onRejectClicked
}: {
  variant: 'popover' | 'full';
  id?: string;
  notificationId: number;
  isNew: boolean;
  createdAt: Date;
  data: FriendRequestNotificationData;
  onAcceptClicked: (data: FriendRequestData) => void;
  onRejectClicked: (data: FriendRequestData) => void;
}): JSX.Element | null {
  // Set up player query
  const getPlayerQ = trpc.getPlayer.useQuery({ id: data.from });

  if (variant === 'popover') {
    return (
      <Flex direction={'column'}>
        <Text fontSize={'sm'}>
          <span style={{ fontWeight: 700 }}>
            @{(getPlayerQ.isSuccess && getPlayerQ.data?.handle) || 'unknown'}
          </span>{' '}
          wants to be friends
        </Text>
        <Text fontSize={'xs'} opacity={'50%'}>
          {formatRelative(createdAt, new Date())}
        </Text>
      </Flex>
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
                    console.log('block clicked');
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
      >
        <Flex gap={'0.5rem'} wrap={'wrap'} justifyContent={'center'}>
          <Button
            colorScheme={'blackAlpha'}
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
            colorScheme={'blackAlpha'}
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
