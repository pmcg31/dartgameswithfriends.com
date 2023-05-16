import { trpc } from '@/src/utils/trpc';
import {
  Button,
  Flex,
  Heading,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text
} from '@chakra-ui/react';
import { PropsWithChildren } from 'react';
import { IconContext } from 'react-icons';
import {
  BsFillCircleFill,
  BsTrash3,
  BsThreeDots,
  BsEnvelopeCheck,
  BsEnvelopeDash
} from 'react-icons/bs';
import formatRelative from 'date-fns/formatRelative';
import GenericCard from '../common/generic-card';

export default function FullNotificationCard({
  title,
  buttonData,
  id,
  notificationId,
  isNew,
  createdAt,
  children
}: PropsWithChildren<{
  title: string;
  buttonData?: { icon: JSX.Element; onClick: () => void; text: string }[];
  id?: string;
  notificationId: number;
  isNew: boolean;
  createdAt: Date;
}>) {
  // Get mutation for deleting a notification
  const deleteNotificationM = trpc.deleteNotification.useMutation();

  // Get mutation for updating new status of notification
  const notificationUpdateNewM = trpc.notificationUpdateNew.useMutation();

  // Get trpc utils
  const utils = trpc.useContext();

  return (
    <GenericCard
      id={id}
      header={
        <Flex
          alignItems={'center'}
          justifyItems={'center'}
          justifyContent={'space-between'}
          direction={'row'}
          width={'100%'}
        >
          <Flex alignItems={'center'} gap={'0.5em'}>
            <IconContext.Provider value={{ size: '0.5em' }}>
              <BsFillCircleFill
                color={'#0cf'}
                opacity={isNew ? '100%' : '0%'}
              />
            </IconContext.Provider>
            <Flex direction={'column'}>
              <Heading size={{ base: 'sm', sm: 'md' }}>{title}</Heading>
              <Text fontSize={{ base: 'xs', sm: 'sm' }} opacity={'40%'}>
                {formatRelative(createdAt, new Date())}
              </Text>
            </Flex>
          </Flex>
          <Popover>
            {({ onClose }) => (
              <>
                <PopoverTrigger>
                  <Button size='sm'>
                    <IconContext.Provider value={{ size: '0.8rem' }}>
                      <BsThreeDots color={'#888'} />
                    </IconContext.Provider>
                  </Button>
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
                      leftIcon={
                        isNew ? <BsEnvelopeCheck /> : <BsEnvelopeDash />
                      }
                      size={'sm'}
                      onClick={() => {
                        notificationUpdateNewM.mutate(
                          {
                            notificationId: notificationId,
                            isNew: !isNew
                          },
                          {
                            onSuccess: () => {
                              utils.getNotifications.invalidate();
                              utils.getNewNotificationCount.invalidate();
                            }
                          }
                        );
                        onClose();
                      }}
                    >
                      Mark {isNew ? 'Read' : 'Unread'}
                    </Button>
                    <Button
                      size={'sm'}
                      leftIcon={<BsTrash3 />}
                      onClick={() => {
                        deleteNotificationM.mutate(
                          {
                            notificationId: notificationId
                          },
                          {
                            onSuccess: () => {
                              utils.getNotifications.invalidate();
                              utils.getNotificationCount.invalidate();
                              utils.getNewNotificationCount.invalidate();
                            }
                          }
                        );
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
      }
    >
      {children}
    </GenericCard>
  );
}
