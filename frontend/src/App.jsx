import { useEffect, useState } from "react";

function App() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/expenses")
      .then(res => res.json())
      .then(data => setExpenses(data));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Data Pengeluaran</h1>

      {expenses.map((item) => (
        <div key={item.id}>
          <p>{item.nama} - Rp{item.jumlah}</p>
        </div>
      ))}
    </div>
  );
}

export default App;