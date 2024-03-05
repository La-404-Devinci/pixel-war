# pixel-war

La Pixel war est l'évènement organisé par La 404 Devinci dans le cadre de la COVA.

Il s'agit d'une reproduction à échelle réduite et réservé au élèves du Pôle Léonard De Vinci de l'évènement éponyme organisé par Reddit.

## Technologies utilisées

<table>
  <thead>
    <tr>
      <th colspan="2">App</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Frontend</td>
      <td>ReactJs</td>
    </tr>
    <tr>
      <td>Backend</td>
      <td>ExpressJs</td>
    </tr>
    <tr>
      <td>Base de données</td>
      <td>Mysql</td>
    </tr>
    <tr>
      <td>Websocket API</td>
      <td>Socket.io</td>
    </tr>
  </tbody>
</table>


<table>
  <thead>
    <tr>
      <th colspan="2">Devops</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Setup</td>
      <td>Docker</td>
    </tr>
    <tr>
      <td>CI/CD</td>
      <td>Github Actions</td>
    </tr>
  </tbody>
</table>

## Installation

Cette section couvre la configuration à des fins de développement

### Frontend

Depuis la racine du projet :

```sh
cd ./frontend
npm i
npm run dev
```

### Backend

Depuis la racine du projet :

```sh
cd ./backend
npm i
```

Démarrez votre image MySql sur Docker :

```
docker compose up -d 
```

Exécutez les migrations de bases de données :

> **Info :** Ne pas oublier de créer un fichier .env, coller le contenu de .env.example et modifier les variables d'environnement liées à la base de données


```
npx prisma migrate dev
```

```
npm i --save-dev prisma@latest
npm i @prisma/client@latest
```

Exécuter l'application :

```
npm run dev
```
