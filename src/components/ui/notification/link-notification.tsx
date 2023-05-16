import {
  DeleteNotificationClickedCallback,
  LinkNotificationData,
  ToggleNotificationReadClickedCallback
} from '@/src/lib/notification-types';
import Link from 'next/link';
import FullNotificationCard from './full-notification-card';
import PopoverNotificationCard from './popover-notification-card';
import { BsArrowUpRightSquare } from 'react-icons/bs';
import router from 'next/router';
import { Text } from '@chakra-ui/react';
import { CSSProperties } from 'react';

export default function LinkNotification({
  variant,
  id,
  notificationId,
  isNew,
  createdAt,
  data,
  style,
  onToggleReadClicked,
  onDeleteClicked
}: {
  variant: 'popover' | 'full';
  id?: string;
  notificationId: number;
  isNew: boolean;
  createdAt: Date;
  data: LinkNotificationData;
  style?: CSSProperties;
  onToggleReadClicked: ToggleNotificationReadClickedCallback;
  onDeleteClicked: DeleteNotificationClickedCallback;
}): JSX.Element | null {
  if (variant === 'popover') {
    return (
      <PopoverNotificationCard
        id={id}
        buttonData={[
          {
            icon: <BsArrowUpRightSquare />,
            text: 'Learn more...',
            onClick: () => {
              router.push({
                pathname: (data as LinkNotificationData).url
              });
            }
          }
        ]}
        notificationId={notificationId}
        isNew={isNew || false}
        createdAt={createdAt}
        style={style}
        onToggleReadClicked={onToggleReadClicked}
        onDeleteClicked={onDeleteClicked}
      >
        {data.subject}
      </PopoverNotificationCard>
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
        onToggleReadClicked={onToggleReadClicked}
        onDeleteClicked={onDeleteClicked}
      >
        <Link href={data.url}>
          <Text fontSize={{ base: 'sm', sm: 'md' }}>Learn more...</Text>
        </Link>
      </FullNotificationCard>
    );
  }

  return null;
}
