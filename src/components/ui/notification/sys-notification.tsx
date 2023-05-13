import { SystemNotificationData } from '@/src/lib/dart-types';
import FullNotificationCard from './full-notification-card';

export default function SystemNotification({
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
  data: SystemNotificationData;
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
        <p>{data.body}</p>
      </FullNotificationCard>
    );
  }

  return null;
}
