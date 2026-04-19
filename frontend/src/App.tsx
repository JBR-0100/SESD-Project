import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from './api';
import LoginOverlay from './components/LoginOverlay';
import Sidebar from './components/Sidebar';
import VehicleCard, { VehicleData } from './components/VehicleCard';
import BookingModal from './components/BookingModal';
import AddVehicleModal from './components/AddVehicleModal';
import EditVehicleModal from './components/EditVehicleModal';
import CustomerDirectory from './components/CustomerDirectory';
import { 
    Car, LayoutDashboard, Wrench, LogOut, Shield, User,
    RefreshCw, ChevronRight, Plus, Search, AlertCircle, Loader2, Sun, Moon, Users 
} from 'lucide-react';
import { AuthProvider } from './AuthContext';

function Dashboard() {
    const { user, token } = useAuth();
    const [vehicles, setVehicles] = useState<VehicleData[]>([]);
    const [view, setView] = useState<'fleet' | 'reserved' | 'customers'>('fleet');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<VehicleData | null>(null);
    const [reservations, setReservations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('ALL');
    const [search, setSearch] = useState('');
    const [bookingVehicle, setBookingVehicle] = useState<VehicleData | null>(null);
    const [theme, setTheme] = useState<'dark' | 'light'>(() => {
        return (localStorage.getItem('driveflow_theme') as 'dark' | 'light') || 'dark';
    });

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('driveflow_theme', newTheme);
    };

    const fetchReservations = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await api.get('/rentals/reserved');
            setReservations(res.data.data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch reservations');
        } finally {
            setLoading(false);
        }
    }, [token]);

    const fetchVehicles = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        setError('');
        try {
            const res = await api.get('/vehicles');
            setVehicles(res.data.data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch vehicles');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (view === 'fleet') fetchVehicles();
        else fetchReservations();
    }, [view, fetchVehicles, fetchReservations]);

    if (!user || !token) return <LoginOverlay />;

    // Filter and search
    const filteredVehicles = vehicles.filter(v => {
        const matchesFilter = filter === 'ALL' || v.state === filter || v.type === filter;
        const matchesSearch = search === '' ||
            `${v.make} ${v.model} ${v.licensePlate}`.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // Stats
    const stats = {
        total: vehicles.length,
        available: vehicles.filter(v => v.state === 'AVAILABLE').length,
        rented: vehicles.filter(v => v.state === 'RENTED').length,
        maintenance: vehicles.filter(v => v.state === 'MAINTENANCE').length,
    };

    const isDark = theme === 'dark';

    return (
        <div className={`flex h-screen transition-colors duration-300 ${isDark ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
            <Sidebar 
                onMaintenanceCheck={fetchVehicles} 
                onRefresh={view === 'fleet' ? fetchVehicles : fetchReservations} 
                onAddVehicle={() => setIsAddModalOpen(true)}
                currentView={view}
                onViewChange={setView}
                theme={theme} 
            />

            <main className="flex-1 overflow-y-auto">
                {/* Header */}
                <header className={`sticky top-0 z-10 backdrop-blur-lg border-b px-8 py-5 transition-colors duration-300 ${
                    isDark ? 'bg-slate-900/80 border-slate-800/80' : 'bg-white/80 border-slate-200'
                }`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {view === 'fleet' ? 'Fleet Overview' : 'Confirmed Reservations'}
                            </h2>
                            <p className="text-sm text-slate-400 mt-0.5">
                                {view === 'fleet' ? `${stats.total} total vehicles` : `${reservations.length} active bookings`}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Search */}
                            <div className="relative w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input type="text" placeholder="Search vehicles..." value={search} onChange={e => setSearch(e.target.value)}
                                    className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition ${
                                        isDark 
                                            ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-brand-500' 
                                            : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-brand-500 shadow-sm'
                                    }`} />
                            </div>

                            {/* Theme Toggle */}
                            <button onClick={toggleTheme} 
                                className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                                    isDark 
                                        ? 'bg-slate-800 border-slate-700 text-amber-400 hover:border-slate-500' 
                                        : 'bg-white border-slate-200 text-indigo-600 hover:border-slate-300 shadow-sm'
                                }`}>
                                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Quick stats and filters (only in fleet view) */}
                    {view === 'fleet' && (
                        <div className="flex gap-3 mt-4">
                            {[
                                { label: 'All', value: stats.total, filter: 'ALL', color: isDark ? 'text-white bg-slate-800 border-slate-700' : 'text-slate-900 bg-white border-slate-300' },
                                { label: 'Available', value: stats.available, filter: 'AVAILABLE', color: 'text-emerald-400 bg-emerald-950/50 border-emerald-800/40' },
                                { label: 'Rented', value: stats.rented, filter: 'RENTED', color: 'text-blue-400 bg-blue-950/50 border-blue-800/40' },
                                { label: 'Maintenance', value: stats.maintenance, filter: 'MAINTENANCE', color: 'text-amber-400 bg-amber-950/50 border-amber-800/40' },
                            ].map(s => (
                                <button key={s.filter} onClick={() => setFilter(f => f === s.filter ? 'ALL' : s.filter)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition ${
                                        filter === s.filter ? s.color : isDark ? 'text-slate-500 bg-slate-800/30 border-slate-700/50 hover:border-slate-600' : 'text-slate-500 bg-slate-100 border-slate-200 hover:border-slate-300'
                                        }`}>
                                    {s.label}
                                    <span className={`text-xs font-bold ${filter === s.filter ? '' : 'text-slate-600'}`}>{s.value}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </header>

                {/* Content */}
                <div className="px-8 py-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <AlertCircle className="w-12 h-12 text-red-400 mb-3" />
                            <p className="text-red-400 font-medium">{error}</p>
                            <button onClick={fetchVehicles} className="mt-3 text-sm text-brand-400 hover:text-brand-300">
                                Try again
                            </button>
                        </div>
                    ) : view === 'customers' ? (
                        <CustomerDirectory theme={theme} />
                    ) : view === 'fleet' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredVehicles.map(v => (
                                <VehicleCard 
                                    key={v.id} 
                                    vehicle={v} 
                                    onRefresh={fetchVehicles} 
                                    onBook={setBookingVehicle} 
                                    onEdit={setEditingVehicle}
                                    onRetire={fetchVehicles}
                                    theme={theme} 
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {reservations.map(res => (
                                <VehicleCard 
                                    key={res.contractId} 
                                    vehicle={{
                                        ...res.vehicle,
                                        id: res.vehicle.vehicleId,
                                        state: 'RESERVED' // Override for visual consistency in this view
                                    }} 
                                    onRefresh={fetchReservations} 
                                    onBook={() => {}} 
                                    theme={theme} 
                                    reservation={{
                                        customer: res.customer.firstName + ' ' + res.customer.lastName,
                                        startDate: res.startDate,
                                        endDate: res.endDate,
                                        total: res.totalAmount
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Booking Modal */}
            {bookingVehicle && (
                <BookingModal vehicle={bookingVehicle} onClose={() => setBookingVehicle(null)} onSuccess={fetchVehicles} theme={theme} />
            )}
            {/* Add Vehicle Modal */}
            {isAddModalOpen && (
                <AddVehicleModal onClose={() => setIsAddModalOpen(false)} onSuccess={fetchVehicles} theme={theme} />
            )}
            {/* Edit Vehicle Modal */}
            {editingVehicle && (
                <EditVehicleModal vehicle={editingVehicle} onClose={() => setEditingVehicle(null)} onSuccess={fetchVehicles} theme={theme} />
            )}
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <Dashboard />
        </AuthProvider>
    );
}
