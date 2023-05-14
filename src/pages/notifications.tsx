import Layout from '@/src/components/ui/layout/layout';
import { Flex, Heading, Text } from '@chakra-ui/react';
import { useUser, RedirectToSignIn } from '@clerk/clerk-react';
import FriendRequestNotification from '../components/ui/notification/friend-request-notification';
import LinkNotification from '../components/ui/notification/link-notification';
import SystemNotification from '../components/ui/notification/sys-notification';
import { trpc } from '../utils/trpc';

export default function Notifications() {
  const { isLoaded, isSignedIn, user } = useUser();

  // Get query for notifications for logged in user
  const notificationsQ = trpc.getNotifications.useQuery(
    { playerId: user ? user.id : '', limit: 10 },
    { enabled: isLoaded && isSignedIn }
  );

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
          <Heading>Notifications</Heading>
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
