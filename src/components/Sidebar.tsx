import { useState } from "react";
import logo from "../assets/restaurante.png";
import './stylesidebar.css';

export default function Sidebar({ onSelect }: { onSelect: (value: string) => void }) {
  const menus = ['Dashboard', 'Produtos', 'Clientes', 'Mesas', 'Abertura de comanda', 'Novos produtos'];
  const [activeMenu, setActiveMenu] = useState('Dashboard');

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
        <div className="infoLoja">
          <h1>Esfirraria do Zé</h1>
          <p>12.345.678/9000-00</p>
        </div>
        
      </div>

      <div className="menu-container">
        <div
          className="borda-animada"
          style={{
            top: `${menus.indexOf(activeMenu) * 44}px`,
            height: '44px',
          }}
        />

        <ul>
          {menus.map((item) => (
            <li
              key={item}
              onClick={() => handleSelect(item)}
              className={`
                cursor-pointer 
                p-3 rounded 
                hover:bg-gray-700 
                ${activeMenu === item ? 'bg-gray-700 font-bold' : ''}
              `}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
