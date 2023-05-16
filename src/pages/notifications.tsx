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
import {
  DeleteNotificationData,
  ToggleNotificationReadData
} from '../lib/notification-types';
import { FriendActionData } from '../lib/friend-types';

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

  // Set up mutation for deleting a notification
  const deleteNotificationM = trpc.deleteNotification.useMutation();

  // Set up mutation for updating new status of notification
  const notificationUpdateNewM = trpc.notificationUpdateNew.useMutation();

  // Get trpc context
  const trpcContext = trpc.useContext();

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
          // Invalidate any queries that could
          // be affected by this update
          trpcContext.getNotifications.invalidate();
          trpcContext.getNewNotificationCount.invalidate();
          trpcContext.getNotificationCount.invalidate();
          trpcContext.getFriendsList.invalidate();
          trpcContext.getIncomingFriendRequests.invalidate();
          trpcContext.getOutgoingFriendRequests.invalidate();
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
          // Invalidate any queries that could
          // be affected by this update
          trpcContext.getNotifications.invalidate();
          trpcContext.getNewNotificationCount.invalidate();
          trpcContext.getNotificationCount.invalidate();
          trpcContext.getIncomingFriendRequests.invalidate();
          trpcContext.getOutgoingFriendRequests.invalidate();
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
          trpcContext.getNotifications.invalidate();
          trpcContext.getNewNotificationCount.invalidate();
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
          trpcContext.getNotifications.invalidate();
          trpcContext.getNewNotificationCount.invalidate();
          trpcContext.getNotificationCount.invalidate();
        }
      }
    );
  }

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
                    onToggleReadClicked={toggleNotificationReadClicked}
                    onDeleteClicked={deleteNotificationClicked}
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
                    onToggleReadClicked={toggleNotificationReadClicked}
                    onDeleteClicked={deleteNotificationClicked}
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
