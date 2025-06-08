import "../App.css";
import "./maincontent.css";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient"

export default function MainContent({ selected }: { selected: string }) {
  
  const [clientes, setClientes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
    useEffect(() => {
    const fetchClientes = async () => {
      const { data, error } = await supabase
        .from('clientes')
        .select('*') // você pode customizar os campos aqui

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
              <tr key={cliente.id} className="border-t hover:bg-gray-50">
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
        return <p>📑 Aqui estão seus relatórios.</p>
      case "Clientes":
        return renderClientes()
      case "Mesas":
        return <p>🧑‍🤝‍🧑 Gerenciamento de clientes.</p>
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
