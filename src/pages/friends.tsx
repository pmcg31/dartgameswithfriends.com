import Layout from '@/src/components/ui/layout/layout';
import { Flex } from '@chakra-ui/react';
import { useUser, RedirectToSignIn } from '@clerk/clerk-react';
import { BsPeople } from 'react-icons/bs';
// import { trpc } from '../utils/trpc';
import PageHeading from '../components/ui/common/page-heading';
import FriendsList from '../components/ui/friend/friends-list';
import IncomingFriendRequests from '../components/ui/friend/incoming-friend-requests';
import OutgoingFriendRequests from '../components/ui/friend/outgoing-friend-requests';

export default function Friends() {
  const { isLoaded, isSignedIn, user } = useUser();

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
          <IncomingFriendRequests playerId={user.id} />
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
