#Uso de los comandos experimentales

Los comandos experimentales son un módulo del bot que permite crear y probar comandos sin la necesidad de reiniciar el bot, y de manera remota.

##Creación de un comando experimental

Existen dos formaas principales de crear un comando experimental

La primera opción es enviar en el chat del bot lo siguiente:

```
Adjuntar un archivo y agregar el siguiente mensaje:

;experimental (nombre para el archivo) //No se agrega la extensión del archivo (.js)
```

La segunda opción es enviar el siguiente mensaje:

```
;experimental create (nombre del comando) \```<codigo>\```
```

Si no se proporciona el argumento del código se crea un archivo predefinido para el comando

##Prueba de un comando experimental

Si se quiere comprar si el comando experimental podrá ser ejecutado se envia el sigueinte comando
```
;experimental compile (nombre del archivo) //No agregar la extensión del archivo (.js)
```

Si se quiere realizar una prueba del comando se envia lo siguiente
```
;test (comando) (argumentos)
```

##Ver la lista de los comandos experimentales 

Para ver la lista de comandos experimentales (archivos) se envia el siguiente comando:
```
;experimental list
```

##Eliminar comandos experimentales

La eliminación de los comandos experimentales se realiza mediante el comando
```
;experimental delete (nombre del archivo) //No agregar la extensión del archivo (.js)
```

##Obtener un archivo de un comando

Para obtener el archivo (.js) de un comando experimental se utiliza el siguiente comando:
```
;experimental fetch (nombre del archivo) //No agregar la extensión del archivo (.js)
```
