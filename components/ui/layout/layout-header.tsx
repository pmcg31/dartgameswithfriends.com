import { Grid } from '@chakra-ui/react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

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
      templateColumns={'1fr auto'}
      sx={{ '.cl-userButtonOuterIdentifier': { color: '#fff' } }}
    >
      <p>This is the header</p>
      {!(hideSignIn != undefined && hideSignIn) && (
        <>
          <SignedIn>
            <UserButton showName />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </>
      )}
    </Grid>
  );
}
