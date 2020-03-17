from __future__ import absolute_import, division, print_function, unicode_literals
import tensorflow as tf
tf.logging.set_verbosity(tf.logging.ERROR)

import numpy as np

celsius_q    = np.array([2, 3,  4,  5, 6, 7,  8, 9, 10],  dtype=float)
fahrenheit_a = np.array([4, 6, 8, 10, 12, 14, 16, 18, 20],  dtype=float)

for i,c in enumerate(celsius_q):
  print("{} degrees Celsius = {} degrees Fahrenheit".format(c, fahrenheit_a[i]))

l0 = tf.keras.layers.Dense(units=1, input_shape=[1])  
model = tf.keras.Sequential([l0])
model.compile(loss='mean_squared_error', optimizer=tf.keras.optimizers.Adam(0.1))
model.summary();

history = model.fit(celsius_q, fahrenheit_a, epochs=500, verbose=False)
print("Finished training the model")

print(model.predict([100.0]))
print("These are the layer variables: {}".format(l0.get_weights()))