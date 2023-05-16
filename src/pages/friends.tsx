import Layout from '@/src/components/ui/layout/layout';
import { Flex } from '@chakra-ui/react';
import { useUser, RedirectToSignIn } from '@clerk/clerk-react';
import { BsPeople } from 'react-icons/bs';
import { trpc } from '@/src/utils/trpc';
import PageHeading from '@/src/components/ui/common/page-heading';
import FriendsList from '@/src/components/ui/friend/friends-list';
import IncomingFriendRequests from '@/src/components/ui/friend/incoming-friend-requests';
import OutgoingFriendRequests from '@/src/components/ui/friend/outgoing-friend-requests';
import { useToast } from '@chakra-ui/react';

export default function Friends() {
  const toast = useToast();
  const { isLoaded, isSignedIn, user } = useUser();

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
          <PageHeading icon={<BsPeople />} heading='Friends' />
          <IncomingFriendRequests
            playerId={user.id}
            onAcceptClicked={(data) => {
              console.log(`accept clicked: data: ${JSON.stringify(data)}`);
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
            onBlockClicked={(data) => {
              console.log(`block clicked: data: ${JSON.stringify(data)}`);
            }}
          />
          <OutgoingFriendRequests playerId={user.id} />
          <FriendsList playerId={user.id} />
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

  return <Layout title='Friends'>{content}</Layout>;
}
