import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { ChakraProvider } from '@chakra-ui/react';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </ClerkProvider>
  );
}
