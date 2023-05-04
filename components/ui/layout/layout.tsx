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

export default function Layout({
  title,
  children
}: {
  title: string;
  children: JSX.Element;
}): JSX.Element {
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
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <Grid id='header-area' gridArea={'header'} justifyItems={'stretch'}>
          <LayoutHeader />
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
