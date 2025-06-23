import { useEffect, useState } from "react";
import logo from "../assets/restaurante.png";
import './stylesidebar.css';
import { supabase } from "../supabaseClient";
import comandasClara from '../assets/comandas-clara.svg'; //Comandas
import comandasVerde from '../assets/comandas-verde.svg';
import menuClaro from '../assets/menu-claro.svg'; //Produtos
import menuVerde from '../assets/menu-verde.svg';
import mesasClara from '../assets/mesas-claro.svg'; //Mesas
import mesasVerde from '../assets/mesas-verde.svg'
import dashboardClaro from '../assets/dashboard-claro.svg'; //Dashboard
import dashboardVerde from '../assets/dashboard-verde.svg';
import cozinhaClara from '../assets/cozinha-clara.svg'; //Cozinha
import cozinhaVerde from '../assets/cozinha-verde.svg';
import barClaro from '../assets/bar-claro.svg'; //Bar
import barVerde from '../assets/bar-verde.svg';
import clienteClara from '../assets/cliente-clara.svg'; //Cliente
import clienteVerde from '../assets/cliente-verde.svg';

type MenuItem = 'Dashboard' | 'Clientes' | 'Produtos' | 'Mesas' | 'Cozinha' | 'Comandas' | 'Bar';

interface MenuIcons {
  active: string;
  inactive: string;
}

export default function Sidebar({ onSelect }: { onSelect: (value: string) => void }) {
  const [activeMenu, setActiveMenu] = useState<MenuItem>('Dashboard');
  const [loja, setLoja] = useState<any[]>([]);

  // Mapeamento dos ícones para cada item do menu
  const menuIcons: Record<MenuItem, MenuIcons> = {
    Dashboard: {
      active: dashboardVerde,
      inactive: dashboardClaro
    },
    Clientes: {
      active: clienteVerde,
      inactive: clienteClara
    },
    Produtos: {
      active: menuVerde,
      inactive: menuClaro
    },
    
    Mesas: {
      active: mesasVerde,
      inactive: mesasClara
    },
    Cozinha: {
      active: cozinhaVerde,
      inactive: cozinhaClara
    },
    Comandas: {
      active: comandasVerde,
      inactive: comandasClara
    },
    Bar: {
      active: barVerde,
      inactive: barClaro
    }
  };

  const menus: MenuItem[] = Object.keys(menuIcons) as MenuItem[];

  function formatCNPJ(cnpj: string) {
    cnpj = cnpj.replace(/\D/g, ""); 
    return cnpj.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5"
    );
  }

  function handleSelect(item: MenuItem) {
    setActiveMenu(item);
    onSelect(item);
  }

  useEffect(() => {
    const fetchLoja = async () => {
      const { data, error } = await supabase.from('loja').select('*');
      if (error) {
        console.error("Erro ao buscar loja", error);
      } else {
        setLoja(data || []);
      }
    };
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
              className={`cursor-pointer p-3 rounded hover:bg-gray-700 ${
                activeMenu === item ? 'bg-gray-700 font-bold' : ''
              }`}
            >
              <div className="flex items-center gap-[10px]">
                <img 
                  src={activeMenu === item ? menuIcons[item].active : menuIcons[item].inactive} 
                  alt={item} 
                  className="w-6 h-6 mr-3" 
                />
                {item}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}