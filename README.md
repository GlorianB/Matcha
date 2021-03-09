# Matcha

Tinder like app

**Matcha is a dating website allowing you to match with persons you might appreciate**

## Tech Stack

- Serveur: **NodeJS** - Framework **Express** - **SocketIO**
- Client: **ReactJS** - **Bootstrap** - **SASS**
- DB: **PostgreSQL**
- Architecture: Client-Server - **API RESTful**

## Dependencies

To start this website you need to have installed

`node` version 14.13.1

`npm` version 6.12.8

`postgresql` version 12.6

### Launch app

In server/setup/setup.js 
	=> Change host, database, username and password to your credentials line 50

server/.env => update this file with your credentials 

Before starting servers

```shell 
sh setup.sh
```

start your pgsql server

```shell 
psql -f server/core/database.sql
```

```shell
cd server/setup/
```

```shell
node setup.js 500
```
