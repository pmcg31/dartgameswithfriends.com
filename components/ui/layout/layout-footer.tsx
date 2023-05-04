import { Grid } from '@chakra-ui/react';

export default function LayoutFooter(): JSX.Element {
  return (
    <Grid
      backgroundColor={'var(--footer-color)'}
      color={'white'}
      padding={'1rem'}
    >
      <p>This is the footer</p>
    </Grid>
  );
}
