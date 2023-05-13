import { trpc } from '@/src/utils/trpc';
import {
  Button,
  Flex,
  Heading,
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@chakra-ui/react';
import { PropsWithChildren } from 'react';
import { IconContext } from 'react-icons';
import {
  BsStarFill,
  BsFillTrash3Fill,
  BsThreeDots,
  BsFillEnvelopeCheckFill,
  BsFillEnvelopeDashFill
} from 'react-icons/bs';

export default function FullNotificationCard({
  title,
  id,
  key,
  notificationId,
  isNew,
  children
}: PropsWithChildren<{
  title: string;
  id?: string;
  notificationId: number;
  isNew: boolean;
  key?: string;
}>) {
  // Get mutation for deleting a notification
  const deleteNotificationM = trpc.deleteNotification.useMutation();

  // Get mutation for updating new status of notification
  const notificationUpdateNewM = trpc.notificationUpdateNew.useMutation();

  // Get trpc utils
  const utils = trpc.useContext();

  return (
    <Flex
      id={id}
      key={key}
      direction={'column'}
      borderRadius={'1rem'}
      backgroundColor={'rgba(0,0,0,0.3)'}
      overflow={'hidden'}
    >
      <Flex
        backgroundColor={'rgba(0,0,0,0.3)'}
        alignItems={'center'}
        justifyItems={'center'}
        justifyContent={'space-between'}
        p={'0.5rem 1rem'}
        direction={'row'}
      >
        <IconContext.Provider
          value={{ className: 'shared-class', size: '0.8rem' }}
        >
          <BsStarFill color={'red'} opacity={isNew ? '100%' : '0%'} />
        </IconContext.Provider>
        <Heading size={'md'} textAlign={'center'}>
          {title}
        </Heading>
        <Popover>
          {({ onClose }) => (
            <>
              <PopoverTrigger>
                <Button colorScheme={'blackAlpha'} size='sm'>
                  <IconContext.Provider
                    value={{ className: 'shared-class', size: '0.8rem' }}
                  >
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
                  <Button
                    key={`${key}ToggleRead`}
                    leftIcon={
                      isNew ? (
                        <BsFillEnvelopeCheckFill />
                      ) : (
                        <BsFillEnvelopeDashFill />
                      )
                    }
                    colorScheme={'blackAlpha'}
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
                    colorScheme={'blackAlpha'}
                    size={'sm'}
                    leftIcon={<BsFillTrash3Fill />}
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
      <Flex
        flexGrow={1}
        alignItems={'center'}
        justifyItems={'center'}
        p={'0.5rem 1rem'}
        direction={'column'}
      >
        {children}
      </Flex>
    </Flex>
  );
}
