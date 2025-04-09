// components/OneMoneyConsent.jsx
import { useState } from 'react';
import axios from 'axios';

export default function OneMoneyConsent({ userId }) {
  const [consentId, setConsentId] = useState('');
  const [consentStatus, setConsentStatus] = useState(null);
  const [financialData, setFinancialData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const requestConsent = async () => {
    setIsLoading(true);
    try {
      const purpose = {
        code: "101",
        refUri: "https://api.rebit.org.in/aa/purpose/101",
        text: "Wealth management service",
        category: "Personal Finance"
      };
      
      const consentDetail = {
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        dataFrom: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 months ago
        dataTo: new Date().toISOString()
      };
      
      const response = await axios.post('/api/onemoney/consent', {
        userId,
        purpose,
        consentDetail
      });
      
      setConsentId(response.data.ConsentHandle.id);
    } catch (error) {
      console.error("Error requesting consent:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const checkConsentStatus = async () => {
    if (!consentId) return;
    
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/onemoney/consent/${consentId}`);
      setConsentStatus(response.data.ConsentStatus);
    } catch (error) {
      console.error("Error checking consent status:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const requestAndFetchData = async () => {
    if (!consentId) return;
    
    setIsLoading(true);
    try {
      // First request data
      const requestResponse = await axios.post('/api/onemoney/request-data', { consentId });
      const sessionId = requestResponse.data.sessionId;
      
      // Then fetch data using the session ID
      const dataResponse = await axios.get(`/api/onemoney/fetch-data/${sessionId}`);
      setFinancialData(dataResponse.data);
    } catch (error) {
      console.error("Error requesting or fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">OneMoney Account Aggregator Consent</h2>
      
      <div className="mb-4">
        <button 
          onClick={requestConsent}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Request Consent
        </button>
      </div>
      
      {consentId && (
        <div className="mb-4">
          <p>Consent ID: {consentId}</p>
          <button 
            onClick={checkConsentStatus}
            disabled={isLoading}
            className="px-4 py-2 bg-green-500 text-white rounded mt-2"
          >
            Check Status
          </button>
        </div>
      )}
      
      {consentStatus && (
        <div className="mb-4">
          <p>Status: {consentStatus}</p>
          {consentStatus === "APPROVED" && (
            <button 
              onClick={requestAndFetchData}
              disabled={isLoading}
              className="px-4 py-2 bg-purple-500 text-white rounded mt-2"
            >
              Fetch Financial Data
            </button>
          )}
        </div>
      )}
      
      {financialData && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Financial Data</h3>
          <pre className="bg-gray-100 p-2 mt-2 rounded overflow-auto">
            {JSON.stringify(financialData, null, 2)}
          </pre>
        </div>
      )}
      
      {isLoading && <p className="text-gray-500">Loading...</p>}
    </div>
  );
}


// // pages/dashboard.js
// import OneMoneyConsent from '../components/OneMoneyConsent';

// export default function Dashboard() {
//   const userId = "user123"; // This would typically come from your authentication system
  
//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-6">Financial Dashboard</h1>
//       <OneMoneyConsent userId={userId} />
//     </div>
//   );
// }
