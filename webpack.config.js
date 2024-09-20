// Importa el módulo `path` de Node.js para trabajar con rutas de archivos y directorios
const path = require('path');

// Importa el plugin `html-webpack-plugin`, que facilita la creación de archivos HTML
// y la inclusión automática de los bundles generados por Webpack
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
    // Modo en que Webpack se ejecutará
    // Opciones:
    // - 'development': Código legible y con herramientas de depuración habilitadas.
    // - 'production': Código optimizado para el entorno de producción (minificación y eliminación de comentarios).
    // - 'none': Deshabilita cualquier comportamiento predeterminado, útil para configuraciones personalizadas.
    mode: 'development',

    // Define el punto de entrada de la aplicación, donde Webpack comenzará a construir el gráfico de dependencias
    entry: './src/index.js',

    // Especifica el nombre y la ubicación del archivo de salida generado por Webpack
    output: {
        // `path.resolve` convierte la ruta relativa 'dist' a una ruta absoluta
        path: path.resolve(__dirname, 'dist'),

        // Nombre del archivo de salida (bundle) que contendrá el código empaquetado
        filename: 'bundle.js',

        // Opción para definir cómo manejar el almacenamiento en caché de los archivos en producción.
        // Puedes usar `filename: '[name].[contenthash].js'` para caché busting en producción.
    },

    // Define cómo Webpack debe manejar diferentes tipos de archivos mediante loaders
    module: {
        // `rules` contiene las reglas para procesar archivos específicos
        rules: [
            {
                // Aplica esta regla a todos los archivos `.js`
                test: /\.js$/,

                // Excluye la carpeta `node_modules` para no procesar dependencias externas
                exclude: /node_modules/,

                // Usa `babel-loader` para transpilar archivos JavaScript modernos a una versión compatible con navegadores más antiguos
                use: 'babel-loader'
            },
            {
                // Aplica esta regla a todos los archivos `.css`
                test: /\.css$/,

                // Usa `style-loader` y `css-loader` para manejar archivos CSS
                // `css-loader` convierte CSS en JavaScript y `style-loader` lo inyecta en el DOM
                use: ['style-loader', 'css-loader']
            },
            {
                // Aplica esta regla a todos los archivos `.html`
                test: /\.html$/,

                // Usa `html-loader` para procesar archivos HTML y manejar las referencias a archivos estáticos (imágenes, etc.)
                use: ['html-loader']
            },
            {
                // Regla opcional para manejar imágenes y otros archivos estáticos
                // test: /\.(png|jpg|gif)$/i,
                // use: [
                //   {
                //     loader: 'file-loader',
                //     options: {
                //       name: '[path][name].[ext]',
                //     },
                //   },
                // ],
            }
        ]
    },

    // Configura los plugins que extienden la funcionalidad de Webpack
    plugins: [
        new HtmlWebPackPlugin({
            // Archivo HTML base (plantilla) desde el cual se generará el archivo HTML final
            template: './src/index.html',

            // Nombre del archivo HTML resultante que se colocará en la carpeta `dist`
            filename: 'index.html',

            // Opción para minificar el HTML en producción
            // minify: {
            //     removeComments: true,
            //     collapseWhitespace: true,
            // }
        })
    ],

    // Configura el servidor de desarrollo de Webpack
    devServer: {
        // Especifica la carpeta de archivos estáticos que se servirá
        static: path.join(__dirname, 'dist'),

        // Habilita la compresión gzip para mejorar el rendimiento
        compress: true,

        // Define el puerto en el que el servidor de desarrollo escuchará
        port: 9000,

        // Opciones adicionales:
        // open: true, // Abre el navegador automáticamente
        // hot: true, // Habilita la recarga en caliente
        // historyApiFallback: true, // Maneja rutas SPA
    },

    // Configura cómo Webpack debe resolver las extensiones de los archivos importados
    resolve: {
        // Especifica las extensiones de archivo que Webpack reconocerá automáticamente
        extensions: ['.js', '.jsx', '.ts', '.tsx'],

        // Opcional: Definir alias para rutas de importación más cortas
        // alias: {
        //     Components: path.resolve(__dirname, 'src/components/'),
        // },
    },

    // Configura las herramientas de depuración, como los sourcemaps
    // Opciónes:
    // - 'inline-source-map': Genera sourcemaps embebidos para mejor depuración
    // - 'source-map': Genera sourcemaps en archivos separados (más lento, pero útil en producción)
    // - 'eval': Rápido, pero genera sourcemaps menos precisos
    devtool: 'inline-source-map'
};
