import Layout from '@/src/components/ui/layout/layout';
import { Flex } from '@chakra-ui/react';
import { UserProfile } from '@clerk/nextjs';

export default function Page() {
  return (
    <Layout title={'User Profile'}>
      <Flex alignItems={'center'} justifyItems={'center'}>
        <UserProfile
          path='/user-profile'
          routing='path'
          appearance={{
            variables: { colorPrimary: 'hsl(100, 12%, 25%)' }
          }}
        />
      </Flex>
    </Layout>
  );
}
