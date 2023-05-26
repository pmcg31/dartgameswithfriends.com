import Layout from '@/src/components/ui/layout/layout';
import { Box, Flex, Heading } from '@chakra-ui/react';
import Image from 'next/image';

export default function Home() {
  return (
    <Layout title='Home'>
      <Flex
        direction={'column'}
        alignItems={'center'}
        justifyContent={'center'}
        width={'100%'}
      >
        <Box height={'40vh'} position={'relative'} width={'100%'}>
          <Image
            src='/dartfriends.png'
            alt='13'
            fill
            priority
            style={{ objectFit: 'contain' }}
          />
        </Box>
        <Box color={'white'} textAlign='center'>
          <Heading
            as='h1'
            fontSize={{ base: '1.5rem', md: '2rem', lg: '3rem' }}
            fontWeight={'700'}
            padding={'0 0.5rem'}
            margin={'0 auto'}
          >
            Dart Games with Friends
          </Heading>
          <p>Coming Soon</p>
        </Box>
      </Flex>
    </Layout>
  );
}
