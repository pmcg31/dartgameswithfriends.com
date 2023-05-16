import Layout from '@/src/components/ui/layout/layout';
import { Flex, Text } from '@chakra-ui/react';
import { useUser, RedirectToSignIn } from '@clerk/clerk-react';
import { BsBell } from 'react-icons/bs';
import PageHeading from '../components/ui/common/page-heading';
import FriendRequestNotification from '../components/ui/notification/friend-request-notification';
import LinkNotification from '../components/ui/notification/link-notification';
import SystemNotification from '../components/ui/notification/sys-notification';
import { trpc } from '../utils/trpc';
import { useToast } from '@chakra-ui/react';

export default function Notifications() {
  const toast = useToast();
  const { isLoaded, isSignedIn, user } = useUser();

  // Set up query for notifications for logged in user
  const notificationsQ = trpc.getNotifications.useQuery(
    { playerId: user ? user.id : '', limit: 10 },
    { enabled: isLoaded && isSignedIn }
  );

  // Set up mutations for accept/reject
  // friend request
  const acceptFriendRequestM = trpc.acceptFriendRequest.useMutation();
  const rejectFriendRequestM = trpc.rejectFriendRequest.useMutation();

  // Get trpc utils
  const utils = trpc.useContext();

  let content: JSX.Element | null = null;
  if (isLoaded) {
    if (isSignedIn) {
      content = (
        <Flex
          width={'100dvw'}
          maxW={'100ch'}
          p={'1rem'}
          color={'white'}
          direction={'column'}
          gap={'1rem'}
        >
          <PageHeading icon={<BsBell />} heading={'Notifications'} />
          {notificationsQ.isSuccess && notificationsQ.data.length > 0 ? (
            notificationsQ.data.map((notification) => {
              const key = `n${notification.id}`;
              const { kind, data } = JSON.parse(notification.text);
              if (kind === 'frNotify') {
                return (
                  <FriendRequestNotification
                    variant='full'
                    id={key}
                    key={key}
                    notificationId={notification.id}
                    isNew={notification.isNew}
                    createdAt={new Date(notification.createdAt)}
                    data={data}
                    onAcceptClicked={(data) => {
                      acceptFriendRequestM.mutate(
                        {
                          requesterId: data.requesterId,
                          addresseeId: user.id
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
                    }}
                    onRejectClicked={(data) => {
                      rejectFriendRequestM.mutate(
                        {
                          requesterId: data.requesterId,
                          addresseeId: user.id
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
                    }}
                  />
                );
              } else if (kind === 'linkNotify') {
                return (
                  <LinkNotification
                    variant='full'
                    id={key}
                    key={key}
                    notificationId={notification.id}
                    isNew={notification.isNew}
                    createdAt={new Date(notification.createdAt)}
                    data={data}
                  />
                );
              } else if (kind === 'sysNotify') {
                return (
                  <SystemNotification
                    variant='full'
                    id={key}
                    key={key}
                    notificationId={notification.id}
                    isNew={notification.isNew}
                    createdAt={new Date(notification.createdAt)}
                    data={data}
                  />
                );
              } else {
                return (
                  <p id={`n${notification.id}`} key={notification.id}>
                    {kind}
                  </p>
                );
              }
            })
          ) : (
            <Text paddingInline={'0.5rem'}>
              You don&apos;t have any notifications right now. Check back later!
            </Text>
          )}
        </Flex>
      );
    } else {
      // Not signed in; redirect
      return (
        <RedirectToSignIn
          afterSignInUrl={window.location.href}
          afterSignUpUrl={window.location.href}
        />
      );
    }
  }

  return <Layout title='Notifications'>{content}</Layout>;
}
