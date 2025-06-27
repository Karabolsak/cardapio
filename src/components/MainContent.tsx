import "../App.css";
import "./maincontent.css";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient"
import shopping from "../../src/assets/add-shopping-car.svg"

export default function MainContent({ selected }: { selected: string }) {
type Produto = {
  id: number;
  nome: string;
  tamanho: string;
  descricao: string;
  price: number;
  imgProduto: string;
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
  id_comanda: number;
};
type FormaPagamento = 'dinheiro' | 'pix' | 'cartao_credito' | 'cartao_debito';
type PagamentoExtra = {
  forma: FormaPagamento;
  valor: number;
};
type Comandas = {
  id: number;
  id_mesas: number;
  aberta_em: string;
  fechada_em: string;
  observacoes: string;
  nome_cliente: string;
  id_colaborador: number;
  id_loja: number;
  status: boolean;
  cpf_cliente: string;
  taxa_status: boolean;
  taxa_servico: number;
  forma_pagamento: string;
  mais_pagamentos: boolean;
  numero_mesa: number;
}

  const [produtos, setProdutos] = useState<Produto[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [mesaSelecionada, setMesaSelecionada] = useState<Mesa | null>(null);
  const [itensComanda, setItensComanda] = useState<ItemComanda[]>([]);
  const [itemSelecionado, setItemSelecionado] = useState<Produto | null>(null);
  const [comandaAbertas, setComandaAbertas] = useState<Comandas[]>([])
  const [loja, setLoja] = useState<Loja[]> ([])
  const [mesasAtivas, setMesasAtivas] = useState<Mesa[]>([]);
  const [mesaParaAdicionar, setMesaParaAdicionar] = useState<Mesa | null>(null);
  const [loadingClientes, setLoadingClientes] = useState(false)
  const [loadingProdutos, setLoadingProdutos] = useState(false)
  const [taxaServico, setTaxaServico] = useState<boolean>(false);
  const [dividirConta, setDividirConta] = useState<boolean>(false)
  const [cadastroClienteAtivo, setCadastroClienteAtivo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [todasMesas, setTodasMesas] = useState<any[]>([]);
  const [idComandaSelecionada, setIdComandaSelecionada] = useState<number | null>(null)
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  const [nomeCliente, setNomeCliente] = useState("");
  const [cpfCliente, setCpfCliente] = useState<string | ''>('');
  const [formaPagamento, setFormaPagamento] = useState('');
  const [telefoneCliente, setTelefoneCliente] = useState("");
  const [nascimentoCliente, setNascimentoCliente] = useState<string>('');
  const [emailCliente, setEmailCliente] = useState<string>('');
  const [quantidade, setQuantidade] = useState(1);
  const taxaPercentual = 0.1; // 10%
  const cpfLimpo = cpfCliente.replace(/\D/g, "");
  const [valorTexto, setValorTexto] = useState("0");
  const [formasPagamentosExtras, setFormasPagamentosExtras] = useState<PagamentoExtra[]>([]);
  const [valorPago, setValorPago] = useState<number>(0);
  const [observacoesPedidos, setObservacoesPedidos] = useState<string>('');
  const [comandaSelecionada, setComandaSelecionada] = useState<Comandas | null>(null);
  const [itensComandaSelecionada, setItensComandaSelecionada] = useState<ItemComanda[]>([]);
  const [taxaServicoComanda, setTaxaServicoComanda] = useState(false);
  const [formaPagamentoComanda, setFormaPagamentoComanda] = useState<FormaPagamento | ''>('');
  const [valorPagoComanda, setValorPagoComanda] = useState(0);
  const [statusAtivo, setStatusAtivo] = useState<"abertas" | "encerradas">("abertas");

  
 const abrirMesa = async (mesa: Mesa) => {
  const { data: comandaExistente } = await supabase
    .from('comandas')
    .select('id')
    .eq('id_mesa', mesa.id)
    .eq('status', true)
    .maybeSingle();

  if (comandaExistente) {
    setIdComandaSelecionada(comandaExistente.id);
  } else {
    const { data: novaComanda, error } = await supabase
      .from('comandas')
      .insert([{
        id_mesa: mesa.id,
        id_loja: mesa.id_loja,
        nome_cliente: nomeCliente,
        aberta_em: new Date().toISOString(),
        status: true,
        taxa_status: false,
        cpf_cliente: cpfLimpo,
        mais_pagantes: false,
        numero_mesa: mesa.numero,
      }])
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar comanda:", error);
      return;
    }

    setIdComandaSelecionada(novaComanda.id);
  }

  const { error: errorMesa } = await supabase
    .from("mesas")
    .update({ ativa: true })
    .eq("id", mesa.id);

  if (errorMesa) {
    console.error("Erro ao ativar mesa:", errorMesa);
    return;
  }

  const atualizadas = todasMesas.map((m) =>
    m.id === mesa.id ? { ...m, ativa: true } : m
  );
  setTodasMesas(atualizadas);
  setMesaSelecionada({ ...mesa, ativa: true });
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

  const subtotal = itensComanda.reduce((total, item) => total + (item.quantidade * item.preco_unitario), 0);
  const valorTaxa = taxaServico ? Number((subtotal * 0.1).toFixed(2)) : 0;
  const dividirConta = setDividirConta;

  const { error: updateComandaError } = await supabase
    .from("comandas")
    .update({ 
      status: false, 
      fechada_em: new Date().toISOString(),
      taxa_status: taxaServico,
      taxa_servico: valorTaxa,
      forma_pagamento: formaPagamento || "não informado",
      valor_comanda: calcularTotalPago(),
      mais_pagantes: dividirConta,
    })
    .eq("id", comanda.id);

  if (updateComandaError) {
    console.error("Erro ao fechar comanda:", updateComandaError);
    return;
  }
  const { error: updateMesaError } = await supabase
      .from("mesas")
      .update({ ativa: false })
      .eq("id", mesa.id);

    if (updateMesaError) {
      console.error("Erro ao liberar mesa:", updateMesaError);
      return;
    }
  const { error: updateItensError } = await supabase
    .from("itens_comanda")
    .update({ 
      status: "encerrado", 
      encerrado_em: new Date().toISOString() 
    })
    .eq("id_comanda", comanda.id);

  if (updateItensError) {
    console.warn("Itens não foram encerrados corretamente:", updateItensError);
    
  }
  const mesasAtualizadas = todasMesas.map((m) =>
    m.id === mesa.id ? { ...m, ativa: false } : m
  );
  setTodasMesas(mesasAtualizadas);
  setMesaSelecionada(null);
  setTaxaServico(false);
  setFormaPagamento("");
  setItensComanda([]);
  setNomeCliente("");

  console.log("Comanda e itens encerrados com sucesso!");
};
  const adicionarItemNaComanda = async () => {
  if (!itemSelecionado || !idComandaSelecionada) {
    alert("Selecione um produto e certifique-se que a mesa tem uma comanda ativa.");
    return;
  }

  const { error } = await supabase
    .from('itens_comanda')
    .insert([{
      id_comanda: idComandaSelecionada, // Usa diretamente o ID da comanda selecionada
      id_produto: itemSelecionado.id,
      quantidade,
      preco_unitario: itemSelecionado.price,
      adicionado_em: new Date().toISOString(),
      status: 'pendente',
      nome_produto: itemSelecionado.nome,
      observacoes: observacoesPedidos,
    }]);

  if (error) {
    console.error('Erro ao adicionar item:', error);
    alert('Erro ao adicionar item, tente novamente');
  } else {
    // Recarrega os itens da comanda
    const { data: itens } = await supabase
      .from('itens_comanda')
      .select('*')
      .eq('id_comanda', idComandaSelecionada);

    setItensComanda(itens || []);
    setMensagemSucesso("Item adicionado com sucesso!");
    setItemSelecionado(null);
    setQuantidade(1);
  }
  
};
  const calcularValorTotal = () => {
  const subtotal = itensComanda.reduce((total, item) => total + item.quantidade * item.preco_unitario, 0);
  const taxa = taxaServico ? subtotal * 0.1 : 0;
  return subtotal + taxa;
};
  const calcularValorTaxa = () => {
  const subtotal = itensComanda.reduce(
    (total, item) => total + item.quantidade * item.preco_unitario,
    0
  );

  const taxa = taxaServico ? subtotal * 0.1 : 0;

  return Number(taxa.toFixed(2)); // 👈 garante duas casas decimais sem “zebras”
};
  const formatarValorTaxa = (valor: number): string => {
    return Number(valor.toFixed(2)).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
};
  const formatarCPF = (valor: string) => {
  const numeros = valor.replace(/\D/g, "").slice(0, 11); // Máximo de 11 dígitos

  if (numeros.length <= 3) return numeros;
  if (numeros.length <= 6) return `${numeros.slice(0, 3)}.${numeros.slice(3)}`;
  if (numeros.length <= 9) return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6)}`;
  return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9, 11)}`;
};
  const verificarOuCadastrarCliente = async () => {
  if (!cpfCliente.trim() || !nomeCliente.trim()) {
    alert("Preencha o nome e CPF do cliente.");
    return;
  }

  const { data: clienteExistente, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('cpf', cpfCliente)
    .maybeSingle();

  if (error) {
    console.error("Erro ao verificar cliente:", error);
    alert("Erro ao verificar o cliente.");
    return;
  }

  if (clienteExistente) {
    // Cliente já existe → abrir mesa diretamente
    abrirMesa(mesaSelecionada!);
  } else {
    // Cliente não existe → ativar formulário para cadastrar
    setCadastroClienteAtivo(true);
  }
};
  const cadastrarCliente = async ( mesa: Mesa ) => {
  const { error } = await supabase.from('clientes').insert({
    nome: nomeCliente,
    cpf: cpfCliente,
    telefone: telefoneCliente,
    nascimento: nascimentoCliente,
    email: emailCliente,
    id_loja: mesa.id_loja,
  });

  if (error) {
    console.error("Erro ao cadastrar cliente:", error);
    alert("Erro ao cadastrar cliente");
    return;
  }

  setCadastroClienteAtivo(false);
  abrirMesa(mesaSelecionada!);
};
  const validarCamposObrigatorios = () => {
    if (!nomeCliente.trim()) {
      alert("Preencha o nome do cliente");
      return false;
    }
    if (!cpfCliente.trim()) {
      alert("Preencha o CPF do cliente");
      return false;
    }
    if (!nascimentoCliente.trim()) {
      alert("Preencha a data de nascimento");
      return false;
    }
    if (!emailCliente.trim()) {
      alert("Preencha o e-mail do cliente");
      return false;
    }
    return true;
};
  const handleCadastrarCliente = () => {
    if (!validarCamposObrigatorios()) return;
    cadastrarCliente(mesaSelecionada!); // essa é sua função existente
};
  const formatarCelular = (valor: string) => {
  const numeros = valor.replace(/\D/g, '').slice(0, 11); // só números, no máx 11 dígitos

  if (numeros.length <= 2) {
    return `(${numeros}`;
  } else if (numeros.length <= 6) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  } else if (numeros.length <= 10) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
  } else {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
  }
};
  const formatarValorMonetario = (valor: string): string => {
  const numeros = valor.replace(/\D/g, '') || '0';
  const numero = (Number(numeros) / 100).toFixed(2);

  return Number(numero).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};
  const formasPagamentoLabels: Record<FormaPagamento, string> = {
    dinheiro: 'Dinheiro',
    cartao_credito: 'Cartão de Crédito',
    cartao_debito: 'Cartão de Débito',
    pix: 'PIX'
};
  const calcularTotalPago = (): number => {
    const extras = formasPagamentosExtras.reduce((acc, item) => acc + item.valor, 0);
    return valorPago + extras;
};
  const calcularValorRestante = (): number => {
    return calcularValorTotal() - calcularTotalPago();
};
  const buscarComandasAbertas = async () => {
  try {
    const { data, error } = await supabase
      .from('comandas')
      .select('*')
      .eq('status', true);

    if (error) {
      console.error('Erro ao buscar comandas abertas:', error.message);
      return [];
    }

    return data; 
  } catch (e) {
    console.error('Erro inesperado:', e);
    return [];
  }
};
  const buscarComandas = async (statusAtivo: "abertas" | "encerradas") => {
  try {
    const statusBoolean = statusAtivo === "abertas"; // converte para true ou false

    const { data, error } = await supabase
      .from('comandas')
      .select('*')
      .eq('status', statusBoolean)
      .order('aberta_em', { ascending: false });

    if (error) {
      console.error('Erro ao buscar comandas:', error.message);
      return [];
    }

    return data ?? [];
  } catch (e) {
    console.error('Erro inesperado:', e);
    return [];
  }
};
  const calcularSubtotal = () => {
    return itensComandaSelecionada.reduce(
      (total, item) => total + (item.quantidade * item.preco_unitario), 
      0
    );
};
  const calcularTaxa = () => {
    return taxaServicoComanda ? calcularSubtotal() * 0.1 : 0;
};
  const calcularTotal = () => {
    return calcularSubtotal() + calcularTaxa();
};
  const calcularRestante = () => {
    return calcularTotal() - valorPagoComanda;
};
  const finalizarComanda = async () => {
    if (!comandaSelecionada) return;

    try {
      // Atualiza a comanda no banco de dados
      const { error } = await supabase
        .from('comandas')
        .update({
          status: false,
          fechada_em: new Date().toISOString(),
          taxa_status: taxaServicoComanda,
          taxa_servico: calcularTaxa(),
          forma_pagamento: formaPagamentoComanda,
          valor_total: calcularTotal(),
          valor_pago: valorPagoComanda
        })
        .eq('id', comandaSelecionada.id);

      if (error) throw error;

      // Libera a mesa associada
      await supabase
        .from('mesas')
        .update({ ativa: false})
        .eq('id', comandaSelecionada.id_mesas);

      // Atualiza o estado
      setComandaAbertas(comandaAbertas.filter(c => c.id !== comandaSelecionada.id));
      setComandaSelecionada(null);
      alert('Comanda encerrada com sucesso!');

    } catch (error) {
      console.error('Erro ao finalizar comanda:', error);
      alert('Erro ao finalizar comanda');
    }
};
const botoes = document.querySelectorAll(".botao-status");

