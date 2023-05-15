import {
  Button,
  Flex,
  Grid,
  Heading,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text
} from '@chakra-ui/react';
import GenericCard from '../common/generic-card';
import Player from '../common/player';
import React from 'react';
import { IconContext } from 'react-icons';
import { BsThreeDots } from 'react-icons/bs';

export type FriendCardData = {
  playerId: string;
  addedText?: string;
  buttons: { icon: JSX.Element; text: string }[];
  buttonsAsPopover?: boolean;
};

export default function FriendCard({
  heading,
  dataIsGood,
  data,
  emptyText
}: {
  heading: string;
  dataIsGood: boolean;
  data: FriendCardData[];
  emptyText: string;
}): JSX.Element {
  return (
    <GenericCard header={<Heading size={'md'}>{heading}</Heading>}>
      <Grid
        templateColumns={'1fr auto'}
        width={'100%'}
        justifyItems={'start'}
        alignItems={'center'}
        rowGap={'0.5rem'}
      >
        {dataIsGood && data.length > 0 ? (
          data.map(
            ({ playerId, addedText, buttons, buttonsAsPopover }, idx) => {
              return (
                <React.Fragment key={playerId}>
                  <Flex
                    gridColumn={1}
                    backgroundColor={
                      idx % 2 !== 0 ? 'rgba(0,0,0,0.2)' : 'initial'
                    }
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
                              <Button colorScheme={'blackAlpha'} size='sm'>
                                <IconContext.Provider
                                  value={{ size: '0.8rem' }}
                                >
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
                                      colorScheme={'blackAlpha'}
                                      leftIcon={buttonData.icon}
                                      size={{ base: 'sm', sm: 'md' }}
                                      onClick={() => {
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
                            colorScheme={'blackAlpha'}
                            leftIcon={buttonData.icon}
                            size={{ base: 'sm', sm: 'md' }}
                          >
                            {buttonData.text}
                          </Button>
                        );
                      })}
                    </Stack>
                  )}
                </React.Fragment>
              );
            }
          )
        ) : (
          <Text opacity={'30%'} textAlign={'center'} width={'100%'}>
            {emptyText}
          </Text>
        )}
      </Grid>
    </GenericCard>
  );
}
