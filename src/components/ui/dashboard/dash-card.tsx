import { Heading } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';
import GenericCard from '../common/generic-card';

export default function DashCard({
  id,
  title,
  children
}: PropsWithChildren<{
  id?: string;
  title: string;
}>): JSX.Element {
  return (
    <GenericCard id={id} header={<Heading size={'md'}>{title}</Heading>}>
      {children}
    </GenericCard>
  );
}
