import {
  DeleteNotificationClickedCallback,
  ToggleNotificationReadClickedCallback
} from '@/src/lib/notification-types';
import {
  IconButton,
  Flex,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button
} from '@chakra-ui/react';
import { formatRelative } from 'date-fns';
import { CSSProperties, PropsWithChildren } from 'react';
import { IconContext } from 'react-icons';
import {
  BsEnvelopeCheck,
  BsEnvelopeDash,
  BsFillCircleFill,
  BsThreeDots,
  BsTrash3
} from 'react-icons/bs';

export default function PopoverNotificationCard({
  id,
  buttonData,
  notificationId,
  isNew,
  createdAt,
  style,
  onToggleReadClicked,
  onDeleteClicked,
  children
}: PropsWithChildren<{
  id?: string;
  buttonData?: { icon: JSX.Element; onClick: () => void; text: string }[];
  notificationId: number;
  isNew: boolean;
  createdAt: Date;
  style?: CSSProperties;
  onToggleReadClicked: ToggleNotificationReadClickedCallback;
  onDeleteClicked: DeleteNotificationClickedCallback;
}>) {
  return (
    <Flex id={id} p={'0.25rem 0.5rem'} style={style}>
      <Flex alignItems={'center'}>
        <IconContext.Provider value={{ size: '0.4rem' }}>
          <BsFillCircleFill color={'#0cf'} opacity={isNew ? '100%' : '0%'} />
        </IconContext.Provider>
      </Flex>
      <Flex alignItems={'center'} grow={1} paddingInline={'0.5rem'}>
        <Flex direction={'column'}>
          <Text fontSize={'sm'}>{children}</Text>
          <Text fontSize={'xs'} opacity={'50%'}>
            {formatRelative(createdAt, new Date())}
          </Text>
        </Flex>
      </Flex>
      <Flex alignItems={'center'}>
        <Popover offset={[-50, 0]}>
          {({ onClose }) => (
            <>
              <PopoverTrigger>
                <IconButton
                  size={'sm'}
                  aria-label='More options'
                  icon={<BsThreeDots color={'#888'} />}
                />
              </PopoverTrigger>
              <PopoverContent
                backgroundColor={'var(--brand-color)'}
                border={'2px solid #888'}
                width={'auto'}
                p={'0.5rem'}
              >
                <Flex direction={'column'} gap={'0.25rem'}>
                  {buttonData &&
                    buttonData.map((data) => {
                      return (
                        <Button
                          key={data.text}
                          leftIcon={data.icon}
                          size={'sm'}
                          onClick={() => {
                            data.onClick();
                            onClose();
                          }}
                        >
                          {data.text}
                        </Button>
                      );
                    })}
                  <Button
                    leftIcon={isNew ? <BsEnvelopeCheck /> : <BsEnvelopeDash />}
                    size={'sm'}
                    onClick={() => {
                      onToggleReadClicked({ notificationId, isNew });
                      onClose();
                    }}
                  >
                    Mark {isNew ? 'Read' : 'Unread'}
                  </Button>
                  <Button
                    leftIcon={<BsTrash3 />}
                    size={'sm'}
                    onClick={() => {
                      onDeleteClicked({ notificationId });
                      onClose();
                    }}
                  >
                    Delete
                  </Button>
                </Flex>
              </PopoverContent>
            </>
          )}
        </Popover>
      </Flex>
    </Flex>
  );
}
