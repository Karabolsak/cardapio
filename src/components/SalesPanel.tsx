export default function SalesPanel() {
  return (
    <div className="w-72 bg-blue-50 h-screen p-4 border-l border-gray-200">
      <h2 className="text-2xl font-semibold mb-6">Vendas do Dia</h2>
      <div className="space-y-4">
        <p>Total de vendas: <strong>R$ 1.250,00</strong></p>
        <p>Pedidos: <strong>18</strong></p>
        <p>Clientes atendidos: <strong>12</strong></p>
      </div>
    </div>
  );
}

