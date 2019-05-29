/* eslint-disable */
const tf = require('@tensorflow/tfjs');
const model = tf.sequential(); // setup model

const hidden = tf.layers.dense({
  inputShape:[3],
  activation :'sigmoid',
  units: 4
});  // define the hidden layer

const output = tf.layers.dense({
  units: 2,
  activation :'sigmoid'
}); // define output

// SETUP STRUCTURE
model.add(hidden);
model.add(output);

const optimize=tf.train.sgd(0.1);  // rate of learning, less is better for performance


const config={
  optimizer:optimize,
  loss:'meanSquaredError'
  }
  model.compile(config);

console.log('success');

//
//
//  NOTE ---
//  We will be using a represenation of data being that 1 = 4hour window
//  example, 4 = 12:00pm - 4:00pm,  5: = 4:00pm - 8:00pm
//
//

// Training data
const train_1 = tf.tensor([
  [3,3,4],
  [3,4,5],
  [3,3,3],
  [2,3,6]
])

// Training data
const train_2 = tf.tensor([
  [3,2],
  [1,3],
  [4,6],
  [5,5]
])

// Input data for consideration
const main = tf.tensor([
  [3,3,4]
])

train_data().then(function(){
  console.log('Predictions :');
  model.predict(main).print();
})

async function train_data(){
  for(let i=0;i<10;i++){
  const res = await model.fit(train_1,train_2);
   console.log(res.history.loss[0]);
  }
}