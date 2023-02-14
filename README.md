# Dart Games with Friends

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
