import { DartHitEvent } from '@/lib/dart-types';
import { Box, Flex, Grid, IconButton, Icon } from '@chakra-ui/react';
import { ImUndo2 } from 'react-icons/im';
import { GiDart } from 'react-icons/gi';
import { useState } from 'react';
import DartHitDisplay from '../output/dart-hit-display';
import DartHitInput from './dart-hit-input';

export type TurnControllerPlayer = {
  name: string;
  team?: string;
};

export type PlayerChangeEvent = {
  player: TurnControllerPlayer;
};

export type TurnControllerProps = {
  players: TurnControllerPlayer[];
  playerChangeTimeout_ms?: number;
  dartsPerTurn?: 1 | 2 | 3;
  hidePoints?: boolean;
  autoResetToSingle?: boolean;
  sx?: object;
  onDartHit?: (e: DartHitEvent) => void;
  onPlayerChange?: (e: PlayerChangeEvent) => void;
  onUndo?: () => void;
};

export default function TurnController(
  props: TurnControllerProps
): JSX.Element {
  const [dartHitEvents, setDartHitEvents] = useState([]);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);

  // Get darts per turn from props (default to 3)
  const dartsPerTurn = props.dartsPerTurn || 3;

  // Get player change timeout from props (default to 3 sec)
  const playerChangeTimeout_ms = props.playerChangeTimeout_ms || 3000;

  // Reference to current timeout
  let timeoutID: NodeJS.Timeout = undefined;

  function advanceToNextPlayer() {
    // Clear timeoutID
    timeoutID = undefined;

    // Clear dart hits
    setDartHitEvents([]);

    // Advance index to next player
    setCurrentPlayerIdx((prevValue) => {
      let newValue = prevValue + 1;
      if (newValue >= props.players.length) {
        newValue = 0;
      }

      // Send event
      if (props.onPlayerChange) {
        props.onPlayerChange({ player: props.players[newValue] });
      }

      return newValue;
    });
  }

  function onDartHit(event: DartHitEvent) {
    // Track event
    setDartHitEvents((prevValue) => {
      if (prevValue.length < dartsPerTurn) {
        if (prevValue.length === dartsPerTurn - 1) {
          // Change players
          if (!timeoutID) {
            timeoutID = setTimeout(advanceToNextPlayer, playerChangeTimeout_ms);
          }
        }
        return [...prevValue, event];
      } else {
        return [event];
      }
    });

    // Forward event
    if (props.onDartHit) {
      props.onDartHit(event);
    }
  }

  // Check for turn ended
  let turnChangingDisplay: JSX.Element = undefined;
  if (dartHitEvents.length === dartsPerTurn) {
    // Set up turn changing display
    turnChangingDisplay = (
      <Box
        p='40px'
        backgroundColor='black'
        opacity='85%'
        color='white'
        gridRow={2}
        gridColumn={1}
        zIndex={2}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          '.playerName': {
            color: 'var(--bright-text-color)',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          },
          '.turnEnded': {
            color: 'var(--dim-text-color)',
            fontSize: '1rem'
          }
        }}
      >
        <p className='playerName'>{props.players[currentPlayerIdx].name}</p>
        <p className='turnEnded'>Turn Ended</p>
      </Box>
    );
  }

  // Player display
  const playerDisplayStyles = {
    '.playerName': {
      color: 'var(--bright-text-color)',
      fontSize: '1.5rem',
      fontWeight: 'bold'
    },
    '.playerTeam': { color: 'var(--bright-text-color)', fontSize: '0.8rem' }
  };
  let playerDisplay: JSX.Element = undefined;
  if (props.players[currentPlayerIdx].team) {
    playerDisplay = (
      <Flex sx={playerDisplayStyles} direction='column'>
        <p className='playerName'>{props.players[currentPlayerIdx].name}</p>
        <p className='playerTeam'>{props.players[currentPlayerIdx].team}</p>
      </Flex>
    );
  } else {
    playerDisplay = (
      <Flex sx={playerDisplayStyles}>
        <p className='playerName'>{props.players[currentPlayerIdx].name}</p>
      </Flex>
    );
  }

  // Dart hits
  const dartHitDisplays = [];
  let dartPlaceholderColor = 'var(--text-green)';
  for (let i = 0; i < dartsPerTurn; i++) {
    if (dartHitEvents[i]) {
      dartHitDisplays.push(
        <DartHitDisplay
          event={dartHitEvents[i]}
          hidePoints={props.hidePoints}
          key={i}
        />
      );
    } else {
      dartHitDisplays.push(
        <Flex key={i} alignItems='center'>
          <Icon as={GiDart} color={dartPlaceholderColor} />
          <p style={{ color: dartPlaceholderColor }}>{i + 1}</p>
        </Flex>
      );
      dartPlaceholderColor = 'var(--dim-text-color)';
    }
  }

  return (
    <Grid
      sx={{
        ...props.sx,
        padding: '20px',
        maxWidth: '600px',
        backgroundColor: 'var(--background-color)'
      }}
    >
      <Grid
        gridRow={1}
        templateColumns='2fr 5fr auto'
        minHeight='4rem'
        alignItems='center'
      >
        {playerDisplay}
        <Grid
          justifyItems='center'
          alignItems='center'
          templateColumns='repeat(3, 1fr)'
        >
          {dartHitDisplays}
        </Grid>
        <IconButton
          marginLeft='5px'
          icon={<Icon as={ImUndo2} />}
          aria-label='undo'
          colorScheme='whiteAlpha'
          borderRadius='0px'
          border='none'
          onClick={props.onUndo}
        ></IconButton>
      </Grid>
      <DartHitInput
        autoResetToSingle={props.autoResetToSingle}
        onDartHit={onDartHit}
        sx={{ gridRow: '2', gridColumn: '1' }}
      />
      {turnChangingDisplay}
    </Grid>
  );
}
