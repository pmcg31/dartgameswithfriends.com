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
import { BsBell, BsBellFill } from 'react-icons/bs';
import { IconContext } from 'react-icons/lib';
import React from 'react';
import LinkNotification from './link-notification';
import SystemNotification from './sys-notification';
import FriendRequestNotification from './friend-request-notification';
import { useRouter } from 'next/router';
import {
  DeleteNotificationData,
  ToggleNotificationReadData
} from '@/src/lib/notification-types';
import { useToast } from '@chakra-ui/react';
import { FriendActionData } from '@/src/lib/friend-types';
import { useWsQueryTracker } from '@/src/lib/websocket/use-ws-query-tracker';

export default function NotificationButton() {
  // Use the websocket query tracker
  const { usingQuery, announceMutation } = useWsQueryTracker();

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

  // Inform tracker we're using the query
  if (isLoaded && isSignedIn) {
    usingQuery({
      getNewNotificationCount: {
        playerId: user.id
      }
    });
  }

  // Set up query for notification count for logged in user
  const notifyCountQ = trpc.getNotificationCount.useQuery(
    { playerId: user ? user.id : '' },
    { enabled: isLoaded && isSignedIn }
  );

  if (isLoaded && isSignedIn) {
    usingQuery({
      getNotificationCount: {
        playerId: user.id
      }
    });
  }

  // Set up query for notifications for logged in user
  const notificationsQ = trpc.getNotifications.useQuery(
    { playerId: user ? user.id : '', limit: maxNotifications },
    { enabled: isLoaded && isSignedIn }
  );

  if (isLoaded && isSignedIn) {
    usingQuery({
      getNotifications: {
        playerId: user.id
      }
    });
  }

  // Set up mutation for deleting a notification
  const deleteNotificationM = trpc.deleteNotification.useMutation();

  // Set up mutation for updating new status of notification
  const notificationUpdateNewM = trpc.notificationUpdateNew.useMutation();

  // Set up mutations for accept/reject
  // friend request
  const acceptFriendRequestM = trpc.acceptFriendRequest.useMutation();
  const rejectFriendRequestM = trpc.rejectFriendRequest.useMutation();

  // Get trpc context
  const utils = trpc.useContext();

  function acceptRequest(data: FriendActionData & { addresseeId: string }) {
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
          // Announce the mutation
          announceMutation({
            acceptFriendRequest: {
              requesterId: data.requesterId,
              addresseeId: data.addresseeId
            }
          });

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

  function rejectRequest(data: FriendActionData & { addresseeId: string }) {
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
          // Announce the mutation
          announceMutation({
            rejectFriendRequest: {
              requesterId: data.requesterId,
              addresseeId: data.addresseeId
            }
          });

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

  function markNew(notificationId: number, isNew: boolean) {
    notificationUpdateNewM.mutate(
      {
        notificationId,
        isNew
      },
      {
        onSuccess: () => {
          // Announce the mutation
          announceMutation({ notificationUpdateNew: { notificationId } });

          utils.getNotifications.invalidate();
          utils.getNewNotificationCount.invalidate();
        }
      }
    );
  }

  function toggleNotificationReadClicked(data: ToggleNotificationReadData) {
    markNew(data.notificationId, !data.isNew);
  }

  function deleteNotificationClicked(data: DeleteNotificationData) {
    deleteNotificationM.mutate(
      {
        notificationId: data.notificationId
      },
      {
        onSuccess: () => {
          // Announce the mutation
          announceMutation({
            deleteNotification: { notificationId: data.notificationId }
          });

          utils.getNotifications.invalidate();
          utils.getNewNotificationCount.invalidate();
          utils.getNotificationCount.invalidate();
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
              <Flex direction={'column'}>
                {notificationsQ.data.map((notification, idx) => {
                  // Parse JSON in notification text and
                  // pull out its kind and the data for
                  // this notification
                  const { kind, data } = JSON.parse(notification.text);

                  // Generate notification content and
                  // popover menu data based on the
                  // kind of notification this is
                  const rowStyle = {
                    backgroundColor:
                      idx % 2 !== 0 ? 'rgba(0,0,0,0.2)' : 'initial'
                  };
                  if (kind === 'sysNotify') {
                    // System notification
                    return (
                      <SystemNotification
                        key={`n${notification.id}`}
                        variant={'popover'}
                        notificationId={notification.id}
                        isNew={notification.isNew}
                        createdAt={new Date(notification.createdAt)}
                        data={data}
                        style={rowStyle}
                        onToggleReadClicked={toggleNotificationReadClicked}
                        onDeleteClicked={deleteNotificationClicked}
                      />
                    );
                  } else if (kind === 'linkNotify') {
                    // Link notification
                    return (
                      <LinkNotification
                        key={`n${notification.id}`}
                        variant={'popover'}
                        notificationId={notification.id}
                        isNew={notification.isNew}
                        createdAt={new Date(notification.createdAt)}
                        data={data}
                        style={rowStyle}
                        onToggleReadClicked={toggleNotificationReadClicked}
                        onDeleteClicked={deleteNotificationClicked}
                      />
                    );
                  } else if (kind === 'frNotify') {
                    // Friend request notification
                    return (
                      <FriendRequestNotification
                        key={`n${notification.id}`}
                        variant={'popover'}
                        notificationId={notification.id}
                        isNew={notification.isNew}
                        createdAt={new Date(notification.createdAt)}
                        data={{ ...data, userId: user.id }}
                        style={rowStyle}
                        onAcceptClicked={(data) => {
                          acceptRequest({ ...data, addresseeId: user.id });
                          markNew(notification.id, false);
                        }}
                        onRejectClicked={(data) => {
                          rejectRequest({ ...data, addresseeId: user.id });
                          markNew(notification.id, false);
                        }}
                        onBlockClicked={() => {
                          markNew(notification.id, false);
                        }}
                        onToggleReadClicked={toggleNotificationReadClicked}
                        onDeleteClicked={deleteNotificationClicked}
                      />
                    );
                  }
                })}
              </Flex>
            </PopoverBody>
            {notifyCountQ.data > maxNotifications && (
              <PopoverFooter>
                <Flex justifyContent={'end'}>
                  <Button
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
