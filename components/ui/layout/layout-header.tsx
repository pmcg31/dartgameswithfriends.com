import { Grid } from '@chakra-ui/react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

export default function LayoutHeader({
  showSignIn
}: {
  showSignIn?: boolean;
}): JSX.Element {
  const showSignInFinal = showSignIn == undefined || showSignIn;
  return (
    <Grid
      backgroundColor={'var(--header-color)'}
      color={'white'}
      padding={'1rem'}
      templateColumns={'1fr auto'}
      sx={{ '.cl-userButtonOuterIdentifier': { color: '#fff' } }}
    >
      <p>This is the header</p>
      {showSignInFinal && (
        <>
          <SignedIn>
            <UserButton showName={true} />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </>
      )}
    </Grid>
  );
}
