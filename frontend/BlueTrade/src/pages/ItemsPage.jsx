import { useEffect, useState } from 'react';
import { getItems } from '../api/item.api.js';

function ItemsPage() {
  const [info, setInfo] = useState([]);

  useEffect(() => {
    async function loadItems() {
      try {
        const res = await getItems();
        setInfo(res.data);

        if (res.data.length > 0) {
          console.log("Primer item:", res.data[0].name);
        }
      } catch (error) {
        console.error("Error al cargar items:", error);
      }
    }

    loadItems();
  }, []);

  return (
    <section id="center">
      <div>
        <h1>Lista de Items</h1>

        <ul>
          {info.map((item) => (
            <li key={item.id}>
              <strong>{item.name}</strong> - ${item.price}
              <p>{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default ItemsPage;