import { Heading } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';
import GenericCard from '../common/generic-card';

export default function DashCard({
  id,
  key,
  title,
  children
}: PropsWithChildren<{
  id?: string;
  key?: string;
  title: string;
}>): JSX.Element {
  return (
    <GenericCard
      id={id}
      key={key}
      header={<Heading size={'md'}>{title}</Heading>}
    >
      {children}
    </GenericCard>
  );
}
