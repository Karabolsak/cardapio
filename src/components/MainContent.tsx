import "../App.css";
import "./maincontent.css";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient"
import comida from "../../public/hamburgue.png"


const produtos = [
  {
    id: 1,
    nome: "Pizza Calabresa",
    descricao: "aaa",
    preco: 29.99,
    imagem: "https://via.placeholder.com/150",
    classe: "Sobremessa",
  },
  {
    id: 2,
    nome: "Pizza Margherita",
    preco: 32.00,
    imagem: "https://via.placeholder.com/150",
    classe: "Sobremessa",
  },
  {
    id: 3,
    nome: "Pizza Portuguesa",
    preco: 34.50,
    imagem: "https://via.placeholder.com/150",
    classe: "Sobremessa",
  },
  {
    id: 4,
    nome: "Pizza Calabresa",
    preco: 29.99,
    imagem: "https://via.placeholder.com/150",
    classe: "Sobremessa",
  },
  {
    id: 5,
    nome: "Pizza Margherita",
    preco: 32.00,
    imagem: "https://via.placeholder.com/150",
    classe: "Sobremessa",
  },
  {
    id: 6,
    nome: "Pizza Portuguesa",
    preco: 34.50,
    imagem: "https://via.placeholder.com/150",
    classe: "Sobremessa",
  },{
    id: 7,
    nome: "Pizza Calabresa",
    preco: 29.99,
    imagem: "https://via.placeholder.com/150",
    classe: "Sobremessa",
  },
  {
    id: 8,
    nome: "Pizza Margherita",
    preco: 32.00,
    imagem: "https://via.placeholder.com/150",
    classe: "Sobremessa",
  },
  {
    id: 9,
    nome: "Pizza Portuguesa",
    preco: 34.50,
    imagem: "https://via.placeholder.com/150",
    classe: "Sobremessa",
  },
]


export default function MainContent({ selected }: { selected: string }) {
  
  const [clientes, setClientes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
    useEffect(() => {
  const fetchClientes = async () => {
    const { data, error } = await supabase.from('clientes').select('*')
    if (error) {
      console.error("Erro ao buscar clientes:", error)
    } else {
      setClientes(data || [])
    }
    setLoading(false)
  }

  if (selected === "Clientes") {
    fetchClientes()
  }
}, [selected])

  const renderProdutos = () => (
    <div className="catalogo-grid">
                {produtos.map(produto => (
                  <div key={produto.id} className="item-card">
                    <img src={comida} alt={produto.nome} className="item-img" />
                    <h3>{produto.nome}</h3>
                    <p>{produto.descricao}</p>
                    <p>R$ {produto.preco.toFixed(2)}</p>
                  </div>
                ))}
              </div>
  )
  const renderClientes = () => (
    <div>
      <h1>Relatório de Clientes</h1>
      {loading ? (
        <p>Carregando clientes...</p>
      ) : (
      <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden">
        <thead>
          <tr>
            <th className="p-4">Nome</th>
              <th className="p-4">CPF</th>
              <th className="p-4">Nascimento</th>
              <th className="p-4">Telefone</th>
              <th className="p-4">Criado</th>
              <th className="p-4">Loja</th>
              <th className="p-4">Gasto total</th>
            </tr>
        </thead>
         <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id} className="tabela">
                <td className="p-4">{cliente.nome}</td>
                <td className="p-4">{cliente.cpf}</td>
                <td className="p-4">{cliente.nascimento}</td>
                <td className="p-4">{cliente.telefone}</td>
                <td className="p-4">{new Date(cliente.created_at).toLocaleString('pt-BR')}</td>
                <td className="p-4">{cliente.id_loja}</td>
                <td className="p-4">{cliente.gasto_total}</td>
              </tr>
            ))}
           </tbody>
      </table>
      )}
    </div>
  )


  const renderContent = () => {
    switch (selected) {
      case "Dashboard":
        return <p>📊 Bem-vindo ao dashboard!</p>
      case "Produtos":
        return renderProdutos()
      case "Clientes":
          return renderClientes()
      case "Catálogo":
        return <p>a</p>
      case "Mesas":
        return <p>🧑‍🤝‍🧑 Gerenciamento de clientes.</p>
        case "Abertura de comandas":
          return <p>a</p>
      default:
        return <p>Selecione uma opção.</p>
    }
  }

  return (
    <div className="flex-1 p-8 text-white">
      <h2 className="text-3xl font-bold mb-6">{selected}</h2>
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        {renderContent()}
      </div>
    </div>
  )
}
