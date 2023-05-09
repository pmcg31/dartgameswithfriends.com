import { AspectRatio, Flex } from '@chakra-ui/react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import DGWFLogo from '../brand/DGWFLogo';

export default function LayoutHeader({
  hideSignIn
}: {
  hideSignIn?: boolean;
}): JSX.Element {
  return (
    <Flex
      backgroundColor={'var(--header-color)'}
      color={'white'}
      padding={'1rem'}
      alignItems={'center'}
      justifyContent={'space-between'}
      direction={'row'}
      sx={{
        '.cl-userButtonOuterIdentifier': { color: '#fff' }
      }}
    >
      <Link href='/'>
        <AspectRatio ratio={1} width={'3rem'} opacity={'50%'}>
          <DGWFLogo />
        </AspectRatio>
      </Link>
      <Flex flexGrow={1} p={'0 1rem'}>
        <SignedIn>
          <Link href='/dashboard'>
            <p>Dashboard</p>
          </Link>
        </SignedIn>
      </Flex>
      {!(hideSignIn != undefined && hideSignIn) && (
        <>
          <SignedIn>
            <UserButton
              showName
              userProfileMode={'navigation'}
              userProfileUrl={'/user-profile'}
              afterSignOutUrl={'/'}
            />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </>
      )}
    </Flex>
  );
}
