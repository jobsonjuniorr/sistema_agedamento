"use client"

import { Bar, BarChart, CartesianGrid, Legend, XAxis } from "recharts"
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
    color: "#2563eb",
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

function Graphic() {
  const [chartData, setChartData] = useState<{ month: string; total: number; year: number, name: string, value: string }[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear()); // Ano selecionado
  const [selectedYearValue, setSelectedYearValue] = useState<number>(new Date().getFullYear()); // Ano selecionado
  const [filteredData, setFilteredData] = useState<{ month: string; total: number; year: number, name: string, value: string }[]>([]);
  const [filteredDataValue, setFilteredDataValue] = useState<{ month: string; total: number; year: number; monthIndex: number }[]>([]);
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

  useEffect(() => {
    // Filtrar os dados com base no ano selecionado
    const filteredChartData = chartData.filter((data) => data.year === selectedYear);
    const filteredChartDataValue = DadosValue.filter((data) => data.year === selectedYearValue)

    setFilteredData(filteredChartData);
    setFilteredDataValue(filteredChartDataValue)

  }, [selectedYear, chartData, events, selectedYearValue]);

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(event.target.value, 10));
  };

  const handleYearChangeValue = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYearValue(parseInt(event.target.value, 10));
  };

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
    total,

  }))

  const DadosValue = valuesByMonthArray
    .map(({ month, total }) => ({
      month,
      total,
      year: parseInt(month.split(" ")[1], 10), // Extrai o ano do texto do mês
      monthIndex: monthNames.findIndex((m) => m.toLowerCase() === month.split(" ")[0].toLowerCase()), // Encontra o índice do mês
    }))
    .sort((a, b) => (a.year !== b.year ? a.year - b.year : a.monthIndex - b.monthIndex))

  return (
    <div className="bg-background min-h-screen w-full p-4">
      <div className="flex flex-col gap-6">

        <div className="flex justify-center items-center gap-3">
          <h1 className="text-2xl font-bold text-text">Dashboard</h1>
          <Link className="text-button font-semibold hover:underline" to={"/calender"}>Calendário</Link>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          <div className="bg-card rounded-lg shadow-lg p-4 flex flex-col items-center justify-center h-60 md:h-full">
            <h2 className="text-xl font-medium text-text">
              Receita total
              <p className="font-bold text-2xl text-button">
                R$ {totalValue.toFixed(2)}
              </p>
            </h2>
          </div>
          <div className="bg-card rounded-lg shadow-lg md:p-4">
            <div className="flex justify-center">

            </div>
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className=" rounded-md  bg-input text-text w-1/4 h-10 text-center mb-1"
            >
              {[2023, 2024, 2025].map((year) => (
                <option key={year} value={year} >
                  {year}
                </option>
              ))}
            </select>
            <ChartContainer config={chartConfig} className="w-full h-[380px]" >
              <BarChart data={filteredData}>
                <text
                  x="50%"
                  y="6%"
                  textAnchor="middle"
                  fill="var(--text)"
                  fontSize="16"
                  fontWeight="bold"

                >
                  Total de agendamento do mês
                </text>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}

                  tickFormatter={(value, index) => {
                    const dataPoint = chartData[index];
                    if (!dataPoint) return value
                    return `${value.slice(0, 1)}`
                  }
                  }
                  tick={{ fill: 'var(--text)', fontWeight: 'bold', fontSize: 14 }}
                />
                <ChartTooltip content={<CustomTooltip payload={undefined} />} />
                <Bar dataKey="total" fill="var(--button)" radius={4}
                 isAnimationActive={true} animationBegin={0} animationDuration={1500} />
                <Legend
                  verticalAlign="top"
                  height={36}
                  wrapperStyle={{ top: 0, left: '10%', transform: 'translateX(-50%)' }}
                />
              </BarChart>
            </ChartContainer>
          </div>


          <div className="bg-card rounded-lg shadow-lg p-4 ">
            <h3 className="font-semibold text-text text-xl mb-2">Últimos cinco agendamentos realizados</h3>
            {latestEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0 border-borderText">
                <div className="flex flex-col ">
                  <p className="text-text font-medium ">{event.name}</p>
                  <p className="text-text font-sm ">{event.title}</p>
                </div>
                <p className="font-bold text-button">R$ {Number(event.value).toFixed(2)}</p>
              </div>
            ))}
          </div>

        </div>

        <div className="bg-card rounded-lg shadow-lg md:p-4">
          <select
            value={selectedYearValue}
            onChange={handleYearChangeValue}
            className=" rounded-md bg-input text-text w-1/4  md:w-1/12 h-10 text-center mb-1 "
          >
            {[2023, 2024, 2025].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <ChartContainer config={chartConfigValue} className="w-full .recharts-legend-item-text  h-[300px] ">
            <BarChart data={filteredDataValue}>
              <text
                x="50%"
                y="5%"
                textAnchor="middle"
                fill="var(--text)"
                fontSize="16"
                fontWeight="bold"

              >
                Receita gerada no mês
              </text>
              <CartesianGrid vertical={false} />
              <XAxis

                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                
                tickFormatter={(value, index) => {
                  const dataPoint = DadosValue[index];
                  if (!dataPoint) return value;
                  return `${value.slice(0, 1).toUpperCase()}`;
                }}
                tick={{ fill: 'var(--text)', fontWeight: 'bold', fontSize: 14 }}

              />
              <ChartTooltip  content={<CustomValue payload={undefined}   />} />
              <Bar dataKey="total" fill="var(--button)" radius={4}  isAnimationActive={true} animationBegin={0} animationDuration={1500}/>
             
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{ top: 0, left: '10%', transform: 'translateX(-50%)' }}
                
              />
            </BarChart>
          </ChartContainer>
        </div>
      </div>

    </div>

  )
}

export default Graphic
