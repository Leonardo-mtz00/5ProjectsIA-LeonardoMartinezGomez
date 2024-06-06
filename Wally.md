# *Reconocimiento del personaje Wally*

# Wally, conocido como Waldo en los Estados Unidos y Canadá, es un personaje de una serie de libros de rompecabezas creada por el ilustrador británico Martin Handford. La serie se titula "¿Dónde está Wally?" ("Where's Wally?" o "Where's Waldo?" en inglés) y se centra en buscar a Wally, un personaje distintivo con un gorro y suéter a rayas rojas y blancas, lentes y pantalones azules, en escenas muy detalladas y abarrotadas de personas y objetos.

# En este proyecto se hace con la finalidad que en las imagenes de wally pueda reconocer en donde esta ubicado dicho personaje, es por ello que ocuparemos 2 programas

# Jupyter y Cascade-Trainer-GUI

# Para entrenar el modelo CNN en Cascade-Trainer-GUI se deben de tener imagenes de tamaño definido, en mi caso se utilizo 28x28 y 2 carpetas con imagenes: Positivas y Negativas

# Las imagenes negativas son zonas/personajes que no tienen nada que ver con el modelo que buscamos, esto lo hacemos para evitar falsos postivos.

# Las imagenes positivas son imagenes que tienen facciones similares a las que estamos buscando, en este caso a buscar a wally.

![Cascade GUI](./Images/wally1.png)

# En cascade, cargamos la carpeta en donde estan las 2 carpetas de imagenes, asi como el % de cantidad de positivas que pueden estar disponibles y cuantas son negativas.

![Cascade GUI](./Images/wally2.png)

# Una vez terminaod el entrenamiento, nos degenera un .xml de entrenamiento, este sera nuestro modelo de entrenamiento.

![Cascade GUI](./Images/wally3.png)

Esto es una prueba 


