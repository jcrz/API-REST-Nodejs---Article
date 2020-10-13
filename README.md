# NoseJS API-RESTful

## Realizada con fines de prueba para un Blog.

Para garantizar la compatibilidad de las dependencias puedes optar por Yarn, a traves de 

``` 
$ yarn install
```

Se inicia con

``` 
$ npm start
```

Necesita tener MongoDB instalado y funcionando.

## END POINTS 

```
// (GET) Ruta para petición de productos con un limite de 25
localhost:3900/api/articles/:last?

// (GET) Ruta para petición de un producto en particular
localhost:3900/api/article/:id

// (GET) Ruta para obtener una imagen por su nombre
localhost:3900/api/get-image/:image

// (GET) Ruta para obtener el resultado de una busqueda
localhost:3900/api/search/:search

// (POST) Ruta para registrar un articulo
localhost:3900/api/save

// (POST) Ruta para registrar una imagen
localhost:3900/api/upload-image/:id

// (PUT) Ruta para actualizar un articulo
localhost:3900/api/article/:id

// (DELETE) Ruta para eliminar un articulo
localhost:3900/api/article/:id
```