botoes.forEach((btn) => {
  btn.addEventListener("click", () => {
    botoes.forEach((b) => b.classList.remove("ativo"));
    btn.classList.add("ativo");
  });
});




// Pagina comanda 11







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
  if (!mesaSelecionada || !mesaSelecionada.ativa) {
    setItensComanda([]);
    setNomeCliente("");
    setIdComandaSelecionada(null);
    return;
  }

  const carregarDadosMesa = async () => {
    // Busca a comanda ativa para a mesa
    const { data: comanda } = await supabase
      .from('comandas')
      .select('id, nome_cliente')
      .eq('id_mesa', mesaSelecionada.id)
      .eq('status', true)
      .single();

    if (comanda) {
      setNomeCliente(comanda.nome_cliente || "");
      setIdComandaSelecionada(comanda.id);

      // Busca os itens da comanda
      const { data: itens } = await supabase
        .from('itens_comanda')
        .select('*')
        .eq('id_comanda', comanda.id);

      setItensComanda(itens || []);
    }
  };

  carregarDadosMesa();
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
useEffect(() => {
  if (dividirConta && quantidade > 1) {
    setFormasPagamentosExtras(
      Array(quantidade - 1).fill({ forma: 'dinheiro', valor: 0 })
    );
  } else {
    setFormasPagamentosExtras([]);
  }
}, [dividirConta, quantidade]);
useEffect(() => {
  const carregarComandas = async () => {
    const comandas = await buscarComandasAbertas(); 
    setComandaAbertas(comandas);
  };
  
  carregarComandas();
}, []);
useEffect(() => {
  const carregar = async () => {
    const dados = await buscarComandas(statusAtivo);
    setComandaAbertas(dados);
  };

  carregar();
  console.log("Página carregou com status:", statusAtivo);
}, [statusAtivo]);

 useEffect(() => {
    if (!comandaSelecionada) {
      setItensComandaSelecionada([]);
      return;
    }

    const carregarItensComanda = async () => {
      const { data, error } = await supabase
        .from('itens_comanda')
        .select('*')
        .eq('id_comanda', comandaSelecionada.id);

      if (!error) {
        setItensComandaSelecionada(data || []);
        setTaxaServicoComanda(comandaSelecionada.taxa_status || false);
      }
    };

    carregarItensComanda();
  }, [comandaSelecionada]);
  
 



  const renderProdutos = () => (
  <div>
    <h1 className="titulo-mesas">Produtos</h1>
    {loadingProdutos ? (
      <p>Carregando produtos...</p>
    ) : (
      <div className="conteudo-geral">
        <div className="conteudo-produtos">
        <div className="catalogo-grid">
          {produtos.map((produto) => (
            <div key={produto.id} className="item-card" onClick={() => setItemSelecionado(produto)}>
              <img src={produto.imgProduto} className="item-img"  />
              <div className="infoProdutos">
                <h3>{produto.nome}</h3><h5>{produto.tamanho}</h5>
              </div>
              <div className="preco">
                <p>R$ {produto.price?.toFixed(2)}</p>
                <img src={shopping} alt="Adicionar ao carrinho" />
              </div>
            </div>
          ))}
        </div>
        
      </div>
      <div>
          {itemSelecionado && (
            <div className="dinamico-produto">
              <p>Adicionar item na mesa</p>
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
                  {" "}
                  <span className="text-blue-400">{itemSelecionado.tamanho}</span>
                  </p>
                  <div className="produtosMesa">
                    <label className="block text-sm mb-1 text-white">Selecionar mesa ativa:</label>
                    <div className="mb-4">
                      <select
                         value={mesaParaAdicionar ? String(mesaParaAdicionar.id) : ""}
                          onChange={async (e) => {
                            const idSelecionado = e.target.value;
                            if (idSelecionado === "") {
                              setMesaParaAdicionar(null);
                              setIdComandaSelecionada(null);
                              return;
                            }
                            const mesaSelecionada = mesasAtivas.find(
                              (mesa) => String(mesa.id) === idSelecionado
                            );
                            setMesaParaAdicionar(mesaSelecionada || null);
                            
                            // Busca a comanda ativa para a mesa selecionada
                            if (mesaSelecionada) {
                              const { data: comanda } = await supabase
                                .from('comandas')
                                .select('id')
                                .eq('id_mesa', mesaSelecionada.id)
                                .eq('status', true)
                                .single();
                                
                              setIdComandaSelecionada(comanda?.id || null);
                            }
                          }}
                        >
                        <option value="">Selecione uma mesa</option>
                        {mesasAtivas.map((mesa) => (
                          <option key={mesa.id} value={String(mesa.id)}>
                            Mesa #{mesa.numero}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-white">Quantidade:</label>
                      <div className="flex items-center space-x-3 bg-gray-800 px-4 py-2 rounded w-fit" >
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
                    <div className="observacoes-pedidos">
                      <label>Adicionar observação no pedido</label>
                      <input 
                        type="text" 
                        placeholder="Observações"
                        value={observacoesPedidos}
                        required
                        onChange={(e) => setObservacoesPedidos(e.target.value)}
                      />
                    </div>

                </div>
                <button
                  className={`bg-green-500 hover:bg-green-600 px-4 py-2 rounded w-full ${
                    !mesaParaAdicionar || !idComandaSelecionada  ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={async () => {
                    if (!mesaParaAdicionar || !idComandaSelecionada) return;
                    await adicionarItemNaComanda();
                    setMensagemSucesso("Item adicionado com sucesso!");
                    setTimeout(() => setMensagemSucesso(null), 3000);
                  }}
                  disabled={!mesaParaAdicionar || !idComandaSelecionada}
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
        <h1 className="titulo-mesas">Mesas</h1>
        {loading ? (
          <p>Carregando mesas...</p>
        ) : todasMesas.length === 0 ? (
          <p>Nenhuma mesa cadastrada.</p>
        ) : (
          <div className="conteudo-geral">
              <div className="conteudo-mesas">
                <div className="catalogo-grid-mesas">
                  {todasMesas.map((mesa) => (
                    <div
                      key={mesa.id}
                      className={`mesa ${mesa.ativa ? 'mesa-ocupada' : 'mesa-livre'} ${
                        mesaSelecionada?.id === mesa.id ? 'border-2 border-yellow-400' : ''
                      }`}
                      onClick={() => setMesaSelecionada(mesa)}
                      >
                      Mesa #{mesa.numero}
                      <div className="status">
                        {mesa.ativa ? "❌ Ocupada" : "✅ Livre"}
                      </div>
                      <p className="mt-2 text-sm">
                        {mesa.ativa ? "Detalhes" : "Abrir mesa"}
                      </p>
                    </div>
                  ))}
                </div> 
              </div>
              <div>
                    {mesaSelecionada && (
                        <div className="dinamico-comanda">
                          <div className="p-6 flex flex-col h-full">
                            <div className="titulo-comanda">
                              <h2 className="text-2xl font-bold">
                              Mesa #{mesaSelecionada.numero} 
                              </h2>
                              {mesaSelecionada.ativa ? <p>{nomeCliente}</p>   : ""}
                              <button
                                onClick={() => setMesaSelecionada(null)}
                                className="text-gray-400 hover:text-white text-xl"
                                >
                                ✕
                              </button>
                            </div>
                            <p className="mb-4">
                              <span className={mesaSelecionada.ativa ? "text-red-400" : "text-green-400"}>
                                {mesaSelecionada.ativa ? "" : "Mesa disponível"}
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
                                      <li key={item.id} className="item-comanda bg-gray-700 p-3 rounded">
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
                                <div className="flex items-center justify-between">
                                  <label className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      checked={taxaServico}
                                      onChange={() => setTaxaServico(!taxaServico)}
                                      className="h-4 w-4 text-blue-600 rounded"
                                    />
                                    <span>Taxa de serviço ({(taxaPercentual * 100).toFixed(0)}%)</span>
                                  </label>
                                </div>
                                <div className="text-right">
                                  <span>Taxa: {formatarValorTaxa(calcularValorTaxa())}</span>
                                </div>
                                <div className="text-right">
                                  <p className="text-xl font-bold text-white">
                                    Total: R$ {calcularValorTotal().toFixed(2)}
                                  </p>
                                </div>
                                <div className="mb-4">
                                  <label className="block text-sm font-medium text-white mb-1">
                                    Forma de Pagamento
                                  </label>
                                  <select 
                                    value={formaPagamento}
                                    onChange={(e) => {
                                      setFormaPagamento(e.target.value as FormaPagamento)
                                    }}
                                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                                    >
                                    <option value="">Opções</option>
                                    <option value="dinheiro">Dinheiro</option>
                                    <option value="pix">Pix</option>
                                    <option value="cartao_debito">Cartão de Débito</option>
                                    <option value="cartao_credito">Cartão de Crédito</option>
                                  </select>
                                </div>
                                {['pix', 'dinheiro', 'cartao_debito', 'cartao_credito'].includes(formaPagamento) && (
                                  <div className="text-left mt-4">
                                    <label className="block text-sm text-white mb-1">Insira o valor recebido:</label>
                                    <input
                                      type="text"
                                      inputMode="numeric"
                                      value={formatarValorMonetario(valorTexto)}
                                      onChange={(e) => {
                                        const novoValor = e.target.value;
                                        const apenasNumeros = novoValor.replace(/\D/g, '');

                                        setValorTexto(apenasNumeros); 
                                        setValorPago(Number(apenasNumeros) / 100); 
                                      }}
                                      className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
                                      placeholder="Digite o valor"
                                    />
                                  </div>
                                )}
                                <div className="dividir-conta">
                                    <label className="text-white mr-2">Dividir conta?</label>
                                    <input 
                                      type="checkbox" 
                                      checked={dividirConta}
                                      onChange={() => setDividirConta(!dividirConta)}
                                      className="h-4 w-4 text-blue-600 rounded"
                                    />
                                    {dividirConta && (
                                      <div className="botton-dividir">
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
                                    )}
                                </div>
                                {dividirConta && quantidade > 1 && (
                                  <div className="mt-4 space-y-4">
                                    {formasPagamentosExtras.map((pagamento, index) => (
                                      <div key={index} className="pagamentos-extras">
                                        <label className="block text-white mb-2">
                                          Pagamento adicional {index + 2}
                                        </label>

                                        <select
                                          value={pagamento.forma}
                                          onChange={(e) => {
                                            const novasFormas = [...formasPagamentosExtras];
                                            novasFormas[index] = {
                                              ...novasFormas[index],
                                              forma: e.target.value as FormaPagamento,
                                            };
                                            setFormasPagamentosExtras(novasFormas);
                                          }}
                                          className="w-full mb-2 px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
                                        >
                                          {Object.entries(formasPagamentoLabels).map(([value, label]) => (
                                            <option key={value} value={value}>
                                              {label}
                                            </option>
                                          ))}
                                        </select>
                                        <label>Insira o valor recebido: </label>
                                        <input
                                          type="text"
                                          value={pagamento.valor.toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL'
                                          })}
                                          onChange={(e) => {
                                            const novasFormas = [...formasPagamentosExtras];
                                            const valorBruto = e.target.value.replace(/\D/g, '');
                                            const valor = Number((parseFloat(valorBruto) / 100).toFixed(2)); // 👈 corrige o ponto flutuante
                                            novasFormas[index] = {
                                              ...novasFormas[index],
                                              valor: valor,
                                            };
                                            setFormasPagamentosExtras(novasFormas);
                                          }}

                                          className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
                                          placeholder="R$ 0,00"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <div className="text-right">
                                  <p className="text-xl font-bold text-white">
                                    Total a pagar: R$ {calcularValorTotal().toFixed(2)}
                                  </p>
                                </div>
                                <p className="text-green-400 mt-2 text-right">
                                  Total recebido: {calcularTotalPago().toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                  })}
                                </p>
                                <p className="text-yellow-300 mt-2 text-right">
                                  Valor restante: {calcularValorRestante().toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                  })}
                                </p>
                                {calcularValorRestante() < 0 && (
                                  <p className="text-cyan-400 mt-2 text-right">
                                    Troco: {(calcularValorRestante() * -1).toLocaleString('pt-BR', {
                                      style: 'currency',
                                      currency: 'BRL',
                                    })}
                                  </p>
                                )}




                                <button
                                  type="button"
                                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded w-full"
                                  onClick={() => encerrarComanda(mesaSelecionada)}
                                  disabled={Number(calcularValorRestante().toFixed(2)) !== 0}
                                >
                                  Encerrar Comanda
                                </button>
                              </div>
                            ) : (
                              <div className="formulario-Cliente">
                                <input
                                  type="text"
                                  value={nomeCliente}
                                  required
                                  onChange={(e) => {
                                    const texto = e.target.value;
                                    const textoFormatado = texto.charAt(0).toUpperCase() + texto.slice(1);
                                    setNomeCliente(textoFormatado);
                                  }}
                                  className="input-estilizado"
                                  placeholder="Digite o nome do cliente"
                                />
                                <input
                                  type="text"
                                  value={cpfCliente}
                                  required
                                  onChange={(e) => setCpfCliente(formatarCPF(e.target.value))}
                                  className="input-estilizado"
                                  maxLength={14}
                                  placeholder="Digite o CPF do cliente"
                                />

                                <button 
                                  type="button"
                                  onClick={() => verificarOuCadastrarCliente()}
                                  className={`px-4 py-2 rounded w-full mb-2 transition ${
                                    !nomeCliente.trim()
                                      ? "bg-gray-500 cursor-not-allowed"
                                      : "bg-green-500 hover:bg-green-600"
                                  } text-white`}
                                >
                                  Abrir Mesa
                                </button>
                                {cadastroClienteAtivo && (
                                  <div className="terminar-cliente">
                                    <label>Nome do cliente:</label>
                                    <input
                                      type="text"
                                      value={nomeCliente}
                                      onChange={(e) => setNomeCliente(e.target.value)}
                                      required
                                      className="input-estilizado"
                                    />
                                    <label>Telefone:</label>
                                    <input
                                      type="text"
                                      value={telefoneCliente}
                                      onChange={(e) => setTelefoneCliente(formatarCelular(e.target.value))}
                                      required
                                      className="input-estilizado"
                                      placeholder="(xx) xxxxx-xxxx"
                                    />
                                    <label>Data de nascimento:</label>
                                    <input
                                      type="date"
                                      value={nascimentoCliente}
                                      onChange={(e) => setNascimentoCliente(e.target.value)}
                                      className="input-estilizado"
                                    />
                                    <label>E-mail:</label>
                                    <input
                                      type="email"
                                      value={emailCliente}
                                      onChange={(e) => setEmailCliente(e.target.value)}
                                      className="input-estilizado"
                                      placeholder="exemplo@mail.com"
                                    />
                                    <button
                                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full mt-2"
                                      disabled={!nomeCliente.trim()}
                                      onClick={handleCadastrarCliente}
                                    >
                                      Cadastrar Cliente e Abrir Mesa
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
              </div> 
          </div>
            )}    
    </div>
  )
  const renderComandas = () => {
  

  return (
    <div>
      <div className="paginaComandas">
        <div>
          <h1>Gestão de Comandas</h1>
        </div>
        <div className="buttonComandas">
          <button
            className={`botao-status ${statusAtivo === "abertas" ? "ativo" : ""}`}
            data-status="abertas"
            onClick={() => setStatusAtivo("abertas")}
          >
            Abertas
          </button>
          <button
            className={`botao-status ${statusAtivo === "encerradas" ? "ativo" : ""}`}
            data-status="encerradas"
            onClick={() => setStatusAtivo("encerradas")}
          >
            Encerradas
          </button>
        </div>
    </div>
      
      <div className="conteudo-geral">
        {/* Lista de comandas */}
        <div className="conteudo-mesas">
          <div className="catalogo-grid-comandas">
            {comandaAbertas.map(comanda => (
              <div
                key={comanda.id}
                className={`mesa ${comandaSelecionada?.id === comanda.id ? 'border-2 border-yellow-400' : ''}`}
                onClick={() => setComandaSelecionada(comanda)}
              >
                <h3>Mesa {comanda.numero_mesa}</h3>
                <p>{comanda.nome_cliente || 'Sem nome'}</p>
                <p>{new Date(comanda.aberta_em).toLocaleTimeString()}</p>
                <span className={`status ${comanda.status ? 'aberta' : 'fechada'}`}>
                  {comanda.status ? 'Aberta' : 'Fechada'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Painel detalhado da comanda selecionada */}
        {comandaSelecionada && (
          <div className="dinamico-comanda">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                Mesa {comandaSelecionada.numero_mesa} - {comandaSelecionada.nome_cliente || 'Sem nome'}
              </h2>
              <button
                onClick={() => setComandaSelecionada(null)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            {/* Itens da comanda */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Itens:</h3>
              {itensComandaSelecionada.length === 0 ? (
                <p className="text-gray-400">Nenhum item adicionado</p>
              ) : (
                <ul className="space-y-2">
                  {itensComandaSelecionada.map(item => (
                    <li key={item.id} className="flex justify-between">
                      <span>
                        {item.quantidade}x {item.nome_produto}
                      </span>
                      <span>
                        R$ {(item.quantidade * item.preco_unitario).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Resumo financeiro */}
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between mb-1">
                <span>Subtotal:</span>
                <span>R$ {calcularSubtotal().toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between mb-1">
                <span>Taxa de serviço (10%):</span>
                <span>R$ {calcularTaxa().toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between font-bold text-lg mt-2">
                <span>Total:</span>
                <span>R$ {calcularTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Forma de pagamento */}
            <div className="mb-4">
              <label className="block mb-2">Forma de Pagamento:</label>
              <select
                value={formaPagamentoComanda}
                onChange={(e) => setFormaPagamentoComanda(e.target.value as FormaPagamento)}
                className="w-full p-2 rounded bg-gray-700"
              >
                <option value="">Selecione</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="pix">PIX</option>
                <option value="cartao_debito">Cartão de Débito</option>
                <option value="cartao_credito">Cartão de Crédito</option>
              </select>
            </div>

            {/* Valor pago */}
            <div className="mb-4">
              <label className="block mb-2">Valor Recebido:</label>
              <input
                type="number"
                value={valorPagoComanda}
                onChange={(e) => setValorPagoComanda(Number(e.target.value))}
                className="w-full p-2 rounded bg-gray-700"
                step="0.01"
                min="0"
              />
            </div>

            {/* Resumo de pagamento */}
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between">
                <span>Valor Pago:</span>
                <span>R$ {valorPagoComanda.toFixed(2)}</span>
              </div>
              <div className={`flex justify-between ${
                calcularRestante() > 0 ? 'text-yellow-400' : 'text-green-400'
              }`}>
                <span>{calcularRestante() > 0 ? 'Restante:' : 'Troco:'}</span>
                <span>R$ {Math.abs(calcularRestante()).toFixed(2)}</span>
              </div>
            </div>

            {/* Ações */}
            <div className="flex space-x-2">
              <button
                onClick={() => setComandaSelecionada(null)}
                className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded flex-1"
              >
                Voltar
              </button>
              <button
                onClick={finalizarComanda}
                disabled={calcularRestante() > 0 || !formaPagamentoComanda}
                className={`bg-green-500 hover:bg-green-600 px-4 py-2 rounded flex-1 ${
                  calcularRestante() > 0 || !formaPagamentoComanda ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Finalizar Comanda
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
  const renderCozinha = () => {
    return (
      <h1 className="titulo-mesas">Cozinha</h1>
    )
  }
  const renderBar = () => {
    return (
      <div>
        <h1 className="titulo-mesas">Bar</h1>
      </div>
      
      
    )
  }
  const renderDash = () => {
    return (
      <h1 className="titulo-mesas">Dashboard</h1>
    )
  }

  
  const renderContent = () => {
    switch (selected) {
      case "Dashboard":
        return  renderDash()
      case "Clientes":
          return renderClientes()
      case "Produtos":
        return renderProdutos()
      case "Mesas":
        return renderMesas()
      case "Cozinha":
        return renderCozinha()     
      case "Comandas": 
        return renderComandas()   
      case "Bar": 
      return renderBar()
      default:
        return <p>Selecione uma opção.</p>
    }
  }

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