# Socket requests

This files contains all supported socket requests by the server.

## auth

Authenticate the socket from an Auth Token and an email.

Result callback: `auth-callback`

| index | type   | description    |
| :---: | :----- | :------------- |
|   0   | string | The auth token |
|   1   | string | The email      |

## place-pixel

Place a pixel on the canvas

| index | type             | description                          |
| :---: | :--------------- | :----------------------------------- |
|   0   | number           | The x position                       |
|   1   | number           | The y position                       |
|   2   | number           | The palette index                    |
|   3   | callback(number) | Callback with the "expires at" timer |

## message

Send a message to all players

| index | type              | description  |
| :---: | :---------------- | :----------- |
|   0   | string            | The message  |
|   1   | callback(boolean) | The callback |

## get-classement

Get the classement of the players

> No parameters

## get-stats

Get the stats of the player

> No parameters
