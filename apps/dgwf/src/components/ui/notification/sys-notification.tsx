import {
  DeleteNotificationClickedCallback,
  SystemNotificationData,
  ToggleNotificationReadClickedCallback
} from '@/src/lib/notification-types';
import { Flex, Text } from '@chakra-ui/react';
import FullNotificationCard from './full-notification-card';
import router from 'next/router';
import { BsBinoculars } from 'react-icons/bs';
import PopoverNotificationCard from './popover-notification-card';
import { CSSProperties } from 'react';

export default function SystemNotification({
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
  data: SystemNotificationData;
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
            icon: <BsBinoculars />,
            text: 'View...',
            onClick: () => {
              router.push({
                pathname: `/notifications`,
                hash: `n${notificationId}`
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
        <Flex paddingInline={'1rem'}>
          <Text fontSize={{ base: 'sm', sm: 'md' }}>{data.body}</Text>
        </Flex>
      </FullNotificationCard>
    );
  }

  return null;
}
