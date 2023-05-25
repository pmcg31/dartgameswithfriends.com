import { useWsQueryTracker } from '@/src/lib/websocket/use-ws-query-tracker';
import { trpc } from '@/src/utils/trpc';
import { Avatar, Box, Grid, HStack, Text, VStack } from '@chakra-ui/react';
import { CSSProperties } from 'react';
import { IconContext } from 'react-icons';
import { BsFillCircleFill, BsPerson } from 'react-icons/bs';

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
  // Use the websocket query tracker
  const { usingQuery } = useWsQueryTracker();

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

  // Inform tracker we're using the query
  usingQuery({
    getPlayer: {
      id: playerId
    }
  });

  return (
    <HStack sx={sx}>
      <Grid gridArea={'cell'} isolation={'isolate'}>
        <IconContext.Provider value={{ size: '1.5rem' }}>
          {getPlayerQ.isSuccess &&
          getPlayerQ.data &&
          getPlayerQ.data.profileImageUrl ? (
            <Avatar
              src={getPlayerQ.data.profileImageUrl}
              size={iconSize}
              style={{
                gridArea: 'cell',
                zIndex: -1,
                alignSelf: 'center',
                justifySelf: 'center'
              }}
            />
          ) : (
            <BsPerson
              style={{
                gridArea: 'cell',
                zIndex: -1,
                alignSelf: 'center',
                justifySelf: 'center'
              }}
            />
          )}
        </IconContext.Provider>
        {getPlayerQ.isSuccess &&
          getPlayerQ.data &&
          getPlayerQ.data.isOnline && (
            <Box gridArea={'cell'} alignSelf={'end'} justifySelf={'end'}>
              <IconContext.Provider value={{ size: '0.65rem' }}>
                <BsFillCircleFill
                  color={'#0f0'}
                  style={{
                    gridArea: 'cell',
                    zIndex: -1
                  }}
                />
              </IconContext.Provider>
            </Box>
          )}
      </Grid>
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
