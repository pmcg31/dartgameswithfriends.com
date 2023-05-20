// This file sets up the main layout areas of the site
// in a grid as shown below. Each area is delegated to
// a component that manages it. The grid will stretch
// vertically (align) to fill the browser window if it
// is not tall enough. The grid will center in the
// browser window horizontally (justify) if it is not
// wide enough.
//
//  |          |                           |           |
//  ====================================================
//  |                 H E A D E R                      |
//  ====================================================
//  |          |                           |           |
//  |          |                           |           |
//  |          |     C O N T E N T         |           |
//  |          |                           |           |
//  |          |                           |           |
//  ====================================================
//  |                 F O O T E R                      |
//  ====================================================
//  |          |                           |           |

import { Grid } from '@chakra-ui/react';
import Head from 'next/head';
import LayoutFooter from './layout-footer';
import LayoutHeader from './layout-header';
import { useUser } from '@clerk/nextjs';
import { PropsWithChildren, useEffect } from 'react';
import { trpc } from '@/src/utils/trpc';

export default function Layout({
  title,
  hideSignIn,
  children
}: PropsWithChildren<{
  title: string;
  hideSignIn?: boolean;
}>): JSX.Element {
  // Use clerk user
  const { isLoaded, isSignedIn, user } = useUser();

  // Get player query
  const player = trpc.getPlayer.useQuery(
    { id: user?.id ?? '' },
    {
      enabled: isLoaded && isSignedIn
    }
  );

  // Create player mutation
  const createPlayerMutation = trpc.createPlayer.useMutation();

  // Update player mutation
  const updatePlayerMutation = trpc.updatePlayer.useMutation();

  // Get trpc utils
  const utils = trpc.useContext();

  // Synchronize the player for the signed-in user
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      if (player.isSuccess) {
        if (player.data === null) {
          // Player not found, create a new player
          createPlayerMutation.mutate(
            {
              id: user.id,
              handle: user.username || '',
              email: user.primaryEmailAddress
                ? user.primaryEmailAddress.emailAddress
                : '',
              profileImageUrl: user.profileImageUrl
            },
            {
              onError: (error) => {
                console.log(`Create player error: ${JSON.stringify(error)}`);
              },
              onSuccess: () => {
                utils.getPlayer.invalidate();
              }
            }
          );
        } else {
          // Player found, check if anything has changed
          const updates: {
            handle?: string;
            email?: string;
            profileImageUrl?: string;
          } = {};
          let hasUpdates = false;
          if (user.username && user.username !== player.data.handle) {
            updates.handle = user.username;
            hasUpdates = true;
          }
          if (
            user.primaryEmailAddress &&
            user.primaryEmailAddress.emailAddress !== player.data.email
          ) {
            updates.email = user.primaryEmailAddress.emailAddress;
            hasUpdates = true;
          }
          if (user.profileImageUrl !== player.data.profileImageUrl) {
            updates.profileImageUrl = user.profileImageUrl;
            hasUpdates = true;
          }

          if (hasUpdates) {
            console.log(`Updating with ${JSON.stringify(updates)}`);
            // Update player if anything changed
            updatePlayerMutation.mutate(
              { id: user.id, ...updates },
              {
                onError: (error) => {
                  console.log(`Update player error: ${JSON.stringify(error)}`);
                },
                onSuccess: () => {
                  utils.getPlayer.invalidate();
                }
              }
            );
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, user, player.isSuccess]);

  // Set up page title
  let pageTitle = 'Dart Games With Friends';
  if (title) {
    pageTitle = pageTitle + ' | ' + title;
  }

  return (
    <Grid minHeight={'100dvh'}>
      <Grid
        justifyContent={'stretch'}
        alignContent={'stretch'}
        justifyItems={'stretch'}
        alignItems={'stretch'}
        templateColumns={'auto auto auto'}
        templateRows={'auto 1fr auto'}
        templateAreas={`
        'header header header'
        'left content right'
        'footer footer footer'
      `}
        backgroundColor={'var(--brand-color)'}
      >
        <Head>
          <title>{pageTitle}</title>
          <meta
            name='description'
            content='The next big thing in online darts'
          />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <meta name='referrer' content='no-referrer' />
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <Grid id='header-area' gridArea={'header'} justifyItems={'stretch'}>
          <LayoutHeader hideSignIn={hideSignIn} />
        </Grid>

        <Grid
          id='content-area'
          gridArea={'content'}
          justifySelf={'center'}
          justifyItems={'stretch'}
        >
          {children}
        </Grid>

        <Grid id='footer-area' gridArea={'footer'}>
          <LayoutFooter />
        </Grid>
      </Grid>
    </Grid>
  );
}
