import TurnController, {
  PlayerChangeEvent,
  TurnControllerPlayer
} from '@/src/components/input/turn-controller';
import {
  DartHitEvent,
  dartHitEventToPoints,
  dartHitEventToString
} from '@/src/lib/dart-types';
import {
  Flex,
  Grid,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Stack
} from '@chakra-ui/react';
import { useRef, useState } from 'react';

export default function TestTurnController(): JSX.Element {
  const [autoResetSingle, setAutoResetSingle] = useState(true);
  const [hidePoints, setHidePoints] = useState(false);
  const [dartsPerTurn, setDartsPerTurn] = useState<1 | 2 | 3>(3);
  const [playerChangeTimeout_ms, setPlayerChangeTimeout_ms] = useState(3000);
  const dartHitP = useRef<HTMLParagraphElement>(null);
  const pointsP = useRef<HTMLParagraphElement>(null);
  const playerP = useRef<HTMLParagraphElement>(null);
  const teamP = useRef<HTMLParagraphElement>(null);
  const undoP = useRef<HTMLParagraphElement>(null);

  const players: TurnControllerPlayer[] = [
    { name: 'Chris', team: 'Donkey Punchers' },
    { name: 'John', team: 'Greek Squad' },
    { name: 'Rich' }
  ];

  // References to timeouts
  let dartHitTimeoutID: NodeJS.Timeout | undefined = undefined;
  let playerChangeTimeoutID: NodeJS.Timeout | undefined = undefined;
  let undoTimeoutID: NodeJS.Timeout | undefined = undefined;

  function onAutoResetSingleChanged(event: string) {
    setAutoResetSingle(event === '1');
  }

  function onHidePointsChanged(event: string) {
    setHidePoints(event === '1');
  }

  function onDartsPerTurnChanged(event: string) {
    setDartsPerTurn(Number(event) as 1 | 2 | 3);
  }

  function onEndTurnTimeoutChanged(
    valueAsString: string,
    valueAsNumber: number
  ) {
    setPlayerChangeTimeout_ms(valueAsNumber);
  }

  function onDartHit(event: DartHitEvent) {
    // Display the hit and points
    (dartHitP.current as HTMLParagraphElement).textContent =
      dartHitEventToString(event);
    (
      pointsP.current as HTMLParagraphElement
    ).textContent = `${dartHitEventToPoints(event)}`;

    // If there is a dart hit timer out
    // there, cancel it
    if (dartHitTimeoutID !== undefined) {
      clearTimeout(dartHitTimeoutID);
    }

    // Clear hit and points after 2 sec
    dartHitTimeoutID = setTimeout(() => {
      (dartHitP.current as HTMLParagraphElement).innerHTML = '&nbsp;';
      (pointsP.current as HTMLParagraphElement).innerHTML = '&nbsp;';
    }, 2000);
  }

  function onPlayerChange(event: PlayerChangeEvent) {
    // Display the name and team
    (playerP.current as HTMLParagraphElement).textContent = event.player.name;
    if (event.player.team) {
      (teamP.current as HTMLParagraphElement).textContent = event.player.team;
    }

    // If there is a player change timer out
    // there, cancel it
    if (playerChangeTimeoutID !== undefined) {
      clearTimeout(playerChangeTimeoutID);
    }

    // Clear name and team after 2 sec
    playerChangeTimeoutID = setTimeout(() => {
      (playerP.current as HTMLParagraphElement).innerHTML = '&nbsp;';
      (teamP.current as HTMLParagraphElement).innerHTML = '&nbsp;';
    }, 2000);
  }

  function onUndo() {
    // Display the text
    (undoP.current as HTMLParagraphElement).textContent = 'Undo!';

    // If there is a undo timer out
    // there, cancel it
    if (undoTimeoutID !== undefined) {
      clearTimeout(undoTimeoutID);
    }

    // Clear text after 2 sec
    undoTimeoutID = setTimeout(() => {
      (undoP.current as HTMLParagraphElement).innerHTML = '&nbsp;';
    }, 2000);
  }

  return (
    <main>
      <Grid templateRows='auto 1rem 1fr' maxWidth={'600px'} margin={'0 auto'}>
        <Grid
          templateRows='auto auto'
          backgroundColor='var(--background-color)'
          color='var(--bright-text-color)'
          p='20px'
        >
          <Flex paddingBottom='1rem' direction='column' alignItems='center'>
            <p style={{ fontWeight: 'bold' }}>Turn Controller Tester</p>
          </Flex>
          <Grid justifyItems='center' templateColumns='1fr 1fr 1fr'>
            <Flex direction='column' alignItems='center'>
              <p>Darts Per Turn</p>
              <RadioGroup defaultValue='3' onChange={onDartsPerTurnChanged}>
                <Stack spacing={0} direction='column'>
                  <Radio value='1'>1</Radio>
                  <Radio value='2'>2</Radio>
                  <Radio value='3'>3</Radio>
                </Stack>
              </RadioGroup>
            </Flex>
            <Flex direction='column' alignItems='center'>
              <p>Hide Points</p>
              <RadioGroup defaultValue='2' onChange={onHidePointsChanged}>
                <Stack spacing={0} direction='column'>
                  <Radio value='1'>true</Radio>
                  <Radio value='2'>false</Radio>
                </Stack>
              </RadioGroup>
            </Flex>
            <Flex direction='column' alignItems='center'>
              <p>Auto Reset Single</p>
              <RadioGroup defaultValue='1' onChange={onAutoResetSingleChanged}>
                <Stack spacing={0} direction='column'>
                  <Radio value='1'>true</Radio>
                  <Radio value='2'>false</Radio>
                </Stack>
              </RadioGroup>
            </Flex>
          </Grid>
          <Flex paddingTop='1rem' direction='column'>
            <p>End Turn Timeout (ms)</p>
            <NumberInput
              step={250}
              defaultValue={playerChangeTimeout_ms}
              min={500}
              max={30000}
              onChange={onEndTurnTimeoutChanged}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper color='var(--bright-text-color' />
                <NumberDecrementStepper color='var(--bright-text-color' />
              </NumberInputStepper>
            </NumberInput>
          </Flex>
          <Flex paddingTop='1rem' direction='column'>
            <p>onDartHit</p>
            <Grid
              border='1px solid var(--bright-text-color)'
              borderRadius='0.5rem'
              padding='0.5rem 1rem'
              templateColumns='1fr 1fr'
              justifyItems='center'
            >
              <p ref={dartHitP} style={{ color: 'var(--bright-text-color)' }}>
                &nbsp;
              </p>
              <p ref={pointsP} style={{ color: 'var(--bright-text-color)' }}>
                &nbsp;
              </p>
            </Grid>
          </Flex>
          <Flex paddingTop='1rem' direction='column'>
            <p>onPlayerChange</p>
            <Grid
              border='1px solid var(--bright-text-color)'
              borderRadius='0.5rem'
              padding='0.5rem 1rem'
              templateColumns='1fr 1fr'
            >
              <p ref={playerP} style={{ color: 'var(--bright-text-color)' }}>
                &nbsp;
              </p>
              <p ref={teamP} style={{ color: 'var(--bright-text-color)' }}>
                &nbsp;
              </p>
            </Grid>
          </Flex>
          <Flex paddingTop='1rem' direction='column'>
            <p>onUndo</p>
            <p
              ref={undoP}
              style={{
                border: '1px solid var(--bright-text-color)',
                borderRadius: '0.5rem',
                padding: '0.5rem 1rem'
              }}
            >
              &nbsp;
            </p>
          </Flex>
        </Grid>
        <p></p>
        <TurnController
          players={players}
          playerChangeTimeout_ms={playerChangeTimeout_ms}
          dartsPerTurn={dartsPerTurn}
          autoResetToSingle={autoResetSingle}
          hidePoints={hidePoints}
          onDartHit={onDartHit}
          onPlayerChange={onPlayerChange}
          onUndo={onUndo}
        />
      </Grid>
    </main>
  );
}
