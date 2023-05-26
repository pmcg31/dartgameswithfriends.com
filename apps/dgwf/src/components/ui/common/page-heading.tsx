import { Heading, HStack } from '@chakra-ui/react';
import { IconContext } from 'react-icons';

export default function PageHeading({
  icon,
  heading
}: {
  icon: JSX.Element;
  heading: string;
}): JSX.Element {
  return (
    <HStack>
      <IconContext.Provider value={{ size: '1.5rem' }}>
        {icon}
      </IconContext.Provider>
      <Heading as={'h1'}>{heading}</Heading>
    </HStack>
  );
}
