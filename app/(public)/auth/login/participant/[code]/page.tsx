export default function ParticipantPage({
  params,
}: {
  params: { code: string };
}) {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Sesión {params.code}</h1>

      {/* aquí luego cargaremos cartas y votación */}
    </main>
  );
}
