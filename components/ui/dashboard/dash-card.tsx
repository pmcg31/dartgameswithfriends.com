import { Flex, Heading } from '@chakra-ui/react';

export default function DashCard({
  title,
  children
}: {
  title: string;
  children: JSX.Element | JSX.Element[];
}): JSX.Element {
  return (
    <Flex
      direction={'column'}
      borderRadius={'1rem'}
      backgroundColor={'rgba(0,0,0,0.3)'}
      overflow={'hidden'}
    >
      <Flex
        backgroundColor={'rgba(0,0,0,0.3)'}
        alignItems={'center'}
        justifyItems={'center'}
        p={'0.5rem'}
        direction={'column'}
      >
        <Heading size={'md'}>{title}</Heading>
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
