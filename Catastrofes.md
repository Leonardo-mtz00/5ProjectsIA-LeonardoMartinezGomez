# *Reconocimeito de castrastrofes CNN*

Un CNN, o Red Neuronal Convolucional (Convolutional Neural Network en inglés), es un tipo de red neuronal profunda especialmente diseñada para procesar datos con una estructura en forma de rejilla, como las imágenes. En este caso se trata en modo a generar un DataSet de castrastrofes debemos de tomar varias cosas en cuenta.

La diversidad de las imagenes en diferentes panoramas para una sola catastrofe.
Calidad y tamaño de las imagenes.
Etiqueas de cada imagen.
Procesamiento de datos.

Se creo un data set con diferenciacion de 5 situaciones:

-*Asaltos*
-*Robo Casa habitacion*
-*Inundacion*
-*Tornados*
-*Incendio* 

# Como se entrena #

Primero se cargas las librerias necesarias:

*import numpy as np*
*import os*
*import re*
*import matplotlib.pyplot as plt*
*%matplotlib inline*
*from sklearn.model_selection import train_test_split*
*from sklearn.metrics import classification_report*

*import keras*
*import tensorflow as tf*
*from keras.utils import to_categorical*
*from keras.models import Sequential,Model*
*from keras.layers import Input*
*from keras.layers import Dense, Dropout, Flatten*
*#from keras.layers import Conv2D, MaxPooling2D*
*#from tensorflow.keras.models import Sequential*
*from keras.layers import (*
    *BatchNormalization, SeparableConv2D, MaxPooling2D, Activation, Flatten, Dropout, Dense, Conv2D*
*)*
*from keras.layers import LeakyReLU*

## Ahora se leen las imagenes ##

*dirname = os.path.join(os.getcwd(),'C:\\Users\\Leona\\Downloads\\ProyectoCNN\\ProyectoCNN\\categorias')*
*imgpath = dirname + os.sep* 

*images = []*
*directories = []*
*dircount = []*
*prevRoot=''*
*cant=0*

*print("leyendo imagenes de ",imgpath)*

*for root, dirnames, filenames in os.walk(imgpath):*
    *for filename in filenames:*
        *if re.search("\.(jpg|jpeg|png|bmp|tiff)$", filename):*
            *cant=cant+1*
            *filepath = os.path.join(root, filename)*
            *image = plt.imread(filepath)*
            *if(len(image.shape)==3):*
                *images.append(image)*
            *b = "Leyendo imagen..." + str(cant)*
            *print (b, end="\r")*
            *if prevRoot !=root:*
                *print(root, cant)*
                *prevRoot=root*
                *directories.append(root)*
                *dircount.append(cant)*
                *cant=0*
*dircount.append(cant)*

*dircount = dircount[1:]* 
*dircount[0]=dircount[0]+1*
*print('Directorios leidos:',len(directories))*
*print("Imagenes en cada directorio", dircount)*
*print('suma Total de imagenes en subdirs:',sum(dircount))*

## Ahora a los fotos leidas, se les crea etiquetas dependiendo de la carpeta que fueron leidas ##

*labels=[]*
*indice=0*
*for cantidad in dircount:*
    *for i in range(cantidad):*
        *labels.append(indice)*
    *indice=indice+1*
*print("Cantidad etiquetas creadas: ",len(labels))*


## Creación de DataSet ##

*train_X,test_X,train_Y,test_Y = train_test_split(X,y,test_size=0.2)*
*print('Training data shape : ', train_X.shape, train_Y.shape)*
*print('Testing data shape : ', test_X.shape, test_Y.shape)*

*plt.figure(figsize=[5,5])*

## One-hot Ending para la red ##

*train_Y_one_hot = to_categorical(train_Y)*
*test_Y_one_hot = to_categorical(test_Y)*

*print('Original label:', train_Y[0])*
*print('After conversion to one-hot:', train_Y_one_hot[0])*
*print(len(train_X))*
*print(len(train_Y_one_hot))*


## Creamos el DataSet de Entrenamiento ##

*train_X,valid_X,train_label,valid_label = train_test_split(train_X, train_Y_one_hot, test_size=0.2, random_state=13)*
*print(train_X.shape,valid_X.shape,train_label.shape,valid_label.shape)*

## Creamos el modelo CNN ##

-*INIT_LR = 1e-3 # Valor inicial de learning rate. El valor 1e-3 corresponde con 0.001*
-*epochs = 20 # Cantidad de iteraciones completas al conjunto de imagenes de entrenamiento*
-*batch_size = 64 # cantidad de imágenes que se toman a la vez en memoria*

*sport_model = Sequential()*
*sport_model.add(Conv2D(32, kernel_size=(3, 3),activation='linear',padding='same',input_shape=(28,28,3)))*
*sport_model.add(LeakyReLU(alpha=0.1))*
*sport_model.add(MaxPooling2D((2, 2),padding='same'))*
*sport_model.add(Dropout(0.5))*
*sport_model.add(Flatten())*
*sport_model.add(Dense(32, activation='linear'))*
*sport_model.add(LeakyReLU(alpha=0.1))*
*sport_model.add(Dropout(0.5))*
*sport_model.add(Dense(nClasses, activation='softmax'))*

## Empieza el entrenamiento ##

Este paso durara mucho por los recursos disponibles de cada computadora, por lo que hay que tener paciencia en este paso

*sport_train = sport_model.fit(train_X, train_label, batch_size=batch_size,epochs=epochs,verbose=1,validation_data=(valid_X, valid_label))*


Para crear 

![Ejemplo de Asalto](./Images/asalto1.png)
Este es un ejemplo de la identificación de la situación, la cual es un asalto

![Ejemplo de Inundación](./Images/inundacion1.png)
Este es un ejemplo de una inundación.

![Ejemplo de Inundación](./Images/robo1.png)
Este es un ejemplo de un asalto.

Hablando de temas generales, la clasificación de desastres puede ser muy beneficioso en varios aspectos relacionados con la gestión y respuesta a estos eventos (mencionando un ejemplo). Ya sea la deteccion temprana como monitoreo, evaluacion de daños, prevencion y mitigacion, investigacion , educacion (como este caso) y el uso de aplicaciones especificas.

Hay que tomar en cuenta que mientras mayor muestras tenga de comparacion y hay algo que las diferencia, sera mucho mejor.
