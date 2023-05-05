import { Grid } from '@chakra-ui/react';

export default function LayoutFooter(): JSX.Element {
  return (
    <Grid
      backgroundColor={'var(--footer-color)'}
      color={'white'}
      padding={'1rem'}
      justifyItems={'center'}
      sx={{ p: { opacity: '30%' } }}
    >
      <p>
        Copyright ©️{new Date().getFullYear()} The Dart Games With Friends Guys
      </p>
    </Grid>
  );
}
