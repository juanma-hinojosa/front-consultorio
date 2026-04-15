import ConsultaItem from "./ConsultaItem";

export default function ConsultaList({ consultas, onDelete, onEdit, user }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {consultas.map((c) => (
        <ConsultaItem
          key={c._id}
          consulta={c}
          onDelete={onDelete}
          onEdit={onEdit}
          user={user}
        />
      ))}
    </div>
  );
}