import {
  Box,
  Button,
  Flex,
  Grid,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger
} from '@chakra-ui/react';
import { useUser } from '@clerk/nextjs';
import { trpc } from '@/src/utils/trpc';
import {
  BsBell,
  BsStarFill,
  BsFillTrash3Fill,
  BsThreeDots,
  BsFillEnvelopeCheckFill,
  BsFillEnvelopeDashFill,
  BsArrowUpRightSquareFill,
  BsFillPersonCheckFill,
  BsFillPersonDashFill,
  BsBinocularsFill
} from 'react-icons/bs';
import { FaHandPaper } from 'react-icons/fa';
import { IconContext } from 'react-icons/lib';
import React, { CSSProperties } from 'react';
import LinkNotification from './link-notification';
import SystemNotification from './sys-notification';
import FriendRequestNotification from './friend-request-notification';
import { useRouter } from 'next/router';
import { LinkNotificationData } from '@/src/lib/dart-types';

export default function NotificationButton() {
  const router = useRouter();

  // Max number of notifications shown in popover
  const maxNotifications = 3;

  // Use clerk user
  const { isLoaded, isSignedIn, user } = useUser();

  // Get query for new notification count for logged in user
  const newNotifyCountQ = trpc.getNewNotificationCount.useQuery(
    { playerId: user ? user.id : '' },
    { enabled: isLoaded && isSignedIn }
  );

  // Get query for notification count for logged in user
  const notifyCountQ = trpc.getNotificationCount.useQuery(
    { playerId: user ? user.id : '' },
    { enabled: isLoaded && isSignedIn }
  );

  // Get query for notifications for logged in user
  const notificationsQ = trpc.getNotifications.useQuery(
    { playerId: user ? user.id : '', limit: maxNotifications },
    { enabled: isLoaded && isSignedIn }
  );

  // Get mutation for deleting a notification
  const deleteNotificationM = trpc.deleteNotification.useMutation();

  // Get mutation for updating new status of notification
  const notificationUpdateNewM = trpc.notificationUpdateNew.useMutation();

  // Get trpc utils
  const utils = trpc.useContext();

  // Assume no notifications for now
  let popoverContent = (
    <Flex justifyContent={'center'} p={'0.5rem'}>
      <p style={{ opacity: '30%' }}>No notifications</p>
    </Flex>
  );

  // Was the count query successful and are there any notifications?
  if (notifyCountQ.isSuccess && notifyCountQ.data > 0) {
    // Yes, was the notifications query successful?
    if (notificationsQ.isSuccess) {
      // Yes, create new popover content
      popoverContent = (
        <>
          <PopoverHeader>
            <Flex justifyContent={'center'}>Notifications</Flex>
          </PopoverHeader>
          <PopoverBody>
            <Grid templateColumns={'auto 1fr auto'}>
              {notificationsQ.data.map((notification, idx) => {
                const key = `${notification.id}`;
                const rowPaddingInline = '0.5rem';
                const rowPaddingBlock = '0.25rem';
                const altBackgroundColor = 'rgba(0,0,0,0.2)';
                let newIconStyle: CSSProperties = {
                  gridColumn: '1',
                  paddingRight: '0.5rem',
                  paddingLeft: rowPaddingInline,
                  paddingBlock: rowPaddingBlock
                };
                let textStyle: CSSProperties = {
                  gridColumn: '2',
                  paddingBlock: rowPaddingBlock
                };
                let trashIconStyle: CSSProperties = {
                  gridColumn: '3',
                  paddingLeft: '0.5rem',
                  paddingRight: rowPaddingInline,
                  paddingBlock: rowPaddingBlock
                };
                if (idx % 2 === 0) {
                  newIconStyle = {
                    ...newIconStyle,
                    backgroundColor: altBackgroundColor
                  };
                  textStyle = {
                    ...textStyle,
                    backgroundColor: altBackgroundColor
                  };
                  trashIconStyle = {
                    ...trashIconStyle,
                    backgroundColor: altBackgroundColor
                  };
                }

                function markRead(notificationId: number) {
                  notificationUpdateNewM.mutate(
                    {
                      notificationId,
                      isNew: false
                    },
                    {
                      onSuccess: () => {
                        utils.getNotifications.invalidate();
                        utils.getNewNotificationCount.invalidate();
                      }
                    }
                  );
                }

                const { kind, data } = JSON.parse(notification.text);
                let notificationContent: JSX.Element | null = null;
                const meatballContent: {
                  key: string;
                  icon: JSX.Element;
                  buttonText: string;
                  onClick: () => void;
                }[] = [];
                if (kind === 'sysNotify') {
                  notificationContent = (
                    <SystemNotification
                      variant={'popover'}
                      notificationId={notification.id}
                      isNew={notification.isNew}
                      data={data}
                    />
                  );
                  meatballContent.push({
                    key: `${key}View`,
                    icon: <BsBinocularsFill />,
                    buttonText: 'View...',
                    onClick: () => {
                      markRead(notification.id);
                      router.push({
                        pathname: `/notifications`,
                        hash: `n${notification.id}`
                      });
                    }
                  });
                } else if (kind === 'linkNotify') {
                  notificationContent = (
                    <LinkNotification
                      variant={'popover'}
                      notificationId={notification.id}
                      isNew={notification.isNew}
                      data={data}
                    />
                  );
                  meatballContent.push({
                    key: `${key}LearnMore`,
                    icon: <BsArrowUpRightSquareFill />,
                    buttonText: 'Learn more...',
                    onClick: () => {
                      router.push({
                        pathname: (data as LinkNotificationData).url
                      });
                      markRead(notification.id);
                    }
                  });
                } else if (kind === 'frNotify') {
                  notificationContent = (
                    <FriendRequestNotification
                      variant={'popover'}
                      notificationId={notification.id}
                      isNew={notification.isNew}
                      data={data}
                    />
                  );
                  meatballContent.push({
                    key: `${key}Accept`,
                    icon: <BsFillPersonCheckFill />,
                    buttonText: 'Accept',
                    onClick: () => {
                      markRead(notification.id);
                    }
                  });
                  meatballContent.push({
                    key: `${key}Reject`,
                    icon: <BsFillPersonDashFill />,
                    buttonText: 'Reject',
                    onClick: () => {
                      markRead(notification.id);
                    }
                  });
                  meatballContent.push({
                    key: `${key}Block`,
                    icon: <FaHandPaper />,
                    buttonText: 'Block',
                    onClick: () => {
                      markRead(notification.id);
                    }
                  });
                }

                return (
                  <>
                    <Flex
                      key={`${key}C1`}
                      sx={newIconStyle}
                      height='100%'
                      alignItems={'center'}
                    >
                      {notification.isNew && (
                        <IconContext.Provider
                          value={{ className: 'shared-class', size: '0.8rem' }}
                        >
                          <BsStarFill color={'red'} />
                        </IconContext.Provider>
                      )}
                    </Flex>
                    <Flex
                      key={`${key}C2`}
                      sx={textStyle}
                      height='100%'
                      alignItems={'center'}
                    >
                      {notificationContent}
                    </Flex>
                    <Flex
                      key={`${key}C3`}
                      sx={trashIconStyle}
                      height='100%'
                      alignItems={'center'}
                    >
                      <Popover offset={[-50, 0]}>
                        {({ onClose }) => (
                          <>
                            <PopoverTrigger>
                              <Button size={'sm'} colorScheme={'blackAlpha'}>
                                <IconContext.Provider
                                  value={{
                                    className: 'shared-class',
                                    size: '0.8rem'
                                  }}
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
                                {meatballContent.map((value) => {
                                  return (
                                    <Button
                                      key={value.key}
                                      leftIcon={value.icon}
                                      colorScheme={'blackAlpha'}
                                      size={'sm'}
                                      onClick={() => {
                                        value.onClick();
                                        onClose();
                                      }}
                                    >
                                      {value.buttonText}
                                    </Button>
                                  );
                                })}
                                <Button
                                  key={`${key}ToggleRead`}
                                  leftIcon={
                                    notification.isNew ? (
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
                                        notificationId: notification.id,
                                        isNew: !notification.isNew
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
                                  Mark {notification.isNew ? 'Read' : 'Unread'}
                                </Button>
                                <Button
                                  key={`${key}Delete`}
                                  leftIcon={<BsFillTrash3Fill />}
                                  colorScheme={'blackAlpha'}
                                  size={'sm'}
                                  onClick={() => {
                                    deleteNotificationM.mutate(
                                      {
                                        notificationId: notification.id
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
                  </>
                );
              })}
            </Grid>
          </PopoverBody>
          {notifyCountQ.data > maxNotifications && (
            <PopoverFooter>
              <Flex justifyContent={'end'}>
                <Button
                  colorScheme={'blackAlpha'}
                  size={'sm'}
                  onClick={() => {
                    router.push({ pathname: '/notifications' });
                  }}
                >
                  more...
                </Button>
              </Flex>
            </PopoverFooter>
          )}
        </>
      );
    }
  }

  return (
    <Popover
    // // Put this code in to clear new notification
    // // status when the popover closes. This will
    // // clear the new status for all new notifications
    // // that were shown while it was open.
    // onClose={() => {
    //   if (notificationsQ.isSuccess) {
    //     notificationsQ.data.forEach((notification) => {
    //       if (notification.isNew) {
    //         notificationUpdateNewM.mutate(
    //           {
    //             notificationId: notification.id
    //           },
    //           {
    //             onSuccess: () => {
    //               utils.getNotifications.invalidate();
    //               utils.getNewNotificationCount.invalidate();
    //             }
    //           }
    //         );
    //       }
    //     });
    //   }
    // }}
    >
      <PopoverTrigger>
        <Grid gridArea={'cell'} isolation={'isolate'}>
          <IconContext.Provider
            value={{ className: 'shared-class', size: '1.75rem' }}
          >
            <BsBell
              style={{
                gridArea: 'cell',
                zIndex: -1,
                alignSelf: 'center',
                justifySelf: 'center'
              }}
            />
          </IconContext.Provider>
          {newNotifyCountQ.isSuccess && newNotifyCountQ.data > 0 && (
            <Box
              gridArea={'cell'}
              alignSelf={'start'}
              justifySelf={'end'}
              backgroundColor={'red'}
              color={'#fff'}
              height={'1.5em'}
              borderRadius={'0.75em'}
              fontSize={'x-small'}
              padding={'0 0.5em'}
              mt={'-0.25rem'}
              mr={'-0.25rem'}
            >
              {newNotifyCountQ.data}
            </Box>
          )}
        </Grid>
      </PopoverTrigger>
      <PopoverContent
        backgroundColor={'var(--brand-color)'}
        border={'2px solid #888'}
      >
        {popoverContent}
      </PopoverContent>
    </Popover>
  );
}
