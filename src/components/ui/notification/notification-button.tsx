import {
  Box,
  Flex,
  Grid,
  Menu,
  MenuButton,
  MenuItem,
  MenuList
} from '@chakra-ui/react';
import { useUser } from '@clerk/nextjs';
import { trpc } from '@/src/utils/trpc';
import { BsBell } from 'react-icons/bs';
import { MdOutlineNewReleases } from 'react-icons/md';
import { IconContext } from 'react-icons/lib';

export default function NotificationButton() {
  // Use clerk user
  const { isLoaded, isSignedIn, user } = useUser();

  // Get query for notification count for logged in user
  const notifyCountQ = trpc.getNewNotificationCount.useQuery(
    { playerId: user ? user.id : '' },
    { enabled: isLoaded && isSignedIn }
  );

  return (
    <Menu>
      <MenuButton>
        <Grid gridArea={'cell'} isolation={'isolate'}>
          <IconContext.Provider
            value={{ className: 'shared-class', size: '1.75rem' }}
          >
            <BsBell
              style={{
                gridArea: 'cell',
                zIndex: -1,
                alignSelf: 'center',
                justifySelf: 'center'
              }}
            />
          </IconContext.Provider>
          {notifyCountQ.isSuccess && notifyCountQ.data > 0 && (
            <Box
              gridArea={'cell'}
              alignSelf={'start'}
              justifySelf={'end'}
              backgroundColor={'red'}
              color={'#fff'}
              height={'1.5em'}
              borderRadius={'0.75em'}
              fontSize={'x-small'}
              padding={'0 0.5em'}
              mt={'-0.25rem'}
              mr={'-0.25rem'}
            >
              {notifyCountQ.data}
            </Box>
          )}
        </Grid>
      </MenuButton>
      <MenuList
        backgroundColor={'var(--brand-color)'}
        border={'2px solid #888'}
      >
        <MenuItem
          backgroundColor={'var(--brand-color)'}
          _focus={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
        >
          <Flex direction={'row'} alignItems={'center'} gap={'0.25rem'}>
            <IconContext.Provider
              value={{ className: 'shared-class', size: '1.25rem' }}
            >
              <MdOutlineNewReleases color={'red'} />
            </IconContext.Provider>
            Coming Sooner!
          </Flex>
        </MenuItem>
        <MenuItem
          backgroundColor={'var(--brand-color)'}
          _focus={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
        >
          <Flex direction={'row'} alignItems={'center'} gap={'0.25rem'}>
            <IconContext.Provider
              value={{ className: 'shared-class', size: '1.25rem' }}
            >
              <MdOutlineNewReleases color={'red'} opacity={0} />
            </IconContext.Provider>
            Coming Soon!
          </Flex>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
