import "../App.css";


export default function MainContent({ selected }: { selected: string }) {
  return (
    <div className="flex-1 p-6">
      <h2 className="font-sans">{selected}</h2>
      <p>Conteúdo da seção: {selected}</p>
    </div>
  );
}
