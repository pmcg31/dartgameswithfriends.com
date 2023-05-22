import { Button, Flex, Grid, Input, Text } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import Layout from '../components/ui/layout/layout';
import { useWebsocket } from '../lib/websocket/use-websocket';

export default function WebsockIt() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [wsData, setWsData] = useState<string>('');
  const { connState, sendData } = useWebsocket({
    socketUrl:
      process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:3000/ws',
    onData: (data) => {
      setWsData(JSON.stringify(data, null, 2));
    }
  });

  function sendCurrentInput() {
    if (
      inputRef.current &&
      inputRef.current.value !== '' &&
      connState === 'CONNECTED'
    ) {
      sendData({ data: inputRef.current.value });
    }
  }

  return (
    <Layout title={'websock-it'}>
      <Flex direction={'column'} gap={'2rem'}>
        <Flex direction={'column'} gap={'0.5rem'}>
          <Input
            ref={inputRef}
            placeholder={'Enter text to send to socket'}
            _placeholder={{ color: 'whiteAlpha.400' }}
            colorScheme={'blackAlpha'}
            borderColor={'blackAlpha.600'}
            focusBorderColor={'blackAlpha.600'}
            _hover={{ borderColor: 'blackAlpha.600' }}
          />
          <Button
            onClick={sendCurrentInput}
            isDisabled={connState !== 'CONNECTED'}
          >
            Send
          </Button>
        </Flex>
        <Grid templateColumns={'auto 1fr'}>
          <Text gridColumn={1}>socket returned:</Text>
          <Text gridColumn={2}>{wsData}</Text>
        </Grid>
      </Flex>
    </Layout>
  );
}
