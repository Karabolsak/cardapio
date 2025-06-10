import "../App.css";
import "./maincontent.css";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient"
import shopping from "../../src/assets/add-shopping-car.svg"




export default function MainContent({ selected }: { selected: string }) {
  type Produto = {
  id: number
  nome: string
  tamanho: string
  descricao: string
  price: number
  imgProduto: string  
}
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [clientes, setClientes] = useState<any[]>([])
  const [loadingClientes, setLoadingClientes] = useState(false)
  const [loadingProdutos, setLoadingProdutos] = useState(false)
  const [loja, setLoja] = useState<any[]> ([])

useEffect(() => {
  const fetchClientes = async () => {
    setLoadingClientes(true)
    const { data, error } = await supabase.from('clientes').select('*')
    if (error) {
      console.error("Erro ao buscar clientes:", error)
    } else {
      setClientes(data || [])
    }
    setLoadingClientes(false)
  }

  if (selected === "Clientes") {
    fetchClientes()
  }
}, [selected])
useEffect(() => {
  const fetchProdutos = async () => {
    setLoadingProdutos(true)
    const { data, error } = await supabase.from('produtos').select('*')
    if (error) {
      console.error("Erro ao buscar produtos", error)
    } else {
      setProdutos(data || [])
    }
    setLoadingProdutos(false)
  }

  if (selected === "Produtos") {
    fetchProdutos()
  }
}, [selected])
useEffect(() => {
    const fetchLoja = async () => {
      const { data, error } = await supabase.from('loja').select('*')
      if (error) {
        console.error("Erro ao buscar loja", error)
      }else {
        setLoja(data || [])
      }
    }
    fetchLoja();
  }, []);


  const renderProdutos = () => (
    <div>
      <h1>Produtos</h1>
      {loadingProdutos ? (
        <p>Carregando produtos...</p>
      ) : (
      <div className="catalogo-grid"><h1></h1>
              {produtos.map((produto) => (
                <div key={produto.id} className="item-card">
                <img src={produto.imgProduto} className="item-img" />
                <h3>{produto.nome}</h3>
                <h5>Tamanho do prato: {produto.tamanho}</h5>
                <h4>Descrição</h4>
                <p>{produto.descricao}</p>
                <div className="preco">
                  <p>R$ {produto.price?.toFixed(2)}</p>
                  <img src={shopping} alt="Adicionar ao carrinho" />
                </div>
              </div>
            ))}
      </div>)}
    </div>
  )
  const renderClientes = () => (
    <div>
      <h1>Relatório de Clientes</h1>
      {loadingClientes ? (
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
                <td className="p-4">{new Date(cliente.criado_em).toLocaleString('pt-BR')}</td>
                <td className="p-4">{loja[0]?.nome}</td>
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
