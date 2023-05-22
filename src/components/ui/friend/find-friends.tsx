import { FriendRequestActionData } from '@/src/lib/friend-types';
import { trpc } from '@/src/utils/trpc';
import { Grid, Input } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { BsPersonPlus } from 'react-icons/bs';
import FriendCard, { FriendCardData } from './friend-card';
import { WsQueryTrackerContext } from '@/src/lib/websocket/ws-query-tracker-context';

export default function FindFriends({
  playerId,
  limit,
  onAddFriendClicked
}: {
  playerId: string;
  limit?: number;
  onAddFriendClicked: (data: FriendRequestActionData) => void;
}): JSX.Element {
  const { connState, trackQuery } = useContext(WsQueryTrackerContext);

  const [searchText, setSearchText] = useState<string>('');

  let limitClause = {};
  if (limit) {
    limitClause = { limit };
  }

  const findFriendsQ = trpc.findFriends.useQuery({
    ...limitClause,
    requesterId: playerId,
    searchText
  });

  useEffect(() => {
    if (connState === 'CONNECTED') {
      trackQuery({ findFriends: true });
    }
  }, [connState, trackQuery, playerId]);

  // Transform trpc data into friend card data
  let data: FriendCardData[] = [];
  if (searchText !== '' && findFriendsQ.isSuccess) {
    data = findFriendsQ.data.map(({ id }) => {
      return {
        playerId: id,
        buttons: [
          {
            icon: <BsPersonPlus color={'#0f0'} />,
            text: 'Send Request',
            onClick: () => {
              onAddFriendClicked({
                requesterId: playerId,
                addresseeId: id
              });
            }
          }
        ],
        buttonsAsPopover: true
      };
    });
  }

  return (
    // <Flex direction={'column'} gap={'0.5rem'}>
    <Grid
      templateColumns={'1fr'}
      width={'100%'}
      justifyItems={'start'}
      alignItems={'center'}
      rowGap={'0.5rem'}
    >
      <Input
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        placeholder={'Enter a username or email address'}
        _placeholder={{ color: 'whiteAlpha.400' }}
        colorScheme={'blackAlpha'}
        borderColor={'blackAlpha.600'}
        focusBorderColor={'blackAlpha.600'}
        _hover={{ borderColor: 'blackAlpha.600' }}
      />
      <FriendCard
        dataIsGood={findFriendsQ.isSuccess}
        data={data}
        emptyText={''}
      />
    </Grid>
    // </Flex>
  );
}
