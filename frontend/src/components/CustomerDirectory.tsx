import React, { useState, useEffect } from 'react';
import api from '../api';
import { Users, Mail, Phone, Award, Shield, AlertCircle, Loader2, Search, UserCheck } from 'lucide-react';

interface CustomerData {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    tier: string;
    points: number;
    isBlocked: boolean;
    role: string;
}

interface CustomerDirectoryProps {
    theme?: 'dark' | 'light';
}

export default function CustomerDirectory({ theme = 'dark' }: CustomerDirectoryProps) {
    const isDark = theme === 'dark';
    const [customers, setCustomers] = useState<CustomerData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await api.get('/customers');
                setCustomers(res.data.data);
            } catch (err: any) {
                setError(err.response?.data?.error || 'Failed to fetch customers');
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    const filteredCustomers = customers.filter(c => 
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-600/20 rounded-2xl flex items-center justify-center border border-brand-500/30">
                        <Users className="w-6 h-6 text-brand-400" />
                    </div>
                    <div>
                        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Customer Directory</h2>
                        <p className="text-sm text-slate-400 mt-0.5">{customers.length} registered users</p>
                    </div>
                </div>

                <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="text" placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)}
                        className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition ${
                            isDark 
                                ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-brand-500' 
                                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-brand-500 shadow-sm'
                        }`} />
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 text-red-400 bg-red-950/40 border border-red-900/50 rounded-lg px-4 py-2.5 text-sm font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                </div>
            )}

            <div className={`rounded-2xl border overflow-hidden ${isDark ? 'glass border-slate-800/50' : 'bg-white border-slate-200 shadow-xl'}`}>
                <table className="w-full text-left">
                    <thead>
                        <tr className={`border-b text-xs font-bold uppercase tracking-wider ${isDark ? 'border-slate-800/50 text-slate-500 bg-slate-800/20' : 'border-slate-100 text-slate-400 bg-slate-50'}`}>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Contact</th>
                            <th className="px-6 py-4">Loyalty Tier</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-slate-800/50' : 'divide-slate-100'}`}>
                        {filteredCustomers.map(c => (
                            <tr key={c.id} className={`transition ${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}`}>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                                            {c.firstName[0]}{c.lastName[0]}
                                        </div>
                                        <div>
                                            <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{c.firstName} {c.lastName}</p>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <Shield className="w-3 h-3 text-slate-500" />
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{c.role}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <Mail className="w-3 h-3" /> {c.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <Phone className="w-3 h-3" /> 555-0123
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        <div className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 ${
                                            c.tier === 'PLATINUM' ? 'text-indigo-400 bg-indigo-950/40 border-indigo-500/30' :
                                            c.tier === 'GOLD' ? 'text-amber-400 bg-amber-950/40 border-amber-500/30' :
                                            'text-slate-400 bg-slate-800/40 border-slate-700/50'
                                        }`}>
                                            <Award className="w-3 h-3" /> {c.tier}
                                        </div>
                                        <span className="text-xs font-medium text-slate-500">{c.points.toLocaleString()} pts</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    {c.isBlocked ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-950/40 text-red-400 border border-red-900/30">
                                            Blocked
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/40 text-emerald-400 border border-emerald-900/30">
                                            Active
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredCustomers.length === 0 && (
                   <div className="py-20 text-center">
                        <UserCheck className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium">No customers found</p>
                   </div>
                )}
            </div>
        </div>
    );
}
