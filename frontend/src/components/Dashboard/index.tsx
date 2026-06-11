// components/Dashboard1Content.tsx
import React, { useState } from 'react';
import {
    MoreHorizontal,
    ShoppingBag,
    TrendingDown,
    Wallet,
    CreditCard,
    ArrowUpRight,
    SlidersHorizontal,
    Search,
    ChevronDown,
} from 'lucide-react';

const transactionsData = [
    { month: 'Jan', value: 12000, active: false },
    { month: 'Feb', value: 16000, active: false },
    { month: 'Mar', value: 14000, active: false },
    { month: 'Apr', value: 24000, active: false },
    { month: 'May', value: 28000, active: false },
    { month: 'Jun', value: 38000, active: true, label: '$24,000' },
    { month: 'Jul', value: 30000, active: true, label: '$22,430' },
    { month: 'Aug', value: 22000, active: false },
    { month: 'Sep', value: 18000, active: false },
    { month: 'Oct', value: 18000, active: false },
    { month: 'Nov', value: 15000, active: false },
    { month: 'Dec', value: 10000, active: false },
];

const ordersData = [
    { id: 'INV_000076', price: '$25,500', date: '17 Apr, 2026', time: '10:30 PM', status: 'Completed' },
    { id: 'INV_000075', price: '$32,750', date: '15 Apr, 2026', time: '9:45 PM', status: 'Pending' },
    { id: 'INV_000073', price: '$15,900', date: '10 Apr, 2026', time: '11:48 PM', status: 'Completed' },
];

