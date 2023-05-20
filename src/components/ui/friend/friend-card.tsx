import {
  Button,
  Flex,
  Grid,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text
} from '@chakra-ui/react';
import Player from '../common/player';
import React from 'react';
import { IconContext } from 'react-icons';
import { BsThreeDots } from 'react-icons/bs';

export type FriendCardData = {
  playerId: string;
  addedText?: string;
  buttons: { icon: JSX.Element; text: string; onClick: () => void }[];
  buttonsAsPopover?: boolean;
};

export default function FriendCard({
  dataIsGood,
  data,
  emptyText
}: {
  dataIsGood: boolean;
  data: FriendCardData[];
  emptyText: string;
}): JSX.Element {
  return (
    <Grid
      templateColumns={'1fr auto'}
      width={'100%'}
      justifyItems={'start'}
      alignItems={'center'}
      rowGap={'0.5rem'}
    >
      {dataIsGood && data.length > 0 ? (
        data.map(({ playerId, addedText, buttons, buttonsAsPopover }, idx) => {
          return (
            <React.Fragment key={playerId}>
              <Flex
                gridColumn={1}
                backgroundColor={idx % 2 !== 0 ? 'rgba(0,0,0,0.2)' : 'initial'}
                height={'100%'}
                width={'100%'}
                paddingLeft={'0.5rem'}
                paddingBlock={'0.25rem'}
              >
                <Player playerId={playerId} addedText={addedText} />
              </Flex>
              {buttonsAsPopover ? (
                <Stack
                  gridColumn={2}
                  direction={'column'}
                  backgroundColor={
                    idx % 2 !== 0 ? 'rgba(0,0,0,0.2)' : 'initial'
                  }
                  height={'100%'}
                  align={'center'}
                  justify={'center'}
                  paddingRight={'0.5rem'}
                  paddingBlock={'0.25rem'}
                >
                  <Popover>
                    {({ onClose }) => (
                      <>
                        <PopoverTrigger>
                          <Button size='sm'>
                            <IconContext.Provider value={{ size: '0.8rem' }}>
                              <BsThreeDots color={'#888'} />
                            </IconContext.Provider>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          backgroundColor={'var(--brand-color)'}
                          border={'2px solid #888'}
                          width={'auto'}
                          p={'0.5rem'}
                        >
                          <Stack direction={'column'} height={'100%'}>
                            {buttons.map((buttonData) => {
                              return (
                                <Button
                                  key={buttonData.text}
                                  leftIcon={buttonData.icon}
                                  size={{ base: 'sm', sm: 'md' }}
                                  onClick={() => {
                                    buttonData.onClick();
                                    onClose();
                                  }}
                                >
                                  {buttonData.text}
                                </Button>
                              );
                            })}
                          </Stack>
                        </PopoverContent>
                      </>
                    )}
                  </Popover>
                </Stack>
              ) : (
                <Stack
                  gridColumn={2}
                  direction={['column', 'row']}
                  backgroundColor={
                    idx % 2 !== 0 ? 'rgba(0,0,0,0.2)' : 'initial'
                  }
                  height={'100%'}
                  align={'center'}
                  justify={'center'}
                  paddingRight={'0.5rem'}
                  paddingBlock={'0.25rem'}
                >
                  {buttons.map((buttonData) => {
                    return (
                      <Button
                        key={buttonData.text}
                        leftIcon={buttonData.icon}
                        size={{ base: 'sm', sm: 'md' }}
                        onClick={buttonData.onClick}
                      >
                        {buttonData.text}
                      </Button>
                    );
                  })}
                </Stack>
              )}
            </React.Fragment>
          );
        })
      ) : (
        <Text opacity={'30%'} textAlign={'center'} width={'100%'}>
          {emptyText}
        </Text>
      )}
    </Grid>
  );
}
