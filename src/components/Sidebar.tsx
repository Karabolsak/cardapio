export default function Sidebar({ onSelect }: { onSelect: (value: string) => void }) {
  const menus = ['Dashboard', 'Produtos', 'Clientes', 'Relatórios'];

  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Menu</h1>
      <ul className="space-y-4">
        {menus.map((item) => (
          <li
            key={item}
            onClick={() => onSelect(item)}
            className="cursor-pointer hover:bg-gray-700 p-2 rounded"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
