import { LinkNotificationData } from '@/src/lib/dart-types';
import Link from 'next/link';
import FullNotificationCard from './full-notification-card';

export default function LinkNotification({
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
  data: LinkNotificationData;
}): JSX.Element | null {
  if (variant === 'popover') {
    return <p>{data.subject}</p>;
  } else if (variant === 'full') {
    return (
      <FullNotificationCard
        title={data.subject}
        id={id}
        key={key}
        notificationId={notificationId}
        isNew={isNew}
      >
        <Link href={data.url}>Learn more...</Link>
      </FullNotificationCard>
    );
  }

  return null;
}
