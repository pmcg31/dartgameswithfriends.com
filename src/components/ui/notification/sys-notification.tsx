import { SystemNotificationData } from '@/src/lib/dart-types';
import { Flex, Text } from '@chakra-ui/react';
import FullNotificationCard from './full-notification-card';
import formatRelative from 'date-fns/formatRelative';

export default function SystemNotification({
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
  data: SystemNotificationData;
}): JSX.Element | null {
  if (variant === 'popover') {
    return (
      <Flex direction={'column'}>
        <Text fontSize={'sm'}>{data.subject}</Text>
        <Text fontSize={'xs'} opacity={'50%'}>
          {formatRelative(createdAt, new Date())}
        </Text>
      </Flex>
    );

    return <p>{data.subject}</p>;
  } else if (variant === 'full') {
    return (
      <FullNotificationCard
        title={data.subject}
        id={id}
        notificationId={notificationId}
        isNew={isNew}
        createdAt={createdAt}
      >
        <Text fontSize={{ base: 'sm', sm: 'md' }}>{data.body}</Text>
      </FullNotificationCard>
    );
  }

  return null;
}
