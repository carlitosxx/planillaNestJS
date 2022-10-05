<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# PLANILLA API
1. Clonar proyecto e instalar dependencias
 ```
 yarn install
 ```
2. Clonar el archivo ```.env.template``` y renombrarlo a ```.env```
3. Cambiar las variables de entorno
4. Levantar la base de datos
``` 
docker-compose up -d
```
5. ejecutar seed para rellenar los datos de pruebas
``` 
http://127.0.0.1:3000/api/v1/seed
```
6. ejectuar backend:

```
yarn start:dev
```