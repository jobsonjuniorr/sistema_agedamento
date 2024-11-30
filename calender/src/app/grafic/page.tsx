"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { CustomTooltip } from "@/components/ui/labelhover"
import { useEffect, useState } from "react"

const chartConfig = {
  total: {
    label: "Total de agendamentos:",
    color: "#2563eb",
  },
} satisfies ChartConfig

const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", 
  "Junho", "Julho", "Agosto", "Setembro", "Outubro", 
  "Novembro", "Dezembro",
]

const convertToChartData = (data: { mes: string; total: number }[]) => {
  return data.map(({ mes, total }) => {
    const [year, month] = mes.split("-");
    return {
      year: parseInt(year, 10), 
      month: monthNames[parseInt(month, 10) - 1],
      total,
    };
  });
};

const formatDate = (date: string) => {
  if (!date) return "Não encontrado"
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date))
}

type Event = {
  title: string;
  start: string;
  end: string;
}

function Grafic() {
  const [chartData, setChartData] = useState<{ month: string; total: number; year : number }[]>([])
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const [agendamentosResponse, eventosResponse] = await Promise.all([
          fetch("http://localhost:5000/agendametos"),
          fetch("http://localhost:5000/dadosgrafic")
        ])

        const agendamentosData = await agendamentosResponse.json()
        const eventosData = await eventosResponse.json()

        setChartData(convertToChartData(agendamentosData))
        setEvents(eventosData)

      } catch (error) {
        console.error("Erro ao buscar os dados", error)
      }
    }

    fetchData()
  }, [])


  const latestEvents = events.slice(-3).reverse()

  return (
    <div>
      <ChartContainer config={chartConfig} className="h-[200px] w-96 bg-card">
        <BarChart data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value, index) =>{const dataPoint = chartData[index];
              if(!dataPoint) return value
              return `${value.slice(0,3)} ${dataPoint.year}`}
            }
          />
          <ChartTooltip content={<CustomTooltip payload={undefined} />} />
          <Bar dataKey="total" fill="var(--button)" radius={4} />
        </BarChart>
      </ChartContainer>

      {latestEvents.map((event, index) => (
        <div key={index} className="flex gap-3">
          <div className="flex gap-5">
            <h3>{event.title}</h3>
            <p>Início: {formatDate(event.start)}</p>
            <p>Fim: {formatDate(event.end)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Grafic
