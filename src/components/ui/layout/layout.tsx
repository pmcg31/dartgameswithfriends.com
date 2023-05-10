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

  // Synchronize the player for the signed in user
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // Create an abort controller to
      // cancel fetch on unmount/rerender
      const controller = new AbortController();
      const signal = controller.signal;

      // Attempt to get the player for the
      // signed in user
      fetch(`/api/player/${user.id}`, { signal })
        .then((res) => {
          // Fetch successful, player found?
          if (res.status === 404) {
            // No, create
            const body = JSON.stringify({ handle: user.username });
            fetch(`/api/player/${user.id}`, {
              signal,
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body
            })
              .then((res) => {
                // Create failed
                if (!res.ok) {
                  res.json().then((data) => {
                    console.log(
                      `POST /api/player/${
                        user.id
                      } body: ${body} failed: ${JSON.stringify(data)}`
                    );
                  });
                }
              })
              .catch((err) => {
                if (err.name !== 'AbortError') {
                  // Create failed
                  console.log(
                    `POST /api/player/${
                      user.id
                    } body: ${body} failed: ${JSON.stringify(err)}`
                  );
                }
              });
          } else if (res.status === 200) {
            // Yes, has the username (handle) changed?
            res.json().then((data) => {
              if (user.username !== data.handle) {
                // Yes, update
                const body = JSON.stringify({ handle: user.username });
                fetch(`/api/player/${user.id}`, {
                  signal,
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body
                })
                  .then((res) => {
                    if (!res.ok) {
                      // Update failed
                      res.json().then((data) => {
                        console.log(
                          `PATCH /api/player/${
                            user.id
                          } body: ${body} failed: ${JSON.stringify(data)}`
                        );
                      });
                    }
                  })
                  .catch((err) => {
                    if (err.name !== 'AbortError') {
                      // Update failed
                      console.log(
                        `PATCH /api/player/${
                          user.id
                        } body: ${body} failed: ${JSON.stringify(err)}`
                      );
                    }
                  });
              }
            });
          }
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            // Initial GET failed
            console.log(`GET /api/player/${user.id} failed: ${err}`);
          }
        });

      return () => {
        // Cancel the request before component unmounts
        controller.abort();
      };
    }
  }, [isLoaded, isSignedIn, user]);

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
