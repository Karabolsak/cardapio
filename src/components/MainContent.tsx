import "../App.css";
import "./maincontent.css";

export default function MainContent({ selected }: { selected: string }) {
  const renderContent = () => {
    switch (selected) {
      case "Dashboard":
        return <p>📊 Bem-vindo ao dashboard!</p>;
      case "Produtos":
        return <p>📑 Aqui estão seus relatórios.</p>;
      case "Clientes":
        return  <div >
                  <h1>Relatório de clientes</h1>
                  <ul className="conteudoClientes">
                    <li><p>Nome</p>
                      <ul>
                        <li className="truncate max-w-[200px]">Vinicius Lodi Cordeiro Karabolsak</li>
                        <li className="truncate max-w-[200px]">Victor Lodi Coreiro Karabolsak</li>
                        <li className="truncate max-w-[200px]">Vinicius Lodi Cordeiro Karabolsak</li>
                        <li className="truncate max-w-[200px]">Victor Lodi Coreiro Karabolsak</li>
                        <li className="truncate max-w-[200px]">Vinicius Lodi Cordeiro Karabolsak</li>
                        <li className="truncate max-w-[200px]">Victor Lodi Coreiro Karabolsak</li>
                        <li className="truncate max-w-[200px]">Vinicius Lodi Cordeiro Karabolsak</li>
                        <li className="truncate max-w-[200px]">Victor Lodi Coreiro Karabolsak</li>
                      </ul>
                    </li>
                    <li><p>CPF</p>
                      <ul>
                        <li>123.456.789-00</li>
                        <li>123.456.789-00</li>
                        <li>123.456.789-00</li>
                        <li>123.456.789-00</li>
                        <li>123.456.789-00</li>
                        <li>123.456.789-00</li>
                        <li>123.456.789-00</li>
                        <li>123.456.789-00</li>
                      </ul>
                    </li>
                    <li><p>Itens consumidos</p>
                      <ul>
                        <li>5</li>
                        <li>8</li>
                        <li>5</li>
                        <li>8</li>
                        <li>5</li>
                        <li>8</li>
                        <li>5</li>
                        <li>8</li>
                      </ul>
                    </li>
                    <li><p>Valor gasto</p>
                      <ul>
                        <li>R$ 78,50</li>
                        <li>R$ 152,34</li>
                        <li>R$ 78,50</li>
                        <li>R$ 152,34</li>
                        <li>R$ 78,50</li>
                        <li>R$ 152,34</li>
                        <li>R$ 78,50</li>
                        <li>R$ 152,34</li>                        
                      </ul>
                    </li>
                    <li><p>Ticket médio</p>
                      <ul>
                        <li>R$ 78,50</li>
                        <li>R$ 152,34</li>
                        <li>R$ 78,50</li>
                        <li>R$ 152,34</li>
                        <li>R$ 78,50</li>
                        <li>R$ 152,34</li>
                        <li>R$ 78,50</li>
                        <li>R$ 152,34</li>
                      </ul>
                    </li>
                    <li><p>Pagamento</p>
                      <ul>
                        <li>Débito</li>
                        <li>Crédito</li>
                        <li>Débito</li>
                        <li>Crédito</li>
                        <li>Débito</li>
                        <li>Crédito</li>
                        <li>Débito</li>
                        <li>Crédito</li>                        
                      </ul>
                    </li>
                    <li><p>Mesa</p>
                      <ul>
                        <li>2</li>
                        <li>5</li>
                        <li>4</li>
                        <li>8</li>
                        <li>7</li>
                        <li>7</li>
                        <li>1</li>
                        <li>2</li>
                      </ul>
                    </li>

                    
                    
                  </ul>








                  
                </div>;
      case "Mesas":
        return <p>🧑‍🤝‍🧑 Gerenciamento de clientes.</p>;
      default:
        return <p>Selecione uma opção.</p>;
    }
  };
return (
    <div className="flex-1 p-8 text-white">
      <h2 className="text-3xl font-bold mb-6">{selected}</h2>
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        {renderContent()}
      </div>
    </div>
  );
}

  







