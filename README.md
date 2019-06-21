# discordBotProject

Bot de discord

## Ejecución

Utilizar npm 
-- npm start

## Añadir comandos

Los comandos son cargados a un objeto dentro en lib/CommandHandler.js llamado commands

Para añadir un comando
- Se añade una propiedad al objeto con el nombre del comando
- A la propiedad se le da el valor de require(<ruta del comando>);

## Estructura de un comando

El módulo exporta un comando mediante
module.exports = function(message, args) { <code> }

Si un módulo tiene varios comandos se utiliza
module.exports.<command name> = function(message, <args / ...args>) { <code> }

Agregar información de un comando al comando help
Esta tarea se realiza automáticamente, dentro del comando debe de tener:

Si el módulo del comando solo contiene un comando

module.exports.description = "<description>"
module.exports.args = "<arguments>"

Si el módulo del comando tiene varios comandos

module.exports.<command name>.description = "<description>"
module.exports.<command name>.args = "<arguments>"

