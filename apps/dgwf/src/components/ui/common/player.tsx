import { useWsQueryTracker } from '@/src/lib/websocket/use-ws-query-tracker';
import { trpc } from '@/src/utils/trpc';
import {
  Avatar,
  Box,
  Flex,
  Grid,
  HStack,
  Text,
  VStack
} from '@chakra-ui/react';
import { CSSProperties } from 'react';
import { IconContext } from 'react-icons';
import { BsFillCircleFill } from 'react-icons/bs';
import LoadingAnimation from '@/src/components/ui/common/loading-animation';
import LoadingPlaceholder from '@/src/components/ui/common/loading-placeholder';

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
        <LoadingPlaceholder isLoaded={getPlayerQ.isSuccess} sx={{ zIndex: -1 }}>
          <LoadingPlaceholder.Loaded>
            <Avatar
              src={
                getPlayerQ.data && getPlayerQ.data.profileImageUrl
                  ? getPlayerQ.data.profileImageUrl
                  : 'https://www.gravatar.com/avatar?d=mp'
              }
              size={iconSize}
              style={{
                gridArea: 'cell',
                alignSelf: 'center',
                justifySelf: 'center'
              }}
            />
          </LoadingPlaceholder.Loaded>
          <LoadingPlaceholder.NotLoaded>
            <Avatar
              src={'https://www.gravatar.com/avatar?d=mp'}
              size={iconSize}
              style={{
                gridArea: 'cell',
                alignSelf: 'center',
                justifySelf: 'center'
              }}
            />
          </LoadingPlaceholder.NotLoaded>
        </LoadingPlaceholder>
        {getPlayerQ.isSuccess &&
          getPlayerQ.data &&
          getPlayerQ.data.isOnline && (
            <Box gridArea={'cell'} alignSelf={'end'} justifySelf={'end'}>
              <IconContext.Provider value={{ size: '0.65rem' }}>
                <BsFillCircleFill
                  color={'#0f0'}
                  style={{
                    gridArea: 'cell'
                  }}
                />
              </IconContext.Provider>
            </Box>
          )}
      </Grid>
      <VStack align={'start'}>
        {/* This Flex is only here to provide the same fontSize to both 
            LoadingAnimation and Text; this creates the animation at the
            proper size */}
        <Flex fontSize={fontSize}>
          <LoadingPlaceholder isLoaded={getPlayerQ.isSuccess}>
            <LoadingPlaceholder.Loaded>
              <Text fontWeight={700} lineHeight={'80%'}>
                {getPlayerQ.data ? getPlayerQ.data.handle : '--'}
              </Text>
            </LoadingPlaceholder.Loaded>
            <LoadingPlaceholder.NotLoaded>
              <LoadingAnimation />
            </LoadingPlaceholder.NotLoaded>
          </LoadingPlaceholder>
        </Flex>
        {addedText && (
          <Text fontSize={addedTextFontSize} opacity={'50%'} lineHeight={'80%'}>
            {addedText}
          </Text>
        )}
      </VStack>
    </HStack>
  );
}
