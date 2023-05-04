import { Grid } from '@chakra-ui/react';

export default function LayoutHeader(): JSX.Element {
  return (
    <Grid
      backgroundColor={'var(--header-color)'}
      color={'white'}
      padding={'1rem'}
    >
      <p>This is the header</p>
    </Grid>
  );
}
