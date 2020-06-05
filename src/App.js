import React, { useState, useEffect } from 'react';

import Header from './containers/Header'
import DefinitionForm from './containers/DefinitionForm'
import ListDefinitions from './containers/ListDefinitions'

import firebase from 'firebase';
import 'firebase/firestore'

var firebaseConfig = {
  apiKey: "AIzaSyBYNIKsskEsJYUNliwng3YfZrDtBP_pIjE",
  authDomain: "discute-ai.firebaseapp.com",
  databaseURL: "https://discute-ai.firebaseio.com",
  projectId: "discute-ai",
  storageBucket: "discute-ai.appspot.com",
  messagingSenderId: "358371345323",
  appId: "1:358371345323:web:e1ddb90a6a7007125888ee"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore()

function App() {

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const reloadData = async () => {
    setLoading(true)
    const snapshot = await db.collection("definitions").get()

    let payload = []

    snapshot.forEach(doc => {
        payload.push({
            id: doc.id,
            ...doc.data()
        })
    })
 
    setData(payload);
    setLoading(false)
  }

  useEffect(async () => {
    // Do it the first time
    reloadData()
  }, []);

  const [tab, setTab] = useState("list")

  const renderContent = () => {
    switch (tab) {
      case "list":
        return (
          <ListDefinitions data={data} reloadData={reloadData} />
        )
      case "create":
        return (
          <DefinitionForm data={data} />
        )
      default:
        return (
          <div>
            <span>Error!</span>
          </div>
        )
    }
  }

  return (
    <div>
      <Header tab={tab} setTab={setTab} />
      {loading ? (
        <span>Loading...</span>
      ) : (
        renderContent()
      )}
      
    </div>
  );
}

export { firebaseApp };
export default App;
