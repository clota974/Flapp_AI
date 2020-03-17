const tf = require("@tensorflow/tfjs-node")
const nr_epochs=500; 

function convert(c){
  return (c*1.8)+32 // Convert celsius to fahrenheit
} 


var celsius = []
var fahrenheit = []

for (let i = 0; i < 100; i++) {
  var r = 100; // Keeping this only value to ensure that Tf knows the answer
  celsius.push(i) // Shape [20,1]
  fahrenheit.push(convert(i)) // Push the answer (212) to the fahrenheit array
}

let train = async (xy, ys) => {
  const model = tf.sequential();

  model.add(tf.layers.dense({units: 1, inputShape: [1]}));

  model.compile({loss: 'meanSquaredError', optimizer: 'adam'});
  await model.fit(xs,ys,{epochs: nr_epochs})
  return model;
}

let predict =  (model, n) => {
  const predicted =  model.predict(tf.tensor2d([n],[1,1])); 
  return predicted;
}

const xs = tf.tensor2d(celsius.slice (0,15), [15,1]);
const ys = tf.tensor2d(fahrenheit.slice (0,15), [15,1]);
(async () => {
  let trained = await train (xs,ys);
  for (let n of [100]) {
    let predicted = predict (trained, n).dataSync ();
    console.log (`Value: ${n} Predicted: ${predicted [0]}`)
  }
})()
