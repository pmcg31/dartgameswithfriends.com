import Layout from '@/components/ui/layout/layout';
import { Flex, Heading, Avatar, Button } from '@chakra-ui/react';
import { useUser, RedirectToSignIn } from '@clerk/clerk-react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();

  let content: JSX.Element = null;
  if (isLoaded) {
    if (isSignedIn) {
      content = (
        <Flex
          width={'100dvw'}
          maxW={'120ch'}
          p={'1rem'}
          color={'white'}
          direction={'column'}
          gap={'1rem'}
        >
          <Flex
            direction={{ base: 'column', sm: 'row' }}
            alignItems={'center'}
            justifyContent={{
              base: 'flex-start',
              sm: 'space-between'
            }}
            gap={'1rem'}
            wrap={'wrap'}
          >
            <Flex gap={'1rem'}>
              <Avatar src={user.profileImageUrl} />
              <Heading>{user.username}</Heading>
            </Flex>
            <Button
              colorScheme={'blackAlpha'}
              onClick={() => {
                router.push('/user-profile');
              }}
            >
              Manage Account
            </Button>
          </Flex>
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
  return <Layout title='Dashboard'>{content}</Layout>;
}
