import { Flex } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

export default function LoadingAnimation({
  color,
  size,
  smallSizeScale,
  smallSizeOpacity,
  spacing,
  duration_ms
}: PropsWithChildren<{
  color?: string;
  size?: string;
  smallSizeScale?: number;
  smallSizeOpacity?: number;
  spacing?: string;
  duration_ms?: number;
}>): JSX.Element {
  const defaults = {
    color: '#888',
    size: '0.4em',
    smallSizeScale: 0.25,
    smallSizeOpacity: 0.1,
    spacing: '0.2em',
    duration_ms: 1000
  };

  return (
    <Flex
      alignItems={'center'}
      gap={spacing || defaults.spacing}
      sx={{
        div: {
          width: size || defaults.size,
          height: size || defaults.size,
          backgroundColor: color || defaults.color,
          borderRadius: '50%',
          animationDuration: `${duration_ms || defaults.duration_ms}ms`,
          animationIterationCount: 'infinite',
          animationTimingFunction: 'ease-out',
          transform: `scale(${String(
            smallSizeScale || defaults.smallSizeScale
          )})`,
          opacity: smallSizeOpacity || defaults.smallSizeOpacity,
          animationName: 'wave'
        },
        '& div:nth-of-type(2)': {
          animationDelay: `calc(${String(
            duration_ms || defaults.duration_ms
          )}ms * 0.3)`
        },
        '& div:nth-of-type(3)': {
          animationDelay: `calc(${String(
            duration_ms || defaults.duration_ms
          )}ms * 0.6)`
        },
        '@keyframes wave': {
          '0%': {
            transform: `scale(${String(
              smallSizeScale || defaults.smallSizeScale
            )})`,
            opacity: smallSizeOpacity || defaults.smallSizeOpacity
          },
          '30%': {
            transform: 'scale(1)',
            opacity: 1
          },
          '100%': {
            transform: `scale(${String(
              smallSizeScale || defaults.smallSizeScale
            )})`,
            opacity: smallSizeOpacity || defaults.smallSizeOpacity
          }
        }
      }}
    >
      <div></div>
      <div></div>
      <div></div>
    </Flex>
  );
}
