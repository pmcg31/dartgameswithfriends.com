import { Grid } from '@chakra-ui/react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

export default function LayoutHeader(): JSX.Element {
  return (
    <Grid
      backgroundColor={'var(--header-color)'}
      color={'white'}
      padding={'1rem'}
      templateColumns={'1fr auto'}
    >
      <p>This is the header</p>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </Grid>
  );
}
