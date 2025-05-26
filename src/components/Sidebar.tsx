import  { useState } from "react";
import logo from "../assets/restaurante.png";
import './stylesidebar.css';

export default function Sidebar({ onSelect }: { onSelect: (value: string) => void }) {
  
  const menus = ['Dashboard', 'Produtos', 'Clientes', 'Relatórios'];

  // Estado para controlar o menu ativo - inicializado com 'Dashboard'
  const [activeMenu, setActiveMenu] = useState('Dashboard');

  // Função para selecionar menu
  function handleSelect(item: string) {
    setActiveMenu(item);
    onSelect(item);
  }

  return (
    <div className="sideBar">
      <div className="teste1">
        <img 
          src={logo} 
          alt="imagem-Logo-loja" 
          className="logo-loja"
        />
      
        <h1 className="h1Sidebar">Esfirraria do Zé</h1>
      </div>
      <ul>
        {menus.map((item) => (
          <li
            key={item}
            onClick={() => handleSelect(item)}
            className={`
              cursor-pointer 
              p-2 rounded 
              hover:bg-gray-700 
              ${activeMenu === item ? 'bg-gray-700 font-bold' : ''}
            `}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
