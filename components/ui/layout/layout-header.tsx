import { Grid } from '@chakra-ui/react';
import AuthManager from '../auth/auth-manager';

export default function LayoutHeader(): JSX.Element {
  return (
    <Grid
      backgroundColor={'var(--header-color)'}
      color={'white'}
      padding={'1rem'}
      templateColumns={'1fr auto'}
    >
      <p>This is the header</p>
      <AuthManager backgroundColor={'var(--header-color)'} />
    </Grid>
  );
}
