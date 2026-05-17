import AppRouter from './routes/AppRouter';

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
      <section id="center" className="min-h-screen bg-gray-100 p-8 flex justify-center">
        
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">
          <h1 className="text-4xl font-extrabold text-blue-600 mb-6 border-b pb-4">
            Lista de Items
          </h1>
          
          <ul className="space-y-4">
            {info.map((item) => (
              <li key={item.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <strong className="text-lg text-gray-800">{item.name}</strong> 
                <span className="text-green-600 font-bold ml-2">- ${item.price}</span>
                <p className="text-gray-600 mt-2">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>

      </section>
    </>
  )
}

export default App;
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
      <section id="center" className="min-h-screen bg-gray-100 p-8 flex justify-center">
        
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">
          <h1 className="text-4xl font-extrabold text-blue-600 mb-6 border-b pb-4">
            Lista de Items
          </h1>
          
          <ul className="space-y-4">
            {info.map((item) => (
              <li key={item.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <strong className="text-lg text-gray-800">{item.name}</strong> 
                <span className="text-green-600 font-bold ml-2">- ${item.price}</span>
                <p className="text-gray-600 mt-2">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>

      </section>
    </>
  )
}

export default App;

