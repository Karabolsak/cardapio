export default function MainContent({ selected }: { selected: string }) {
  const renderContent = () => {
    switch (selected) {
      case "Dashboard":
        return <p>📊 Bem-vindo ao dashboard!</p>;
      case "Produtos":
        return <p>🍕 Lista de produtos cadastrados.</p>;
      case "Clientes":
        return <p>🧑‍🤝‍🧑 Gerenciamento de clientes.</p>;
      case "Catálogo":
        return <p>🆕 Adicionar novos itens no cardápio.</p>;
        case "Mesas":
          return <p>Mesas</p>;
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
