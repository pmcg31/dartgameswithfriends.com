import Layout from '@/components/ui/layout/layout';
import { Flex } from '@chakra-ui/react';
import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <Layout title='Sign Up' hideSignIn>
      <Flex alignItems={'center'} justifyItems={'center'}>
        <SignUp
          appearance={{
            variables: { colorPrimary: 'hsl(100, 12%, 25%)' }
          }}
        />
      </Flex>
    </Layout>
  );
}
