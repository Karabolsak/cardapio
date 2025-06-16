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
type Mesa = {
  id: number;
  numero: number;
  ativa: boolean;
  id_loja: number;
  id_comanda: number;
};
type Cliente = {
  id: number;
  nome: string;
  cpf: string;
  nascimento: string;
  telefone: string;
  criado_em: string;
  gasto_total: number;
};
type Loja = {
  id_loja: number;
  nome: string;
};
type ItemComanda = {
  id: number;
  id_produto: number;
  nome_produto: string;
  quantidade: number;
  preco_unitario: number;
  adicionado_em: string;
  id_colaborador: number;
  status: boolean;
};

  const [produtos, setProdutos] = useState<Produto[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [mesaSelecionada, setMesaSelecionada] = useState<Mesa | null>(null);
  const [itensComanda, setItensComanda] = useState<ItemComanda[]>([]);
  const [itemSelecionado, setItemSelecionado] = useState<Produto | null>(null);
  const [loja, setLoja] = useState<Loja[]> ([])
  const [loadingClientes, setLoadingClientes] = useState(false)
  const [loadingProdutos, setLoadingProdutos] = useState(false)
  const [todasMesas, setTodasMesas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [idComandaSelecionada, setIdComandaSelecionada] = useState<number | null>(null)
  const [mesasAtivas, setMesasAtivas] = useState<Mesa[]>([]);
  const [mesaParaAdicionar, setMesaParaAdicionar] = useState<Mesa | null>(null);
  const [quantidade, setQuantidade] = useState(1);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  
  const abrirMesa = async (mesa: Mesa) => {
    const { error: errorMesa } = await supabase
    .from("mesas")
    .update({ ativa: true })
    .eq("id", mesa.id)

    if (errorMesa) {
      console.error("Erro ao ativar mesa:", errorMesa);
    }
    
    const { data: novaComanda, error: errorComanda } = await supabase
    .from("comandas")
    .insert([
      {
        id_mesa: mesa.id,
        id_loja: mesa.id_loja,
        aberta_em: new Date().toISOString(),
        status: true,
      },
    ])
    .select()

    if (errorComanda) {
      console.error("Erro ao criar comanda:", errorComanda);
      return;
    }

    const atualizadas = todasMesas.map((m) => 
      m.id === mesa.id ? { ...m, ativa: true } : m 
    );
    setTodasMesas(atualizadas);
    setMesaSelecionada({ ...mesa, ativa: true });
    
    console.log("Comanda criada com sucesso:", novaComanda);
  };
  const encerrarComanda = async (mesa: Mesa) => {
  const { data: comandasAbertas, error: fetchError } = await supabase
    .from("comandas")
    .select("*")
    .eq("id_mesa", mesa.id)
    .eq("status", true);

  if (fetchError || !comandasAbertas || comandasAbertas.length === 0) {
    console.error("Nenhuma comanda aberta encontrada:", fetchError);
    return;
  }

  const comanda = comandasAbertas[0];

  const { error: updateComandaError } = await supabase
    .from("comandas")
    .update({ status: false, fechada_em: new Date().toISOString() })
    .eq("id", comanda.id);

  if (updateComandaError) {
    console.error("Erro ao fechar comanda:", updateComandaError);
    return;
  }

  
  const { error: updateItensError } = await supabase
    .from("itens_comanda")
    .update({ status: "encerrado", encerrado_em: new Date().toISOString() })
    .eq("id_comanda", comanda.id);

  if (updateItensError) {
    console.warn("Itens não foram encerrados corretamente:", updateItensError);
    
  }

  const { error: updateMesaError } = await supabase
    .from("mesas")
    .update({ ativa: false })
    .eq("id", mesa.id);

  if (updateMesaError) {
    console.error("Erro ao liberar mesa:", updateMesaError);
    return;
  }

  const mesasAtualizadas = todasMesas.map((m) =>
    m.id === mesa.id ? { ...m, ativa: false } : m
  );
  setTodasMesas(mesasAtualizadas);
  setMesaSelecionada({ ...mesa, ativa: false });

  console.log("Comanda e itens encerrados com sucesso!");
};
  const carregarItensDaComanda = async (mesa: Mesa) => {
  const { data: comandasAbertas, error: fetchError } = await supabase
    .from("comandas")
    .select("*")
    .eq("id_mesa", mesa.id)
    .eq("status", true);

  if (fetchError || !comandasAbertas || comandasAbertas.length === 0) {
    console.error("Nenhuma comanda aberta encontrada:", fetchError);
    setItensComanda([]);
    return;
  }

  const comanda = comandasAbertas[0];
  setIdComandaSelecionada(comanda.id);

  const { data: itens, error: itensError } = await supabase
  .from("itens_comanda")
  .select("id, id_produto, nome_produto, quantidade, preco_unitario, adicionado_em, id_colaborador, status")
  .eq("id_comanda", comanda.id);


  if (itensError) {
    console.error("Erro ao buscar itens da comanda:", itensError);
    return;
  }

  setItensComanda(itens || [0]);
};
  const adicionarItemNaComanda = async () => {
  if (!itemSelecionado || !mesaParaAdicionar) {
    alert("Selecione um produto e uma mesa para adicionar o item.");
    return;
  }

  const { data: comandaVinculada, error: errorComanda } = await supabase
    .from('comandas')
    .select('id')
    .eq('id_mesa', mesaParaAdicionar.id)
    .limit(1)
    .maybeSingle();

  if (errorComanda) {
    console.error('Erro ao buscar comanda:', errorComanda);
    alert('Erro ao buscar comanda vinculada à mesa.');
    return;
  }

  if (!comandaVinculada) {
    alert('Nenhuma comanda vinculada a essa mesa.');
    return;
  }

  const { error } = await supabase
    .from('itens_comanda')
    .insert([{
      id_comanda: comandaVinculada.id,
      id_produto: itemSelecionado.id,
      quantidade,
      preco_unitario: itemSelecionado.price,
      adicionado_em: new Date().toISOString(),
      status: 'pendente',
      nome_produto: itemSelecionado.nome,
    }]);

  if (error) {
    console.error('Erro ao adicionar item:', error);
    alert('Erro ao adicionar item, tente novamente');
  } else {
    setMensagemSucesso("Item adicionado com sucesso!");
    setItemSelecionado(null);
    setQuantidade(1);
  }
};






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
  const fetchLojaEMesas = async () => {
    const { data: lojas, error: erroLoja } = await supabase.from('loja').select('*');
    if (erroLoja) {
      console.error("Erro ao buscar loja", erroLoja);
      return;
    }
    setLoja(lojas || []);

    if (lojas && lojas[0]?.id_loja) {
      setLoading(true);
      const { data: mesas, error: erroMesas } = await supabase
        .from("mesas")
        .select("*")
        .eq("id_loja", lojas[0].id_loja);

      if (erroMesas) {
        console.error("Erro ao buscar mesas:", erroMesas);
      } else {
        setTodasMesas(mesas || []);
      }
      setLoading(false);
    }
  };

  fetchLojaEMesas();
}, []);
useEffect(() => {
  if (mesaSelecionada && mesaSelecionada.ativa) {
    carregarItensDaComanda(mesaSelecionada);
  }
}, [mesaSelecionada]);
useEffect(() => {
  if (itemSelecionado && itemSelecionado?.id) {
    setItemSelecionado(itemSelecionado);
  }
}, [itemSelecionado]);
useEffect(() => {
  const fetchMesasAtivas = async () => {
    const { data, error } = await supabase
      .from("mesas")
      .select("*")
      .eq("ativa", true);

    if (!error) setMesasAtivas(data);
  };
  fetchMesasAtivas();
}, []);






  const renderProdutos = () => (
  <div>
    <h1>Produtos</h1>
    {loadingProdutos ? (
      <p>Carregando produtos...</p>
    ) : (
      <div className="conteudo-produtos">
        <div className="catalogo-grid">
          {produtos.map((produto) => (
            <div key={produto.id} className="item-card" onClick={() => setItemSelecionado(produto)}>
              <img src={produto.imgProduto} className="item-img"  />
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
        </div>
        <div>
          {itemSelecionado && (
            <div className="dinamico-produto">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">{itemSelecionado.nome}</h2>
                  <button
                    onClick={() => setItemSelecionado(null)}
                    className="text-gray-400 hover:text-white text-xl"
                  >
                    ✕
                  </button>
                </div>
                <img
                  src={itemSelecionado.imgProduto}
                  alt={itemSelecionado.nome}
                  className="img-prod"
                />
                <div className="descritivo-produtos">
                  <p>
                  Tamanho:{" "}
                  <span className="text-blue-400">{itemSelecionado.tamanho}</span>
                  </p>
                  <p className="text-xl font-semibold mb-4">
                    Preço: R$ {itemSelecionado.price?.toFixed(2)}
                  </p>
                  <label className="block text-sm mb-1 text-white">Selecionar mesa ativa:</label>
                  <div className="mb-4">
                    <select
                      value={mesaParaAdicionar ? String(mesaParaAdicionar.id) : ""}
                      onChange={(e) => {
                        const idSelecionado = e.target.value;
                        if (idSelecionado === "") {
                          setMesaParaAdicionar(null);
                          return;
                        }
                        const mesaSelecionada = mesasAtivas.find(
                          (mesa) => String(mesa.id) === idSelecionado
                        );
                        console.log("ID selecionado:", idSelecionado);
                        console.log("Mesa encontrada:", mesaSelecionada);
                        setMesaParaAdicionar(mesaSelecionada || null);
                      }}>
                      <option value="">Selecione uma mesa</option>
                      {mesasAtivas.map((mesa) => (
                        <option key={mesa.id} value={String(mesa.id)}>
                          Mesa #{mesa.numero}
                        </option>
                      ))}
                    </select>
                  </div>
                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-white">Quantidade:</label>
                      <div className="flex items-center space-x-3 bg-gray-800 px-4 py-2 rounded w-fit">
                        <button
                          onClick={() => setQuantidade((prev) => Math.max(1, prev - 1))}
                          className="text-white text-lg px-2 hover:text-red-400"
                          style={{ marginRight: 15 }}
                        >
                          −
                        </button>
                        <span 
                          className="text-white font-semibold"
                          style={{ marginRight: 15 }}>
                            {quantidade}
                        </span>
                        <button
                          onClick={() => setQuantidade((prev) => prev + 1)}
                          className="text-white text-lg px-2 hover:text-green-400"
                        >
                          +
                        </button>
                      </div>
                    </div>
                </div>
                <button
                  className={`bg-green-500 hover:bg-green-600 px-4 py-2 rounded w-full ${
                    !mesaParaAdicionar ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={async () => {
                    if (!mesaParaAdicionar) return;

                    await adicionarItemNaComanda();

                    setMensagemSucesso("Item adicionado com sucesso!");
                    setTimeout(() => setMensagemSucesso(null), 3000);
                  }}
                  disabled={!mesaParaAdicionar}
                >
                  Adicionar ao pedido
                </button>

              </div>
            </div>
          )}
        </div>
      </div>
    )}
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
  const renderMesas = () => (
      <div>
        <h1>Mesas</h1>
        {loading ? (
          <p>Carregando mesas...</p>
        ) : todasMesas.length === 0 ? (
          <p>Nenhuma mesa cadastrada.</p>
        ) : (
              <div className="conteudo-mesas">
                <div className="catalogo-grid">
                  {todasMesas.map((mesa) => (
                    <div
                      key={mesa.id}
                      className={`mesa ${mesa.ativa ? 'mesa-ocupada' : 'mesa-livre'}`}
                      onClick={() => setMesaSelecionada(mesa)}
                      style={{height: 110}}
                    >
                      Mesa #{mesa.numero}
                        <div className="status">
                          {mesa.ativa ? "❌ Ocupada" : "✅ Livre"}
                        </div>
                        <p className="mt-2 text-sm">
                          {mesa.ativa ? "Detalhes da mesa" : "Abrir mesa"}
                        </p>
                    </div>
                  ))}
                
                </div> 
                {mesaSelecionada && (
                  <div className="dinamico-comanda">
                    <div className="p-6 flex flex-col h-full">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">
                        Mesa #{mesaSelecionada.numero}
                        </h2>
                        <button
                          onClick={() => setMesaSelecionada(null)}
                          className="text-gray-400 hover:text-white text-xl"
                          >
                          ✕
                        </button>
                      </div>
                      <p className="mb-4">
                        Status:{" "}
                        <span className={mesaSelecionada.ativa ? "text-red-400" : "text-green-400"}>
                          {mesaSelecionada.ativa ? "Ocupada" : "Livre"}
                        </span>
                      </p>
                      {mesaSelecionada.ativa ? (
                        <div>
                          <p>Comanda: {idComandaSelecionada?.toString().slice(0, 5)}</p>
                          <p className="font-semibold mb-2">Itens da comanda:</p>
                          {itensComanda.length === 0 ? (
                            <p className="text-sm text-gray-400 mb-4">Nenhum item adicionado ainda.</p>
                          ) : (
                            <ul className="mb-4 space-y-2">
                              {itensComanda.map((item) => (
                                <li key={item.id} className="bg-gray-700 p-3 rounded">
                                  <div className="flex justify-between">
                                    <span>{item.nome_produto}</span>
                                    <span>
                                      {item.quantidade} x R${item.preco_unitario.toFixed(2)}
                                    </span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                          <button
                            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded w-full"
                            onClick={() => encerrarComanda(mesaSelecionada)}
                          >
                            Encerrar Comanda
                          </button>
                        </div>
                      ) : (
                        <button 
                          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded w-full mb-2"
                          onClick={() => abrirMesa(mesaSelecionada)}
                          >
                          Abrir Mesa
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
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
        return renderMesas()
      case "Cozinha":
        return <p>Teste</p>        
      default:
        return <p>Selecione uma opção.</p>
    }
  }
  <a href=""></a>

  return (
    <div className="flex-1 p-8 text-white">
      {mensagemSucesso && (
        <div className="bg-green-600 text-white p-2 rounded mb-4">
          {mensagemSucesso}
        </div>
      )}

      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        {renderContent()}
      </div>
            
    </div>
  )
}
