import type { AppProps, AppType } from 'next/app';
import '@/styles/globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { tabsAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { trpc } from '../utils/trpc';

const App: AppType = ({ Component, pageProps }: AppProps) => {
  const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(tabsAnatomy.keys);
  const baseStyle = definePartsStyle({
    tab: {
      fontWeight: 'semibold'
    }
  });
  const tabsTheme = defineMultiStyleConfig({ baseStyle });

  const extendedTheme = extendTheme({
    components: {
      Button: {
        defaultProps: { colorScheme: 'blackAlpha' }
      },
      Tabs: {
        defaultProps: { colorScheme: 'blackAlpha' },
        ...tabsTheme
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
