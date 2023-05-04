import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import GoogleProvider from 'next-auth/providers/google';
import TwitterProvider from 'next-auth/providers/twitter';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_ID,
      clientSecret: process.env.TWITTER_SECRET,
      version: '2.0'
    })
  ],
  theme: {
    colorScheme: 'dark',
    brandColor: '#3d4738',
    logo: '/dartfriends.png'
  },
  events: {
    async signIn(message) {
      /* on successful sign in */
      console.log('Auth.signIn', message);
    },
    async signOut(message) {
      /* on signout */
      console.log('Auth.signOut', message);
    },
    async createUser(message) {
      /* user created */
      console.log('Auth.createUser', message);
    },
    async updateUser(message) {
      /* user updated - e.g. their email was verified */
      console.log('Auth.updateUser', message);
    },
    async linkAccount(message) {
      /* account (e.g. Twitter) linked to a user */
      console.log('Auth.linkAccount', message);
    },
    async session(message) {
      /* session is active */
      console.log('Auth.session', message);
    }
  }
});
