import { FriendRequestNotificationData } from '@/src/lib/dart-types';
import { trpc } from '@/src/utils/trpc';
import { Button, Flex, Text } from '@chakra-ui/react';
import FullNotificationCard from './full-notification-card';
import { BsFillPersonCheckFill, BsFillPersonDashFill } from 'react-icons/bs';
import { FaHandPaper } from 'react-icons/fa';
import formatRelative from 'date-fns/formatRelative';

export default function FriendRequestNotification({
  variant,
  id,
  notificationId,
  isNew,
  createdAt,
  data
}: {
  variant: 'popover' | 'full';
  id?: string;
  notificationId: number;
  isNew: boolean;
  createdAt: Date;
  data: FriendRequestNotificationData;
}): JSX.Element | null {
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
                  icon: <FaHandPaper color={'#f00'} />,
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
            leftIcon={<BsFillPersonCheckFill color={'#0f0'} />}
            size={{ base: 'sm', sm: 'md' }}
          >
            Accept
          </Button>
          <Button
            colorScheme={'blackAlpha'}
            leftIcon={<BsFillPersonDashFill color={'#f00'} />}
            size={{ base: 'sm', sm: 'md' }}
          >
            Reject
          </Button>
        </Flex>
      </FullNotificationCard>
    );
  }

  return null;
}
