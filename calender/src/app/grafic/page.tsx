"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { CustomTooltip, CustomValue } from "@/components/ui/labelgraficinfos";
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const chartConfig = {
  total: {
    label: "Total de agendamentos:",
    color: "#2563eb",
  },
} satisfies ChartConfig;

const chartConfigValue = {
  total: {
    label: "Total gerado no mês:",
    color: "#2563eb"
  },
} satisfies ChartConfig;



const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio",
  "Junho", "Julho", "Agosto", "Setembro", "Outubro",
  "Novembro", "Dezembro",
]

const convertToChartData = (data: { mes: string; total: number, name: string, value: string }[]) => {
  return data.map(({ mes, total, name, value }) => {
    const [year, month] = mes.split("-");
    return {
      year: parseInt(year, 10),
      month: monthNames[parseInt(month, 10) - 1],
      total,
      name,
      value
    };
  });
};

{/* 
  const formatDate = (date: string) => {
  if (!date) return "Não encontrado"
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date))
}
  */}
//foram de utiliza está funcunção quando fiz o chamdo do formatDate() passe o paramentros 
type Event = {
  title: string;
  start: string;
  end: string;
  value: string;
  name: string;
}

function Grafic() {
  const [chartData, setChartData] = useState<{ month: string; total: number; year: number, name: string, value: string }[]>([])
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


  const latestEvents = events.slice(-5).reverse()

  const totalValue = events.reduce((acc, event) => acc + parseFloat(event.value || "0"), 0);
  const valuesMonthe = events.reduce((acc, event) => {
    const date = new Date(event.start)
    const montheYear = `${date.toLocaleString("pt-BR", { month: "long" })} ${date.getFullYear()}`
    const value = parseFloat(event.value || '0')
    if (!acc[montheYear]) {
      acc[montheYear] = 0
    }
    acc[montheYear] += value;
    return acc
  }, {} as Record<string, number>)
  const valuesByMonthArray = Object.entries(valuesMonthe).map(([month, total]) => ({
    month,
    total
  }))

  const DadosValue = valuesByMonthArray.map(({ month, total }) => ({
    month, // Nome do mês
    total, // Valor total gerado
    year: new Date().getFullYear(), // Adiciona o ano atual (opcional)
  }));


  return (
    <div className="bg-background h-screen w-full">

      <div>
        <p className="text-lg">
          <Link to={"/calender"}>Calendário</Link>
        </p>
      </div>

      <div className="flex flex-col items-center justify-center">
        <h2>Total Gerado: {totalValue.toFixed(2)}</h2>
        <ChartContainer config={chartConfig} className="h-[200px]  w-full bg-card rounded-md border-none" >
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value, index) => {
                const dataPoint = chartData[index];
                if (!dataPoint) return value
                return `${value.slice(0, 3)} ${dataPoint.year}`
              }
              }
            />
            <ChartTooltip content={<CustomTooltip payload={undefined} />} />
            <Bar dataKey="total" fill="var(--button)" radius={4} />
          </BarChart>
        </ChartContainer>

        <div className="flex w-full flex-col md:flex-col xl:flex-row items-center justify-center gap-4 p-4">
          <ChartContainer config={chartConfigValue} className="w-full h-[300px] md:w-11/12 xl:w-2/4 bg-card rounded-md border-none p-2">
            <BarChart data={DadosValue}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value, index) => {
                  const dataPoint = DadosValue[index];
                  if (!dataPoint) return value;
                  return `${value.slice(0, 3)}`;
                }}
              />
              <ChartTooltip content={<CustomValue payload={undefined} />} />
              <Bar dataKey="total" fill="var(--button)" radius={4} />
            </BarChart>
          </ChartContainer>

          <div className="w-full md:w-11/12  xl:w-2/4  h-[300px] bg-card rounded-md p-2 ">
            <h3 className="font-semibold text-text text-base mb-2">Últimos cinco agendamentos realizados</h3>
            {latestEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between border-b-2 border-borderText">
                <div className="flex flex-col ">
                <p>{event.name}</p>
                <p>{event.title}</p>
                </div>
                <p className="font-bold text-base text-text">R${event.value}</p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/*
      <div>
        <h2>Total gerando por mes:</h2>
        {valuesByMonthArray.map(({ month, total }, index) => (
          <div key={index}>
            <strong>{month}:</strong> R$: {total.toFixed(2)}
          </div>
        ))}
      </div> 
    */}


    </div>

  )
}

export default Grafic
