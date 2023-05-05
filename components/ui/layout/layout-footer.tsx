import { Flex, Grid } from '@chakra-ui/react';

export default function LayoutFooter(): JSX.Element {
  return (
    <Grid
      backgroundColor={'var(--footer-color)'}
      color={'white'}
      padding={'1rem'}
      justifyItems={'center'}
      sx={{ p: { opacity: '30%' } }}
    >
      <Flex
        wrap={'wrap'}
        justifyContent={'center'}
        sx={{ p: { padding: '0 0.25rem' } }}
      >
        <p>Copyright ©️{new Date().getFullYear()}</p>
        <p>The Dart Games With Friends Guys</p>
      </Flex>
    </Grid>
  );
}