export default function Dashboard() {
    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

    const toggleOrderSelection = (id: string) => {
        setSelectedOrders(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    return (
        <div className="px-4 pb-8 max-w-[1600px] w-full mx-auto flex flex-col gap-6 font-sans">
            {/* Top Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Earnings */}
                <div className="bg-white rounded-[24px] p-6 border border-surface-100 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-[13px] font-medium text-surface-500 mb-2">Earnings</p>
                        <div className="flex items-baseline gap-1">
                            <h3 className="text-3xl font-bold text-surface-800">$5,567</h3>
                            <span className="text-surface-400 font-medium">.00</span>
                        </div>
                        <p className="text-[11px] text-surface-400 mt-4">Last month: $4,545.00</p>
                    </div>
                    <div className="w-10 h-10 bg-primary-500 rounded-[14px] flex items-center justify-center text-white shadow-md shadow-primary-200">
                        <ShoppingBag size={18} />
                    </div>
                </div>

                {/* Spending */}
                <div className="bg-white rounded-[24px] p-6 border border-surface-100 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-[13px] font-medium text-surface-500 mb-2">Spending</p>
                        <div className="flex items-baseline gap-1">
                            <h3 className="text-3xl font-bold text-surface-800">$3,533</h3>
                            <span className="text-surface-400 font-medium">.00</span>
                        </div>
                        <p className="text-[11px] text-surface-400 mt-4">Last month: $3,243.00</p>
                    </div>
                    <div className="w-10 h-10 bg-accent-green rounded-[14px] flex items-center justify-center text-white shadow-md shadow-accent-green/30">
                        <TrendingDown size={18} />
                    </div>
                </div>

                {/* Savings */}
                <div className="bg-white rounded-[24px] p-6 border border-surface-100 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-[13px] font-medium text-surface-500 mb-2">Savings</p>
                        <div className="flex items-baseline gap-1">
                            <h3 className="text-3xl font-bold text-surface-800">$2,324</h3>
                            <span className="text-surface-400 font-medium">.00</span>
                        </div>
                        <p className="text-[11px] text-surface-400 mt-4">Last month: $2,232.00</p>
                    </div>
                    <div className="w-10 h-10 bg-accent-orange rounded-[14px] flex items-center justify-center text-white shadow-md shadow-accent-orange/30">
                        <Wallet size={18} />
                    </div>
                </div>
            </div>

            {/* Middle Row (Charts) */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Transactions Overview Graph */}
                <div className="bg-white rounded-[24px] p-6 border border-surface-100 shadow-sm xl:col-span-2">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
                        <div>
                            <p className="text-[15px] font-medium text-surface-500 mb-1">Transactions Overview</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-surface-800">$4,235</span>
                                <span className="text-surface-500 font-medium">.00</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3 text-[11px] font-medium">
                                <span className="flex items-center gap-1.5 text-surface-600">
                                    <span className="w-2 h-2 rounded-full bg-primary-500"></span> Total Transaction
                                </span>
                                <span className="flex items-center gap-1.5 text-surface-400">
                                    <span className="w-2 h-2 rounded-full bg-surface-200"></span> Earning
                                </span>
                            </div>
                            <button className="flex items-center gap-1.5 border border-surface-200 px-3 py-1.5 rounded-xl text-[12px] font-medium text-surface-600 hover:bg-surface-50">
                                <span>This Year</span>
                                <ChevronDown size={14} className="text-surface-400" />
                            </button>
                        </div>
                    </div>

                    <div className="relative h-56 w-full flex">
                        {/* Y-Axis */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                            {['40k', '30k', '20k', '10k', '0k'].map((label, i) => (
                                <div key={i} className="flex items-center w-full">
                                    <span className="w-8 text-[11px] font-medium text-surface-400 -mt-2">{label}</span>
                                    {label !== '0k' && <div className="flex-1 border-b border-dashed border-surface-200 ml-2"></div>}
                                </div>
                            ))}
                        </div>
                        {/* Bars */}
                        <div className="flex-1 ml-10 flex items-end justify-between relative z-10 h-[calc(100%-8px)]">
                            {transactionsData.map((data, i) => (
                                <div key={i} className="flex flex-col items-center group relative h-full justify-end flex-1">
                                    {data.active && (
                                        <div className="absolute bottom-full mb-2 bg-primary-500 text-white text-[10px] font-semibold px-2 py-1 rounded shadow-sm whitespace-nowrap">
                                            {data.label}
                                        </div>
                                    )}
                                    <div
                                        className={`w-3 sm:w-5 md:w-8 rounded-t-lg transition-all ${data.active ? 'bg-primary-500' : 'opacity-80'}`}
                                        style={{
                                            height: `${(data.value / 40000) * 100}%`,
                                            ...(!data.active ? { backgroundImage: 'repeating-linear-gradient(-45deg, var(--color-surface-100), var(--color-surface-100) 4px, var(--color-surface-200) 4px, var(--color-surface-200) 8px)' } : {})
                                        }}
                                    ></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* X-Axis */}
                    <div className="flex justify-between ml-10 mt-3 text-[11px] font-medium text-surface-400">
                        {transactionsData.map((data, i) => (
                            <span key={i} className={`w-full text-center ${data.active ? 'text-primary-600 font-semibold' : ''}`}>{data.month}</span>
                        ))}
                    </div>
                </div>

                {/* Spending Overview Progress */}
                <div className="bg-white rounded-[24px] p-6 border border-surface-100 shadow-sm flex flex-col justify-between xl:col-span-1">
                    <div>
                        <div className="flex items-center gap-2 text-surface-700 font-medium text-[15px] mb-4">
                            <div className="p-1 border border-surface-200 rounded-lg">
                                <CreditCard size={16} className="text-surface-500" />
                            </div>
                            <span>Spending Overview</span>
                        </div>

                        <div className="mb-4">
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold text-surface-800">$24,678</h3>
                                <span className="text-surface-500 font-medium text-lg">.20</span>
                                <span className="text-accent-green text-[10px] bg-accent-green/10 px-1.5 py-0.5 rounded flex items-center ml-2 font-semibold">
                                    <ArrowUpRight size={10} className="mr-0.5" /> 4.9%
                                </span>
                            </div>
                            <p className="text-[12px] text-surface-400 mt-1">From $30,000.00</p>
                        </div>

                        {/* Segmented Progress Bar */}
                        <div className="w-full h-3.5 flex gap-1 my-8">
                            <div className="bg-primary-500 h-full w-[55%] rounded-l-full relative shadow-sm">
                                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/30"></div>
                            </div>
                            <div className="bg-accent-teal h-full w-[25%] rounded-r-sm relative"></div>
                            <div className="bg-surface-200 h-full w-[20%] rounded-r-full" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)' }}></div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-3 text-surface-600">
                                    <span className="w-3.5 h-3.5 rounded bg-primary-500"></span> House Rents
                                </div>
                                <span className="font-bold text-surface-800">$2,098.00</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-3 text-surface-600">
                                    <span className="w-3.5 h-3.5 rounded bg-accent-teal"></span> Subscription
                                </div>
                                <span className="font-bold text-surface-800">$1,345.00</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-3 text-surface-600">
                                    <span className="w-3.5 h-3.5 rounded bg-surface-200"></span> Others
                                </div>
                                <span className="font-bold text-surface-800">$789.00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Card Details */}
                <div className="bg-white rounded-[24px] p-6 border border-surface-100 shadow-sm xl:col-span-1">
                    <p className="text-[15px] font-medium text-surface-500 mb-4">Card Details</p>

                    {/* Credit Card Graphic */}
                    <div className="w-full bg-primary-600 rounded-[20px] p-5 text-white relative overflow-hidden mb-8 shadow-lg shadow-primary-200">
                        <div className="absolute -right-4 -top-8 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
                        <div className="absolute right-8 bottom-0 w-32 h-32 rounded-full bg-white/5"></div>
                        <div className="absolute left-0 top-1/2 w-16 h-16 rounded-full bg-primary-400/30 blur-2xl"></div>

                        <div className="flex gap-3 items-center mb-6 relative z-10">
                            <div className="w-10 h-7 bg-white/20 backdrop-blur-sm rounded flex items-center justify-center p-1">
                                <div className="w-full h-full bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-sm opacity-80"></div>
                            </div>
                            <div>
                                <p className="text-[10px] text-primary-100/80 uppercase tracking-wider mb-0.5">Sajibur Rahman</p>
                                <p className="text-lg font-bold tracking-wider leading-none">$738,738.00</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-end relative z-10 mt-8">
                            <div>
                                <p className="text-[9px] text-primary-200/80 mb-1">Card Number</p>
                                <p className="font-mono text-[13px] tracking-widest">6263 7678 6226 0880</p>
                            </div>
                            <div>
                                <p className="text-[9px] text-primary-200/80 mb-1">Expire Date</p>
                                <p className="font-mono text-[13px]">09/29</p>
                            </div>
                            <div>
                                <p className="text-[9px] text-primary-200/80 mb-1">CVV</p>
                                <p className="font-mono text-[13px]">999</p>
                            </div>
                        </div>
                    </div>

                    {/* Daily Transaction Limit */}
                    <div>
                        <p className="text-[12px] font-medium text-surface-500 mb-3">Daily Transaction Limit</p>
                        <div className="flex gap-1 mb-3">
                            {Array.from({ length: 24 }).map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`h-5 flex-1 rounded-sm ${idx < 6 ? 'bg-primary-500' : 'bg-surface-100'}`}
                                ></div>
                            ))}
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-[13px] font-bold text-surface-800">
                                $2,678.89 <span className="text-[12px] font-medium text-surface-400">of $6,000.00</span>
                            </p>
                            <span className="text-[13px] font-bold text-surface-400">24%</span>
                        </div>
                    </div>
                </div>

                {/* Recent Orders Table */}
                <div className="bg-white rounded-[24px] p-6 border border-surface-100 shadow-sm xl:col-span-2 flex flex-col">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <h4 className="text-[16px] font-semibold text-surface-800">Recent orders</h4>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={14} />
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="bg-surface-50 border border-surface-100 rounded-full pl-9 pr-4 py-2 text-[12px] focus:outline-none w-full sm:w-48"
                                />
                            </div>
                            <button className="flex items-center gap-2 bg-surface-50 border border-surface-100 rounded-full px-4 py-2 text-[12px] font-medium text-surface-600">
                                <SlidersHorizontal size={12} />
                                <span>Sort by</span>
                                <ChevronDown size={12} />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto no-scrollbar flex-1 -mx-6 px-6">
                        <table className="w-full text-left min-w-[600px] border-separate border-spacing-y-2">
                            <thead>
                                <tr className="text-surface-400 text-[12px] font-medium">
                                    <th className="px-4 pb-2 w-10">
                                        <input type="checkbox" className="rounded border-surface-300 text-primary-500 focus:ring-primary-500 cursor-pointer" />
                                    </th>
                                    <th className="px-4 pb-2 font-medium">Order ID</th>
                                    <th className="px-4 pb-2 font-medium">Price</th>
                                    <th className="px-4 pb-2 font-medium">Date</th>
                                    <th className="px-4 pb-2 font-medium">Date</th> {/* Time column */}
                                    <th className="px-4 pb-2 font-medium">Status</th>
                                    <th className="px-4 pb-2"></th>
                                </tr>
                            </thead>
                            <tbody className="text-[13px]">
                                {ordersData.map((order) => (
                                    <tr key={order.id} className="bg-surface-50 hover:bg-surface-100 transition-colors rounded-xl group">
                                        <td className="px-4 py-3 rounded-l-xl">
                                            <input
                                                type="checkbox"
                                                checked={selectedOrders.includes(order.id)}
                                                onChange={() => toggleOrderSelection(order.id)}
                                                className="rounded border-surface-300 text-primary-500 focus:ring-primary-500 cursor-pointer bg-white"
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-surface-600 font-medium">{order.id}</td>
                                        <td className="px-4 py-3 text-surface-800 font-semibold">{order.price}</td>
                                        <td className="px-4 py-3 text-surface-500">{order.date}</td>
                                        <td className="px-4 py-3 text-surface-500">{order.time}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5 font-medium">
                                                <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'Completed' ? 'bg-accent-green' : 'bg-red-500'}`}></span>
                                                <span className="text-surface-600">{order.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 rounded-r-xl text-surface-400 text-right cursor-pointer">
                                            <MoreHorizontal size={16} className="inline-block" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
