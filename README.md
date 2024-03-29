# Dart Games with Friends

## Setup After Cloning this Repo

Don't forget to enable husky:

```
yarn husky install
```

Don't forget to create `.env`. There is a sample in `env-sample`.

## MySQL Setup

Log in to MySQL as root. This will vary by platform. On linux:

```
sudo mysql
```

Once you're in:

```
mysql> create user 'pointy'@'localhost' identified by 'things';
Query OK, 0 rows affected (0.02 sec)

mysql> grant all privileges on *.* to 'pointy'@'localhost' with grant option;
Query OK, 0 rows affected (0.01 sec)

mysql> flush privileges;
Query OK, 0 rows affected (0.01 sec)
```

## Guide Used for Setting Up ESLint and Prettier

[This guide](https://paulintrognon.fr/blog/typescript-prettier-eslint-next-js) was followed to set up ESLint and Prettier. Some rules and options were changed from what the guide states; this is easy to see by looking at the relevant config files.
