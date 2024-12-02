
export function CustomTooltip({ payload }: { payload: any }) {
  if (payload && payload.length) {
    return (
      <div style={{ padding: "10px", background: "var(--background)", border: "1px solid #ddd" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Total de agendamentos:</span>
          <span style={{ marginLeft: "8px", fontWeight: "bold" }}>{payload[0].value}</span>
        </div>
      </div>
    );
  }
  return null;
}
export function CustomValue({ payload }: { payload: any }) {
  if (payload && payload.length) {
    return (
      <div style={{ padding: "10px", background: "var(--background)", border: "1px solid #ddd" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Total de valor gerado no mês:</span>
          <span style={{ marginLeft: "8px", fontWeight: "bold" }}>{payload[0].value}</span>
        </div>
      </div>
    );
  }
  return null;
}
