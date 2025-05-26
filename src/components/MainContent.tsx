export default function MainContent({ selected }: { selected: string }) {
  return (
    <div className="flex-1 p-6">
      <h2 className="text-3xl font-bold mb-4">{selected}</h2>
      <p>Conteúdo da seção: {selected}</p>
    </div>
  );
}
