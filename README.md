# Cooperativista

Aplicativo para el manejo contable de Cooperadoras escolares.
La idea del proyecto es generar una estructura que sirva de base para aplicaciones similares. Inicialmente y por conveniencia se utilizó el caso de cooperadoras escolares donde la aplicación se utiliza para el alta y baja de alumnos y aportantes (asociados), proveedores y para el registro de ingresos y egresos de dinero.

# Orígenes
El proyecto está basado en el ejemplo del [Electron Ext JS Starter project template](https://github.com/mfearby/electron-extjs-starter), a su vez basado en la  [guía de Sencha](https://www.sencha.com/blog/creating-installable-desktop-applications-with-ext-js-and-electron/)

## Pre-requisitos
- Sencha Ext JS 6.2.0 [GPL v3 version](https://www.sencha.com/legal/GPL/) o la versión [trial](https://www.sencha.com/products/extjs/#overview)
- [Sencha Cmd](https://www.sencha.com/products/sencha-cmd/) 6.5.1+ build tool (requires Java)
- [Node.js](https://nodejs.org/) 6.11+

## Guía rápida

```
$ git clone https://github.com/Pax17/cooperativista.git
$ cd cooperativista
```

Cree el directorio ``client/ext`` y extraiga allí su copia de Ext JS framework (requisito nombrado anteriormente).

```
$ cd client
$ sencha app build development
$ cd ..
$ yarn install
$ yarn run plain
```
Después de clonar el repositorio, debe correr ``yarn run plain`` ya que el comando ``yarn start`` predeterminado carga la versión de producción de la aplicación Ext JS, la cual aún no se habrá compilado. Al compilar en modo desarrollo también se recrean los archivos de arranque.

## Compilando la app Ext JS

La versión de producción (minificada) de la aplicación se genera y se copia en la carpeta ``client_build``.

### Mac/Linux
```
$ chmod 755 buildext.sh
$ ./buildext.sh
$ yarn start
```

### Windows
```
$ ./buildext
$ yarn start
```

## Empaquetando la aplicación Electron con Ext JS

El script ``package`` ejecuta el comando para compilar y minimizar la aplicación de Ext JS y luego ejecuta el comando [Electron Builder](https://www.electron.build) para agrupar todo junto con Electron para su distribución (en la carpeta `` dist``).

### Mac/Linux
```
$ chmod 755 package.sh
$ ./package.sh
```

### Windows
```
$ ./package
```

## Author
Martín Panizzo
- [github.com](https://github.com/Martin17)
- [@martin_17](https://twitter.com/Martin_17)
