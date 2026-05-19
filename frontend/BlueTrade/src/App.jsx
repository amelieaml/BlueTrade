import AppRouter from './routes/AppRouter';

function App() {
<<<<<<< HEAD
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
              <li key={item.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <strong className="text-lg text-gray-800">{item.name}</strong> 
                <span className="text-green-600 font-bold ml-2">- ${item.price}</span>
               <p className="text-gray-600 mt-2">{item.description}</p>
              </li>
            ))}
            </p>
        </div>
      </section>

      
    </>
  )
=======
  return <AppRouter />;
>>>>>>> 23dd07f8f83b66dcbfae30656804cf913a232ffe
}

export default App;