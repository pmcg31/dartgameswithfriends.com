import { FriendRequestNotificationData } from '@/src/lib/dart-types';
import { trpc } from '@/src/utils/trpc';
import { Button, Flex } from '@chakra-ui/react';
import FullNotificationCard from './full-notification-card';
import { BsFillPersonCheckFill, BsFillPersonDashFill } from 'react-icons/bs';
import { FaHandPaper } from 'react-icons/fa';

export default function FriendRequestNotification({
  variant,
  id,
  key,
  notificationId,
  isNew,
  data
}: {
  variant: 'popover' | 'full';
  id?: string;
  key?: string;
  notificationId: number;
  isNew: boolean;
  data: FriendRequestNotificationData;
}): JSX.Element | null {
  const getPlayerQ = trpc.getPlayer.useQuery({ id: data.from });

  if (getPlayerQ.isSuccess) {
    if (variant === 'popover') {
      return (
        <p>
          <span style={{ fontWeight: 700 }}>
            @{getPlayerQ.data?.handle || 'unknown'}
          </span>{' '}
          wants to be friends
        </p>
      );
    } else if (variant === 'full') {
      return (
        <FullNotificationCard
          id={id}
          key={key}
          notificationId={notificationId}
          isNew={isNew || false}
          title={
            getPlayerQ.isSuccess
              ? `Friend Request from @${getPlayerQ.data?.handle}`
              : 'Friend Request'
          }
        >
          <Flex gap={'0.5rem'} wrap={'wrap'} justifyContent={'center'}>
            <Button
              colorScheme={'blackAlpha'}
              leftIcon={<BsFillPersonCheckFill color={'#0f0'} />}
            >
              Accept
            </Button>
            <Button
              colorScheme={'blackAlpha'}
              leftIcon={<BsFillPersonDashFill color={'#f00'} />}
            >
              Reject
            </Button>
            <Button
              colorScheme={'blackAlpha'}
              leftIcon={<FaHandPaper color={'#f00'} />}
            >
              Block
            </Button>
          </Flex>
        </FullNotificationCard>
      );
    }
  } else {
    return <p>Friend request</p>;
  }

  return null;
}
