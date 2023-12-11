import React, { useEffect, useState } from 'react';

const Articles = () => {
  const [prediction, setPrediction] = useState(null);
  const [matchingRows, setMatchingRows] = useState([]);
  const [allRows, setAllRows] = useState([]); // State to store all rows
  const skillToMatch = 'Javascript'; // Replace with the actual skill you want to match

  const loadModel = async () => {
    try {
      // Mock prediction value as 4
      const mockPrediction = 4.02;
      setPrediction(mockPrediction);
  
      // Make a request to the backend API to get matching rows
      const response = await fetch(`http://localhost:3001/api/getRows/${mockPrediction}/${skillToMatch}`);
      const data = await response.json();
  
      console.log('Matching rows from API:', data);
      setMatchingRows(data);

      // Update allRows state to include the new rows
      setAllRows((prevRows) => [...prevRows, ...data]);
      console.log(allRows);
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
      {prediction !== null && (
        <div>
          <h3>Predicted Data:</h3>
          <pre>{JSON.stringify(prediction, null, 2)}</pre>
        </div>
      )}

      {/* Render matching rows */}
      {matchingRows.length > 0 && (
        <div>
          <h3>Matching Rows from Database:</h3>
          <ul>
            {/* Limit to the first 3 rows */}
            {matchingRows.slice(0, 3).map((row) => (
              <li key={row.id}>
                {/* Render your row data here */}
                <p>ID: {row.id}</p>
                <p>Title: {row.title}</p>
                <p>Url: {row.url}</p>
                {/* Add additional fields as needed */}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Render all rows */}

      {allRows.length > 0 && (
        <div>
          <h3>All Rows:</h3>
          <ul>
            {allRows.map((row) => (
              <li key={row.id}>
                {/* Render your row data here */}
                <p>ID: {row.id}</p>
                <p>Title: {row.title}</p>
                <p>Url: {row.url}</p>
                {/* Add additional fields as needed */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Articles;
