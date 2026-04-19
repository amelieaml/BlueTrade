import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import {getItems} from '../src/api/item.api.js'
import { useEffect } from 'react'

function App() {
  const [info, setInfo] = useState([]);

  useEffect(() => {
    async function loadItems() {
      const res = await getItems();
      
      setInfo(res.data);
      
      console.log("Primer item:", res.data[0].name); 
    }
    loadItems();
  }, []);
  return (
    <>
      <section id="center">
       
        <div>
          <h1>Lista de Items</h1>
          <p>
            {info.map((item) => (
              <li key={item.id}>
                <strong>{item.name}</strong> - ${item.price}
                <p>{item.description}</p>
              </li>
            ))}
            </p>
        </div>
      </section>

      
    </>
  )
}

export default App
