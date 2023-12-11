// Articles.jsx

import React, { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';

const Articles = () => {
  const [prediction, setPrediction] = useState(null);

  const loadModel = async () => {
    try {
    const model = await tf.loadLayersModel("/models/Ascend/Javascript_recommender/model.json");

      const inputTensor = tf.tensor3d([[[10.02, 117.04, 3.66, 3.26, 2019, 1, 0, 0]]]);

      const result = model.predict(inputTensor);
      const predictionData = result.arraySync();
      setPrediction(predictionData);
    } catch (error) {
      console.error('Error loading or predicting with the model:', error);
    }
  };

  useEffect(() => {
    loadModel();
  }, []);

  return (
    <div>
      <h2>Articles Page</h2>
      <p>Content of your Articles page goes here.</p>

      {/* Render prediction directly within the Articles component */}
      {prediction && (
        <div>
          <h3>Predicted Data:</h3>
          <pre>{JSON.stringify(prediction, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Articles;
