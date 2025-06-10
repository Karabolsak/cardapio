import { useEffect, useState } from "react";
import logo from "../assets/restaurante.png";
import './stylesidebar.css';
import { supabase } from "../supabaseClient";

export default function Sidebar({ onSelect }: { onSelect: (value: string) => void }) {
  const menus = ['Dashboard', 'Produtos', 'Clientes', 'Mesas', 'Abertura de comanda' ];
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [loja, setLoja] = useState<any[]> ([])

  function formatCNPJ(cnpj: string) {
      cnpj = cnpj.replace(/\D/g, ""); 
      return cnpj.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5"
    );
  }
  function handleSelect(item: string) {
    setActiveMenu(item);
    onSelect(item);
  }


  useEffect(() => {
    const fetchLoja = async () => {
      const { data, error } = await supabase.from('loja').select('*')
      if (error) {
        console.error("Erro ao buscar loja", error)
      }else {
        setLoja(data || [])
      }
    }
    fetchLoja();
  }, []);



  return (
    <div className="sideBar">
      <div className="teste1">
        <img
          src={logo}
          alt="imagem-Logo-loja"
          className="logo-loja"
        />
        <div className="infoLoja">
          <h1>{loja[0]?.nome} </h1>
          <p>{loja[0]?.cnpj ? formatCNPJ(loja[0].cnpj) : "..."}</p>
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
