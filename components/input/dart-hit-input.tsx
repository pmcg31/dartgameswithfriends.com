import {
  DartHitEvent,
  DartHitKind,
  DartHitMultiplier,
  multiplierFromString,
  scoreAreaFromString
} from '@/lib/dart-types';
import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  useRadio,
  useRadioGroup
} from '@chakra-ui/react';

function RadioButton(props) {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as='label'>
      <input {...input} />
      <Box
        {...checkbox}
        bg='#3ba16a'
        color='white'
        cursor='pointer'
        py={2}
        sx={{
          ...props.sx,
          textAlign: 'center',
          fontWeight: 'bold'
        }}
        _checked={{
          bg: 'darkgreen'
        }}
      >
        {props.children}
      </Box>
    </Box>
  );
}

type DartHitInputProps = {
  autoResetToSingle?: boolean;
  onDartHit?: (e: DartHitEvent) => void;
};

export default function DartHitInput(props: DartHitInputProps) {
  const { getRootProps, getRadioProps, value, setValue } = useRadioGroup({
    name: 'multiplier',
    defaultValue: 'X1'
  });

  const multiplier = multiplierFromString(value as string);

  function onButtonClicked(event: React.MouseEvent<HTMLButtonElement>) {
    // console.log(
    //   `${
    //     (event.target as HTMLButtonElement).id
    //   } clicked, multipler is ${multiplier}, value is ${value}`
    // );
    if (props.onDartHit) {
      const id = (event.target as HTMLButtonElement).id;

      if (id === 'Miss') {
        props.onDartHit({ kind: DartHitKind.Miss });
      } else if (id === 'BO') {
        props.onDartHit({ kind: DartHitKind.BounceOut });
      } else {
        props.onDartHit({
          kind: DartHitKind.Hit,
          multiplier,
          scoreArea: scoreAreaFromString(id)
        });
      }
    }
    if (props.autoResetToSingle && props.autoResetToSingle === true) {
      setValue('X1');
    }
  }

  // Styles to be applied to all buttons
  const buttonStyles = { borderRadius: '0px', border: 'none' };

  // Array to hold scoring area buttons
  const areaButtons = [];

  // Create buttons for the numbers
  for (let idx = 0; idx < 20; idx++) {
    let label = '';
    switch (multiplier) {
      case DartHitMultiplier.X3:
        label = `T${idx + 1}`;
        break;
      case DartHitMultiplier.X2:
        label = `D${idx + 1}`;
        break;
      case DartHitMultiplier.X1:
      default:
        label = `${idx + 1}`;
        break;
    }
    areaButtons.push(
      <Button
        id={`N${idx + 1}`}
        className='number_button'
        key={idx + 5}
        gridColumn={(idx % 7) + 1}
        gridRow={idx / 7 + 2}
        sx={buttonStyles}
        onClick={onButtonClicked}
      >
        {label}
      </Button>
    );
  }

  // Create button for bull
  let label = '';
  let disabled = false;
  switch (multiplier) {
    case DartHitMultiplier.X3:
      label = 'Bull';
      disabled = true;
      break;
    case DartHitMultiplier.X2:
      label = 'D Bull';
      disabled = false;
      break;
    case DartHitMultiplier.X1:
    default:
      label = 'Bull';
      disabled = false;
      break;
  }
  areaButtons.push(
    <Button
      id='NB'
      className='number_button'
      key={25}
      gridColumn={7}
      gridRow={4}
      sx={buttonStyles}
      onClick={onButtonClicked}
      isDisabled={disabled}
    >
      {label}
    </Button>
  );

  // setValue(multiplierToString(multiplier));

  const group = getRootProps();
  const radioX1 = getRadioProps({ value: 'X1' });
  const radioX2 = getRadioProps({ value: 'X2' });
  const radioX3 = getRadioProps({ value: 'X3' });

  return (
    <ButtonGroup
      colorScheme='whiteAlpha'
      spacing={0}
      sx={{
        display: 'grid',
        gap: '3px',
        templateColumns: 'repeat(7, 1fr)',
        templateRows: 'repeat(4, 1fr)'
      }}
    >
      <HStack
        {...group}
        gridColumn='1 / span 7'
        spacing={0}
        sx={{
          display: 'grid',
          gap: '3px',
          gridTemplateColumns: 'repeat(5, 1fr)'
        }}
      >
        <RadioButton id='X1' key={0} sx={buttonStyles} {...radioX1}>
          1X
        </RadioButton>
        <RadioButton id='X2' key={1} sx={buttonStyles} {...radioX2}>
          2X
        </RadioButton>
        <RadioButton id='X3' key={2} sx={buttonStyles} {...radioX3}>
          3X
        </RadioButton>
        <Button
          id='BO'
          key={3}
          colorScheme='yellow'
          sx={buttonStyles}
          onClick={onButtonClicked}
        >
          BO
        </Button>
        <Button
          id='Miss'
          key={4}
          colorScheme='red'
          sx={buttonStyles}
          onClick={onButtonClicked}
        >
          Miss
        </Button>
      </HStack>
      {areaButtons}
    </ButtonGroup>
  );
}
