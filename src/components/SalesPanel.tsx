import './salespainel.css';

export default function SalesPanel() {
  return (
    <div className="vendasDia">
      <h2>Status do dia</h2>
      <p>26/05/2025</p>
      <div>
        <ul>
          <li><p>Total de vendas: <strong>R$ 1.250,00</strong></p></li>
          <li><p>Itens vendidos: <strong>18</strong></p></li>
          <li><p>Clientes atendidos: <strong>12</strong></p></li>
          <li><p>Ticket médio: <strong>R$ 130,00</strong></p></li>
          <li><p>Meta: <strong>R$ 15.000,00</strong></p></li>
          <li><p>Atingimento da meta: <strong>9%</strong></p></li>
        </ul>
      </div>
    </div>
  );
}

