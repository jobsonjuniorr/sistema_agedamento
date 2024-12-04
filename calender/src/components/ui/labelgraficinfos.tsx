export function CustomTooltip({ payload }: { payload: any }) {
  if (payload && payload.length) {
    const dataPoint = payload[0].payload; // Obtemos os dados do ponto
    return (
      <div className="p-3 bg-background"
      >
        <div className="flex justify-between">
          <span>Total de agendamentos:</span>
          <span className="ml-2 font-bold text-button">
            {payload[0].value}
          </span>
        </div>
        <div>
          <span>
            Mês: <strong className="text-button">{dataPoint.month}</strong>
          </span>
        </div>
        <div>
          <span>
            Ano: <strong className="text-button">{dataPoint.year}</strong>
          </span>
        </div>
      </div>
    );
  }
  return null;
}

export function CustomValue({ payload }: { payload: any }) {
  if (payload && payload.length) {
    const dataPoint = payload[0].payload; // Obtemos os dados do ponto
    return (
      <div
        className="p-3 bg-background"
      >
        <div className="flex justify-between">
          <span>Total de valor gerado no mês:</span>
          <span className="ml-2 font-bold text-button">
            {payload[0].value}
          </span>
        </div>
        <div>
          <span>
            Mês: <strong className="text-button">{dataPoint.month}</strong>
          </span>
        </div>
        <div>
          <span>
            Ano: <strong className="text-button">{dataPoint.year}</strong>
          </span>
        </div>
      </div>
    );
  }
  return null;
}
