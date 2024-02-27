# Socket response

This files contains all responses sent by the websocket server.

## auth-callback

Sent to client after authentication from `auth` endpoint.

| index | type    | description                      |
| :---: | :------ | :------------------------------- |
|   0   | boolean | True if success, false otherwise |

## pixel-update

Sent to everyone when a pixel changes from `place-pixel` endpoint.

| index | type   | description       |
| :---: | :----- | :---------------- |
|   0   | number | The x position    |
|   1   | number | The y position    |
|   2   | number | The palette index |

## message

Sent to everyone when a message is received from `message` endpoint.

| index | type   | description             |
| :---: | :----- | :---------------------- |
|   0   | string | The email of the sender |
|   1   | string | The message             |