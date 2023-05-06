import { AspectRatio, Grid } from '@chakra-ui/react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import Logo from './dgwf_logo.svg';

export default function LayoutHeader({
  hideSignIn
}: {
  hideSignIn?: boolean;
}): JSX.Element {
  return (
    <Grid
      backgroundColor={'var(--header-color)'}
      color={'white'}
      padding={'1rem'}
      alignItems={'center'}
      templateColumns={'1fr auto'}
      sx={{ '.cl-userButtonOuterIdentifier': { color: '#fff' } }}
    >
      <Link href='/'>
        <AspectRatio
          ratio={1}
          maxW={'3rem'}
          opacity={'50%'}
          sx={{
            '.stroke_me': { stroke: '#fff' },
            '.fill_me': { fill: '#fff' }
          }}
        >
          <Logo />
        </AspectRatio>
      </Link>
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
    </Grid>
  );
}
