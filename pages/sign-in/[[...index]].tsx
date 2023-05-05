import Layout from '@/components/ui/layout/layout';
import { Flex } from '@chakra-ui/react';
import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <Layout title='Sign In' hideSignIn>
      <Flex alignItems={'center'} justifyItems={'center'}>
        <SignIn
          appearance={{
            variables: { colorPrimary: 'hsl(100, 12%, 25%)' }
          }}
        />
      </Flex>
    </Layout>
  );
}
