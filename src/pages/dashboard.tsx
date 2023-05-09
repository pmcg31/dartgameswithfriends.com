import DashCard from '@/components/ui/dashboard/dash-card';
import Layout from '@/components/ui/layout/layout';
import { Flex, Heading, Avatar, Button, Grid } from '@chakra-ui/react';
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
            alignItems={{ base: 'stretch', sm: 'center' }}
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
          <Grid
            templateColumns={{ base: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' }}
            gap={'1rem'}
          >
            <DashCard title={'Game in Progress'}>
              <p style={{ opacity: '30%' }}>{'You have no game'}</p>
              <Button mt={'0.5rem'} colorScheme={'blackAlpha'}>
                View Games
              </Button>
            </DashCard>
            <DashCard title={'Private Lobby'}>
              <p>Friday Night Darts</p>
              <Button mt={'0.5rem'} colorScheme={'blackAlpha'}>
                Open Lobby
              </Button>
            </DashCard>
            <DashCard title={'Friends'}>
              <p style={{ opacity: '30%' }}>{'You have no friends'}</p>
              <Button mt={'0.5rem'} colorScheme={'blackAlpha'}>
                Invite Friends
              </Button>
            </DashCard>
            <DashCard title={'Achievements'}>
              <p style={{ opacity: '30%' }}>{'You have no achievements'}</p>
              <Button mt={'0.5rem'} colorScheme={'blackAlpha'} isDisabled>
                View All
              </Button>
            </DashCard>
          </Grid>
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
