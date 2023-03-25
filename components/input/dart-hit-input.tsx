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

function shiftToSingle() {
  const numberButtons = document.querySelectorAll(
    '.number_button'
  ) as NodeListOf<HTMLButtonElement>;
  numberButtons.forEach((button) => {
    let number = button.id.substring(1);
    if (number == 'B') {
      number = 'Bull';
      button.disabled = false;
    }
    button.textContent = number;
  });
}

function shiftToDouble() {
  const numberButtons = document.querySelectorAll(
    '.number_button'
  ) as NodeListOf<HTMLButtonElement>;
  numberButtons.forEach((button) => {
    let number = button.id.substring(1);
    if (number == 'B') {
      number = 'D Bull';
      button.disabled = false;
    } else {
      number = `D${number}`;
    }
    button.textContent = number;
  });
}

function shiftToTriple() {
  const numberButtons = document.querySelectorAll(
    '.number_button'
  ) as NodeListOf<HTMLButtonElement>;
  numberButtons.forEach((button) => {
    let number = button.id.substring(1);
    if (number == 'B') {
      number = 'Bull';
      button.disabled = true;
    } else {
      number = `T${number}`;
    }
    button.textContent = number;
  });
}

function onMultiplierChanged(event) {
  if (event === 'X1') {
    shiftToSingle();
  } else if (event === 'X2') {
    shiftToDouble();
  } else if (event === 'X3') {
    shiftToTriple();
  } else {
    console.log(`unexpected multiplier change event: ${event}`);
  }
}

export default function DartHitInput(props) {
  // Styles to be applied to all buttons
  const buttonStyles = { borderRadius: '0px', border: 'none' };

  // Array to hold scoring area buttons
  const areaButtons = [];

  // Create buttons for the numbers
  for (let idx = 0; idx < 20; idx++) {
    areaButtons.push(
      <Button
        id={`N${idx + 1}`}
        className='number_button'
        key={idx + 5}
        gridColumn={(idx % 7) + 1}
        gridRow={idx / 7 + 2}
        sx={buttonStyles}
      >
        {idx + 1}
      </Button>
    );
  }

  // Create button for bull
  areaButtons.push(
    <Button
      id='NB'
      className='number_button'
      key={25}
      gridColumn={7}
      gridRow={4}
      sx={buttonStyles}
    >
      Bull
    </Button>
  );

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'multiplier',
    defaultValue: 'X1',
    onChange: onMultiplierChanged
  });

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
        <Button id='BO' key={3} colorScheme='yellow' sx={buttonStyles}>
          BO
        </Button>
        <Button id='Miss' key={4} colorScheme='red' sx={buttonStyles}>
          Miss
        </Button>
      </HStack>
      {areaButtons}
    </ButtonGroup>
  );
}