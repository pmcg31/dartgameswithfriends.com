import type { AppProps, AppType } from 'next/app';
import '@/styles/globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { trpc } from '../utils/trpc';

const App: AppType = ({ Component, pageProps }: AppProps) => {
  const extendedTheme = extendTheme({
    components: {
      Button: {
        defaultProps: { colorScheme: 'blackAlpha' }
      }
    }
  });
  return (
    <ClerkProvider {...pageProps}>
      <ChakraProvider theme={extendedTheme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </ClerkProvider>
  );
};

export default trpc.withTRPC(App);
