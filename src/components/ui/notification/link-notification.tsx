import { LinkNotificationData } from '@/src/lib/dart-types';
import { Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';
import FullNotificationCard from './full-notification-card';
import formatRelative from 'date-fns/formatRelative';

export default function LinkNotification({
  variant,
  id,
  key,
  notificationId,
  isNew,
  createdAt,
  data
}: {
  variant: 'popover' | 'full';
  id?: string;
  key?: string;
  notificationId: number;
  isNew: boolean;
  createdAt: Date;
  data: LinkNotificationData;
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
        key={key}
        notificationId={notificationId}
        isNew={isNew}
        createdAt={createdAt}
      >
        <Link href={data.url}>
          <Text fontSize={{ base: 'sm', sm: 'md' }}>Learn more...</Text>
        </Link>
      </FullNotificationCard>
    );
  }

  return null;
}
