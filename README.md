# discordBotProject

Bot de discord

## Ejecución

Utilizar npm 
```
npm start
```

## Añadir comandos

Los comandos son cargados a un objeto dentro en lib/CommandHandler.js llamado commands

Para añadir un comando
- Se añade una propiedad al objeto con el nombre del comando
- A la propiedad se le da el valor de ```require(<ruta del comando>)```
- Ejemplo:
  ```
  spam: require("./commands/spam"),
  ```

## Estructura de un comando

Si un módulo exporta los comandos de la siguiente manera
```
module.exports.<command name> = function(message, <args / ...args>) { <code> }
```

Agregar información de un comando al comando help
Esta tarea se realiza automáticamente, dentro del comando debe de tener:

El comando help se actualiza automáticamente, solo asegurate de que tu módulo exporte las siguientes porpiedades

```
module.exports.<command name>.description = "<description>"
module.exports.<command name>.args = "<arguments>"
```

## Como son llamados los comandos

Los comandos son llamados a partir del nombre de la función que exportan, aseguráte que el nombre de la función está completamente en minúsculas, porque el commandhandler convierte el mensaje del usuario en minúsculas

### Argumentos cuando se llama un comando

Cada comando es llamado con una estrucutra similar, la cual es la siguiente

```
commands[name](message, bot, ...args)
```

Para asegurar no tener errrores al crear nuevos comandos procura que tus primeros dos argumentos sean message y bot
Ejemplo:
```
module.exports.example = function(message, bot, arg1, arg2) { <code> }
```

### Carga de funciones de /utils

Para cargar las funciones de utils, existe un módulo que realiza toda la tarea automáticamente y funciona de manera similar a la carga de los comandos
ejemplo
```
const utils = require(./../utils.js)

let hello = "Hi!"

module.exports.sayhello = function(message, bot) {
  utils.message.default(message, undefined, hello);
}
```

La estructura que siguen las funciones de utils al utilizarse es la siguiente

```
utils.folderName.fileName()
```

### Creación de funciones en utils

Por ahora cada módulo de utils solo puede exportar un comando

Para crear un comando se hace lo siguiente
```
<requires>

module.exports = function(<args>) {
  <code>
}
```
