import styles from '@/styles/Home.module.css';
import Head from 'next/head';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <Head>
        <title>Dart Games with Friends</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={styles.main}>
        <div className={styles.image_wrapper}>
          <Image
            className={styles.logo}
            src='/dartfriends.png'
            alt='13'
            fill
            priority
          />
        </div>
        <div className={styles.text_wrapper}>
          <h1 className={styles.title}>Dart Games with Friends</h1>
          <p className={styles.description}>Coming Soon</p>
        </div>
      </main>
    </>
  );
}