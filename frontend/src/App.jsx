import ProductTable from './components/ProductTable'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>Gestão de Produtos</h1>
      </header>
      <main>
        <ProductTable />
      </main>
    </div>
  )
}

export default App
