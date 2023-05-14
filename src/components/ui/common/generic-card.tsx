import { Flex } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

export default function GenericCard({
  id,
  key,
  header,
  children
}: PropsWithChildren<{
  id?: string;
  key?: string;
  header: JSX.Element | JSX.Element[];
}>): JSX.Element {
  return (
    <Flex
      id={id}
      key={key}
      direction={'column'}
      borderRadius={'0.4rem'}
      backgroundColor={'rgba(0,0,0,0.3)'}
      overflow={'hidden'}
    >
      <Flex
        backgroundColor={'rgba(0,0,0,0.2)'}
        alignItems={'center'}
        justifyItems={'center'}
        p={'0.5rem'}
        direction={'column'}
      >
        {header}
      </Flex>
      <Flex
        flexGrow={1}
        alignItems={'center'}
        justifyItems={'center'}
        p={'0.5rem'}
        direction={'column'}
      >
        {children}
      </Flex>
    </Flex>
  );
}
