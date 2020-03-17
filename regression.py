from __future__ import absolute_import, division, print_function, unicode_literals
import tensorflow as tf
import matplotlib.pyplot as plt
tf.logging.set_verbosity(tf.logging.ERROR)


import numpy as np
from random import *

def convert(a,b):
    return a*2 + b*4 


x_arr = []
y_arr = []
r_arr = []

for i in range(20):
    x = randint(1,1000)
    y = randint(1,1000)
    
    p = [x,y]

    x_arr.append(p)

    r = convert(x,y)
    r_arr.append(r)


inp    = np.array(x_arr,  dtype=float)
out = np.array(r_arr,  dtype=float)

for i,x in enumerate(inp):
  print("{} : {} ".format(x, out[i]))


l0 = tf.keras.layers.Dense(units=1, input_shape=[1] ) 

model = tf.keras.Sequential([
    l0,
    ])
model.compile(loss='mean_squared_error', optimizer=tf.keras.optimizers.Adam(0.1), metrics=["accuracy"])
model.summary();
history = model.fit(inp, out, epochs=500, verbose=False)
print("Finished training the model")

a = 50
b = 50
q = np.array([[a,b]])
prd = model.predict(q)
print(prd)
print("convert({}) = {}".format(q, convert(a,b)))
print("These are the layer variables: {}".format(l0.get_weights()))

epochs_range = range(500)
plt.figure(figsize=(8, 8))
plt.subplot(1, 2, 1)
plt.plot(epochs_range, history.history["acc"], label='Training Accuracy')
plt.plot(epochs_range, history.history["loss"], label='Loss')
plt.legend(loc='lower right')
plt.title('Training and Validation Accuracy')
plt.show()