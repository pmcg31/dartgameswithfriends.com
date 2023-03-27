import {
  DartHitEvent,
  dartHitEventToPoints,
  DartHitKind,
  multiplierToDisplayString,
  scoreAreaToString
} from '@/lib/dart-types';
import { Flex } from '@chakra-ui/react';

export type DartHitDisplayProps = {
  event?: DartHitEvent;
  hidePoints?: boolean;
  sx?: object;
};

export default function DartHitDisplay(
  props: DartHitDisplayProps
): JSX.Element {
  // Dart display
  const dartDisplayStyles = {
    '.multiplier': { color: 'var(--bright-text-color)', fontSize: '1rem' },
    '.scoreArea': {
      color: 'var(--bright-text-color)',
      fontSize: '1.5rem',
      fontWeight: 'bold'
    }
  };
  let dartDisplay: JSX.Element = undefined;
  if (props.event) {
    if (props.event.kind === DartHitKind.Miss) {
      dartDisplay = (
        <Flex sx={dartDisplayStyles}>
          <p className='scoreArea'>Miss</p>
        </Flex>
      );
    } else if (props.event.kind === DartHitKind.BounceOut) {
      dartDisplay = (
        <Flex sx={dartDisplayStyles}>
          <p className='scoreArea'>BO</p>
        </Flex>
      );
    } else {
      const multDispStr = multiplierToDisplayString(props.event.multiplier);
      const scoreAreaStr = scoreAreaToString(props.event.scoreArea);
      dartDisplay = (
        <Flex sx={dartDisplayStyles} alignItems='baseline'>
          <p className='multiplier'>{multDispStr}</p>
          <p className='scoreArea'>{scoreAreaStr}</p>
        </Flex>
      );
    }
  }

  // Points display
  let pointsDisplay: JSX.Element = undefined;
  if (!props.hidePoints) {
    if (props.event) {
      const pointsStr = `${dartHitEventToPoints(props.event)}`;
      pointsDisplay = (
        <Flex
          marginTop='-0.5rem'
          justifyContent='center'
          alignItems='center'
          sx={{
            '.points': {
              color: 'var(--middle-text-color)'
            }
          }}
        >
          <p className='points'>{pointsStr}</p>
        </Flex>
      );
    }
  }

  return (
    <Flex direction='column' alignItems='center' sx={props.sx}>
      {dartDisplay}
      {pointsDisplay}
    </Flex>
  );
}
