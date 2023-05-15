import { trpc } from '@/src/utils/trpc';
import { Avatar, HStack, Text, VStack } from '@chakra-ui/react';
import { CSSProperties } from 'react';
import { IconContext } from 'react-icons';
import { BsPerson } from 'react-icons/bs';

export default function Player({
  playerId,
  size,
  addedText,
  sx
}: {
  playerId: string;
  size?: 'sm' | 'lg';
  addedText?: string;
  sx?: CSSProperties;
}): JSX.Element {
  const getPlayerQ = trpc.getPlayer.useQuery({ id: playerId });
  let fontSize = 'lg';
  let addedTextFontSize = 'sm';
  let iconSize = 'sm';
  if (addedText) {
    iconSize = 'md';
  }
  if (size === 'lg') {
    if (addedText) {
      iconSize = 'lg';
    } else {
      iconSize = 'md';
    }
    fontSize = '4xl';
    addedTextFontSize = 'md';
  }

  return (
    <HStack sx={sx}>
      <IconContext.Provider value={{ size: '1.5rem' }}>
        {getPlayerQ.isSuccess &&
        getPlayerQ.data &&
        getPlayerQ.data.profileImageUrl ? (
          <Avatar src={getPlayerQ.data.profileImageUrl} size={iconSize} />
        ) : (
          <BsPerson />
        )}
      </IconContext.Provider>
      <VStack align={'start'}>
        <Text fontSize={fontSize} fontWeight={700} lineHeight={'80%'}>
          {getPlayerQ.isSuccess && getPlayerQ.data && getPlayerQ.data.handle}
        </Text>
        {addedText && (
          <Text fontSize={addedTextFontSize} opacity={'50%'} lineHeight={'80%'}>
            {addedText}
          </Text>
        )}
      </VStack>
    </HStack>
  );
}
