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
  BsBellFill,
  BsFillCircleFill,
  BsTrash3,
  BsThreeDots,
  BsEnvelopeCheck,
  BsEnvelopeDash,
  BsArrowUpRightSquare,
  BsPersonCheck,
  BsPersonDash,
  BsBinoculars
} from 'react-icons/bs';
import { FaRegHandPaper } from 'react-icons/fa';
import { IconContext } from 'react-icons/lib';
import React, { CSSProperties } from 'react';
import LinkNotification from './link-notification';
import SystemNotification from './sys-notification';
import FriendRequestNotification from './friend-request-notification';
import { useRouter } from 'next/router';
import {
  FriendRequestNotificationData,
  LinkNotificationData
} from '@/src/lib/dart-types';
import { FriendRequestData } from '../friend/incoming-friend-requests';
import { useToast } from '@chakra-ui/react';

export default function NotificationButton() {
  const toast = useToast();

  const router = useRouter();

  // Max number of notifications shown in popover
  const maxNotifications = 3;

  // Use clerk user
  const { isLoaded, isSignedIn, user } = useUser();

  // Set up query for new notification count for logged in user
  const newNotifyCountQ = trpc.getNewNotificationCount.useQuery(
    { playerId: user ? user.id : '' },
    { enabled: isLoaded && isSignedIn }
  );

  // Set up query for notification count for logged in user
  const notifyCountQ = trpc.getNotificationCount.useQuery(
    { playerId: user ? user.id : '' },
    { enabled: isLoaded && isSignedIn }
  );

  // Set up query for notifications for logged in user
  const notificationsQ = trpc.getNotifications.useQuery(
    { playerId: user ? user.id : '', limit: maxNotifications },
    { enabled: isLoaded && isSignedIn }
  );

  // Set up mutation for deleting a notification
  const deleteNotificationM = trpc.deleteNotification.useMutation();

  // Set up mutation for updating new status of notification
  const notificationUpdateNewM = trpc.notificationUpdateNew.useMutation();

  // Set up mutations for accept/reject
  // friend request
  const acceptFriendRequestM = trpc.acceptFriendRequest.useMutation();
  const rejectFriendRequestM = trpc.rejectFriendRequest.useMutation();

  // Get trpc utils
  const utils = trpc.useContext();

  // Function that marks a notification read
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

  function acceptRequest(data: FriendRequestData & { addresseeId: string }) {
    acceptFriendRequestM.mutate(
      {
        requesterId: data.requesterId,
        addresseeId: data.addresseeId
      },
      {
        onError: () => {
          toast({
            description:
              'Oops! Something went wrong and your friend request could not be accepted'
          });
        },
        onSuccess: () => {
          // Invalidate any queries that could
          // be affected by this update
          utils.getNotifications.invalidate();
          utils.getNewNotificationCount.invalidate();
          utils.getNotificationCount.invalidate();
          utils.getFriendsList.invalidate();
          utils.getIncomingFriendRequests.invalidate();
          utils.getOutgoingFriendRequests.invalidate();
        }
      }
    );
  }

  function rejectRequest(data: FriendRequestData & { addresseeId: string }) {
    rejectFriendRequestM.mutate(
      {
        requesterId: data.requesterId,
        addresseeId: data.addresseeId
      },
      {
        onError: () => {
          toast({
            description:
              'Oops! Something went wrong and your friend request could not be rejected'
          });
        },
        onSuccess: () => {
          // Invalidate any queries that could
          // be affected by this update
          utils.getNotifications.invalidate();
          utils.getNewNotificationCount.invalidate();
          utils.getNotificationCount.invalidate();
          utils.getIncomingFriendRequests.invalidate();
          utils.getOutgoingFriendRequests.invalidate();
        }
      }
    );
  }

  // Assume no notifications for now
  let popoverContent = (
    <Flex justifyContent={'center'} p={'0.5rem'}>
      <p style={{ opacity: '30%' }}>No notifications</p>
    </Flex>
  );

  // Do we have a user?
  if (isLoaded && isSignedIn) {
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
                  // Iterate notifications and create a card
                  // for each one. Start by computing styles
                  // for this row
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
                  if (idx % 2 !== 0) {
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

                  // Parse JSON in notification text and
                  // pull out its kind and the data for
                  // this notification
                  const { kind, data } = JSON.parse(notification.text);

                  // Generate notification content and
                  // popover menu data based on the
                  // kind of notification this is
                  let notificationContent: JSX.Element | null = null;
                  const meatballData: {
                    key: string;
                    icon: JSX.Element;
                    buttonText: string;
                    onClick: () => void;
                  }[] = [];
                  if (kind === 'sysNotify') {
                    // System notification
                    notificationContent = (
                      <SystemNotification
                        variant={'popover'}
                        notificationId={notification.id}
                        isNew={notification.isNew}
                        createdAt={new Date(notification.createdAt)}
                        data={data}
                      />
                    );
                    meatballData.push({
                      key: `${key}View`,
                      icon: <BsBinoculars />,
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
                    // Link notification
                    notificationContent = (
                      <LinkNotification
                        variant={'popover'}
                        notificationId={notification.id}
                        isNew={notification.isNew}
                        createdAt={new Date(notification.createdAt)}
                        data={data}
                      />
                    );
                    meatballData.push({
                      key: `${key}LearnMore`,
                      icon: <BsArrowUpRightSquare />,
                      buttonText: 'Learn more...',
                      onClick: () => {
                        router.push({
                          pathname: (data as LinkNotificationData).url
                        });
                        markRead(notification.id);
                      }
                    });
                  } else if (kind === 'frNotify') {
                    // Friend request notification
                    notificationContent = (
                      <FriendRequestNotification
                        variant={'popover'}
                        notificationId={notification.id}
                        isNew={notification.isNew}
                        createdAt={new Date(notification.createdAt)}
                        data={data}
                        onAcceptClicked={(data) => {
                          acceptRequest({ ...data, addresseeId: user.id });
                        }}
                        onRejectClicked={(data) => {
                          rejectRequest({ ...data, addresseeId: user.id });
                        }}
                      />
                    );
                    meatballData.push({
                      key: `${key}Accept`,
                      icon: <BsPersonCheck color={'#0f0'} />,
                      buttonText: 'Accept',
                      onClick: () => {
                        const frData = data as FriendRequestNotificationData;
                        acceptRequest({
                          requesterId: frData.from,
                          createdAt: frData.createdAt,
                          addresseeId: user.id
                        });
                        markRead(notification.id);
                      }
                    });
                    meatballData.push({
                      key: `${key}Reject`,
                      icon: <BsPersonDash color={'#f00'} />,
                      buttonText: 'Reject',
                      onClick: () => {
                        const frData = data as FriendRequestNotificationData;
                        rejectRequest({
                          requesterId: frData.from,
                          createdAt: frData.createdAt,
                          addresseeId: user.id
                        });
                        markRead(notification.id);
                      }
                    });
                    meatballData.push({
                      key: `${key}Block`,
                      icon: <FaRegHandPaper color={'#f00'} />,
                      buttonText: 'Block',
                      onClick: () => {
                        markRead(notification.id);
                      }
                    });
                  }

                  return (
                    <React.Fragment key={key}>
                      <Flex
                        sx={newIconStyle}
                        height='100%'
                        alignItems={'center'}
                      >
                        {notification.isNew && (
                          <IconContext.Provider value={{ size: '0.4rem' }}>
                            <BsFillCircleFill color={'#0cf'} />
                          </IconContext.Provider>
                        )}
                      </Flex>
                      <Flex sx={textStyle} height='100%' alignItems={'center'}>
                        {notificationContent}
                      </Flex>
                      <Flex
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
                                  {meatballData.map((value) => {
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
                                        <BsEnvelopeCheck />
                                      ) : (
                                        <BsEnvelopeDash />
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
                                    Mark{' '}
                                    {notification.isNew ? 'Read' : 'Unread'}
                                  </Button>
                                  <Button
                                    key={`${key}Delete`}
                                    leftIcon={<BsTrash3 />}
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
                    </React.Fragment>
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
      {({ isOpen }) => (
        <>
          <PopoverTrigger>
            <Grid gridArea={'cell'} isolation={'isolate'}>
              <IconContext.Provider value={{ size: '1.75rem' }}>
                {isOpen ? (
                  <BsBellFill
                    style={{
                      gridArea: 'cell',
                      zIndex: -1,
                      alignSelf: 'center',
                      justifySelf: 'center'
                    }}
                  />
                ) : (
                  <BsBell
                    style={{
                      gridArea: 'cell',
                      zIndex: -1,
                      alignSelf: 'center',
                      justifySelf: 'center'
                    }}
                  />
                )}
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
        </>
      )}
    </Popover>
  );
}
