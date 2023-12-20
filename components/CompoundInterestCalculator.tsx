'use client';
import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TitleComponentOption,
  ToolboxComponent,
  ToolboxComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
  LegendComponent,
  LegendComponentOption
} from 'echarts/components';
import { LineChart, LineSeriesOption } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart, PieSeriesOption } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout
]);

type EChartsOption = echarts.ComposeOption<
  | TitleComponentOption
  | TooltipComponentOption
  | LegendComponentOption
  | PieSeriesOption
  | TitleComponentOption
  | ToolboxComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
  | LineSeriesOption
>;

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from './ui/button';
import { Label } from "@/components/ui/label"
import { Separator } from './ui/separator';

interface YearlyBalance {
  year: number;
  startPrincipal: number;
  balance: number;
  interest: number;
  annualContribution: number;
  totalContributions: number;
}
interface TooltipParams {
  seriesName: string;
  name: string;
  value: number;
}


const CompoundInterestCalculator = () => {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(10);
  const [time, setTime] = useState(20);
  const [compoundingsPerYear, setCompoundingsPerYear] = useState(1);
  const [additionalContributions, setAdditionalContributions] = useState(0);
  const [contributionGrowthRate, setContributionGrowthRate] = useState(3.14);

  const [yearlyBalances, setYearlyBalances] = useState<YearlyBalance[]>([]);


  const interestChartRef = useRef<HTMLDivElement>(null);
  const breakdownChartRef = useRef(null);
  const [breakdownChart, setBreakdownChart] = useState<echarts.ECharts | null>(null);
  const [interestChart, setInterestChart] = useState<echarts.ECharts | null>(null);

  

  useEffect(() => {
    if (interestChartRef.current) {
      const chart = echarts.init(interestChartRef.current, null, {
        renderer: 'canvas',
        useDirtyRect: false
      });
      setInterestChart(chart);
    }
    if (breakdownChartRef.current) {
      const chart = echarts.init(breakdownChartRef.current, null, {
        renderer: 'canvas',
        useDirtyRect: false
      });
      setBreakdownChart(chart);
    }
    calculateInterest();
  }, []);

  useEffect(() => {
    if (interestChart && breakdownChart && yearlyBalances.length > 0) {
      var breakdownChartOptions = {
        title: {
          text: '',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params: TooltipParams) {
            return params.seriesName + '<br/>' + params.name + ': $' + params.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          }
        },
        grid: {
          containLabel: true
        },
        series: [
          {
            name: 'Breakdown',
            type: 'pie',
            radius: '70%',
            data: [
              { value:((Object.values(yearlyBalances).reduce((sum, obj) => sum + Number(obj.interest || 0), 0))), name: 'Interest' },
              { value: principal, name: 'Principal' },
              { value: Number(Object.values(yearlyBalances)[Object.values(yearlyBalances).length - 1].totalContributions), name: 'Contributions' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              normal: {
                textStyle: {
                  fontFamily: 'Arial',
                  fontSize: 14,
                  fontWeight: 'medium',
                  color: '#000000',
                  overflow: 'break',
                  containLabel: true,
                  left: 'center',
                }
              }
            }
            
            
          }
        ]
      };
      breakdownChart.setOption(breakdownChartOptions);
     
      var interestChartOptions = {
        color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
        title: {
          text: 'Balance Over Time'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['Line 1', 'Line 2']
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: Array.from({ length: time }, (_, i) => i + 1)
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Balance',
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(138, 238, 126)'
                },
                {
                  offset: 1,
                  color: 'rgb(96, 204, 83)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: yearlyBalances.map(item => item.balance)
          },
          {
            name: 'Contributions',
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            areaStyle: {
              opacity: 1,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(37, 43, 36)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: yearlyBalances.map(item => (Number(item.totalContributions) + (Number(Object.values(yearlyBalances)[0].startPrincipal))).toFixed(2))
          }
        ]
      };
      interestChart.setOption(interestChartOptions);
    }
  }, [interestChart, yearlyBalances, breakdownChart]);

  const calculateInterest = () => {
    let balances = [];
    let currentBalance = principal;
    let annualContribution = additionalContributions;
    let totalContributions = 0;
    let startPrincipal = principal;
  
    for (let year = 1; year <= time; year++) {
      let interestEarned = (currentBalance + annualContribution) * (rate / (100 * compoundingsPerYear));
      currentBalance += interestEarned + annualContribution;
      startPrincipal += annualContribution;
  
      totalContributions += annualContribution; // Add annual contribution to total
  
      balances.push({
        year: year,
        startPrincipal: parseFloat(startPrincipal.toFixed(2)),
        balance: parseFloat(currentBalance.toFixed(2)),
        interest: parseFloat(interestEarned.toFixed(2)),
        endPrincipal: parseFloat(currentBalance.toFixed(2)),
        annualContribution: parseFloat(annualContribution.toFixed(2)),
        totalContributions: parseFloat(totalContributions.toFixed(2))
      });
  
      annualContribution *= (1 + contributionGrowthRate / 100);
    }
  
    setYearlyBalances(balances);
  };
  
  
  return (
    <div className='mt-2'>
      <div className=' flex flex-col md:flex-row space-x-3'>
        <div className='flex flex-col w-full'>
          <Label className='mt-2 mb-1' htmlFor="Principal">Principal</Label>
          <Input type="text" placeholder="Principal" value={"$" + principal.toLocaleString()} onChange={(e) => {
            const numericValue = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
            if (!isNaN(numericValue)) {
              setPrincipal(numericValue);
            } else {
              setPrincipal(0);
            }
          }} />
          <Label className='mt-2 mb-1' htmlFor="Annual Interest Rate">Annual Interest Rate (%)</Label>
          <Input type="number" placeholder="Annual Interest Rate (%)" value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} />
          <Label className='mt-2 mb-1' htmlFor="Time">Time (Years)</Label>
          <Input type="number" placeholder="Time (years)" value={time} onChange={(e) => setTime(parseInt(e.target.value, 10))} />
          <Label className='mt-2 mb-1' htmlFor="Time">Compoundings per year</Label>
          <Input type="number" placeholder="Compoundings Per Year" value={compoundingsPerYear} onChange={(e) => setCompoundingsPerYear(parseInt(e.target.value, 10))} />

          <Separator className='mt-3 w-24 mx-auto' />

          <Label className='mt-2 mb-1'>Annual Contributions</Label>
          <Input type="text" placeholder="Additional Contributions" value={"$" + additionalContributions.toLocaleString()} onChange={(e) => {
            // Remove non-numeric characters and convert back to a number
            const numericValue = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
            if (!isNaN(numericValue)) {
              setAdditionalContributions(numericValue);
            } else {
              setAdditionalContributions(0);
            }
          }} />

          <div className='flex items-center mt-3 justify-center my-auto'>
            <Label className='mb-1' htmlFor="ContributionGrowthRate">Grow contributions by</Label>
            <div className='relative ml-2'>
              <Input 
              className='w-20 pl-2 pr-6' // existing classes
              type="number" 
              placeholder="%" 
              value={contributionGrowthRate} 
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value)) {
                  setContributionGrowthRate(value);
                }
              }}
              style={{
                WebkitAppearance: 'none',
                MozAppearance: 'textfield',
              }}
            />

              <span className='absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400'>
                %  {/* % symbol is placed inside the input field */}
              </span>
            </div>
            <Label className='ml-1'>Annually</Label>
          </div>


          <Button className='w-1/2 mx-auto mt-3' onClick={calculateInterest}>Calculate</Button>
        </div>
        <div className='flex w-full flex-col mt-2 '>
          <h2 className='bg-green-900 rounded-xl pl-2 py-1 text-white font-medium '>Results</h2>
          <div className='flex flex-col pl-2 space-y-1 pt-2'>
            <div className='flex flex-row'>
              <p className='font-bold mr-auto'>End Balance</p>
              <p className='font-bold'> 
                ${yearlyBalances.length > 0 ? 
                  Number(yearlyBalances[yearlyBalances.length - 1].balance).toLocaleString('en-US', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  }) : '0.00'} 
              </p>
            </div>
            <div className='flex flex-row'>
              <p className='mr-auto'>Starting Amount</p>
              <p> ${yearlyBalances.length > 0 ? Number(yearlyBalances[0].startPrincipal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'} </p>
            </div>
            <div className='flex flex-row'>
              <p className='mr-auto'>Contributions</p>
              <p> ${yearlyBalances.length > 0 ? Number(yearlyBalances[yearlyBalances.length - 1].totalContributions).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'} </p>
            </div>
            <div className='flex flex-row'>
              <p className=' mr-auto'>Total Interest</p>
              <p> ${ yearlyBalances.length > 0 && (Object.values(yearlyBalances).reduce((sum, obj) => sum + Number(obj.interest || 0), 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>
          <Separator className="mt-3 mb-2 w-24 mx-auto" />
          <p className='ml-2 font-bold mb-1 '>Breakdown</p>
          <div className='bg-gray-200 shadow-lg rounded-xl border-gray-600 mx-auto' ref={breakdownChartRef} style={{ width: '300px', height: '200px' }}></div>
        </div>
      </div>
      <div className='p-2 mt-2 text-center'>
        <div className='mx-auto justify-center text-center content-center flex' ref={interestChartRef} style={{ width: 'auto', height: '350px' }}></div>
      </div>
      <Table>
        <TableCaption>Annual Schedule</TableCaption>
        <TableHeader>
        <TableRow>
          <TableHead className='text-center'>Year</TableHead>
          <TableHead className='text-center'>Start Principal</TableHead>
          <TableHead className='text-center'>Start Balance</TableHead>
          <TableHead className='text-center'>Interest</TableHead>
          <TableHead className='text-center'>End Balance</TableHead>
          <TableHead className='text-center'>Contribution</TableHead>
          <TableHead className='text-center'>Total Contributions</TableHead>
        </TableRow>
        </TableHeader>
        <TableBody>
          {yearlyBalances.map((balanceData: YearlyBalance) => (
            <TableRow key={balanceData.year} className=' text-center' >
              <TableCell className='text-center'>{balanceData.year}</TableCell>
              <TableCell className='text-center'>${Number(balanceData.startPrincipal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
              <TableCell className='text-center'>${Number(balanceData.balance - balanceData.interest).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
              <TableCell className='text-center'>${Number(balanceData.interest).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
              <TableCell className='text-center'>${Number(balanceData.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
              <TableCell className='text-center'>${Number(balanceData.annualContribution).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
              <TableCell className='text-center'>${Number(balanceData.totalContributions).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
            </TableRow>
          ))}
        </TableBody>

      </Table>
    </div>
);
};

export default CompoundInterestCalculator;
