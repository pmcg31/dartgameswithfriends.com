import { Box, Grid } from '@chakra-ui/react';
import { CSSProperties, PropsWithChildren } from 'react';

let g_isLoaded = false;

export default function LoadingPlaceholder({
  isLoaded,
  sx,
  children
}: PropsWithChildren<{
  isLoaded: boolean;
  sx?: CSSProperties;
}>): JSX.Element {
  g_isLoaded = isLoaded;

  return (
    <Grid gridArea={'cell'} isolation={'isolate'} alignItems={'center'} sx={sx}>
      {children}
    </Grid>
  );
}

LoadingPlaceholder.Loaded = function Loaded({ children }: PropsWithChildren) {
  return (
    <Box
      opacity={g_isLoaded ? 1 : 0}
      gridArea={'cell'}
      transition={'opacity 500ms ease'}
    >
      {children}
    </Box>
  );
};

LoadingPlaceholder.NotLoaded = function NotLoaded({
  children
}: PropsWithChildren) {
  return (
    <Box
      opacity={g_isLoaded ? 0 : 1}
      gridArea={'cell'}
      transition={'opacity 10ms ease'}
      zIndex={-1}
    >
      {children}
    </Box>
  );
};
