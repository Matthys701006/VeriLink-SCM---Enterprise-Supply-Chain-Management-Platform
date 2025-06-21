import React from 'react';
// Temporary diagnostic component

function App() {
  console.log('App component is rendering');

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-4">VeriLink SCM</h1>
        <p className="text-gray-600 text-center mb-6">Enterprise Supply Chain Management Platform</p>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800">Diagnostic Mode Active</p>
          <p className="text-sm mt-2">If you can see this message, the application is rendering correctly.</p>
        </div>
      </div>
    </div>
  );
}

export default App;