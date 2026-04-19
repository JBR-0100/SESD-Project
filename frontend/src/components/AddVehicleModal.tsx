import React, { useState } from 'react';
import api from '../api';
import { X, Car, Zap, Truck, Plus, AlertCircle, Loader2 } from 'lucide-react';

interface AddVehicleModalProps {
    onClose: () => void;
    onSuccess: () => void;
    theme?: 'dark' | 'light';
}

const VEHICLE_TYPES = [
    { value: 'CAR', label: 'Sedan/Car', icon: Car },
    { value: 'ELECTRIC_VEHICLE', label: 'Electric', icon: Zap },
    { value: 'TRUCK', label: 'Heavy/Truck', icon: Truck },
];

export default function AddVehicleModal({ onClose, onSuccess, theme = 'dark' }: AddVehicleModalProps) {
    const isDark = theme === 'dark';
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [formData, setFormData] = useState({
        type: 'CAR',
        make: '',
        model: '',
        year: new Date().getFullYear(),
        licensePlate: '',
        dailyRate: 3500,
        mileageKm: 0,
        // Car specific
        numDoors: 4,
        transmission: 'Automatic',
        fuelType: 'Petrol',
        seatingCapacity: 5,
        // Truck specific
        payloadCapacityTons: 1.5,
        truckClass: 'Light Duty',
        hasRefrigeration: false,
        // EV specific
        batteryCapacityKwh: 75,
        rangeKm: 400,
        chargerType: 'Type 2',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as any;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as any).checked : 
                    type === 'number' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.dailyRate < 0) {
            setError('Daily rate cannot be negative');
            setLoading(false);
            return;
        }
        if (formData.mileageKm < 0) {
            setError('Initial mileage cannot be negative');
            setLoading(false);
            return;
        }

        try {
            await api.post('/vehicles', formData);
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to add vehicle');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className={`rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transition-all transform border ${
                isDark ? 'glass border-slate-700/50 shadow-2xl' : 'bg-white border-slate-200 shadow-2xl'
            }`} onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? 'border-slate-800/80' : 'border-slate-100'}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-600/20 rounded-xl flex items-center justify-center border border-brand-500/30">
                            <Plus className="w-5 h-5 text-brand-400" />
                        </div>
                        <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Add New Vehicle</h2>
                    </div>
                    <button onClick={onClose} className={`p-2 rounded-xl transition ${
                        isDark ? 'hover:bg-slate-800/80 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                    }`}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="flex items-center gap-2 text-red-400 bg-red-950/40 border border-red-900/50 rounded-lg px-4 py-2.5 text-sm font-medium">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Type Selector */}
                    <div className="grid grid-cols-3 gap-3">
                        {VEHICLE_TYPES.map(t => {
                            const Icon = t.icon;
                            return (
                                <button key={t.value} type="button" onClick={() => setFormData(p => ({ ...p, type: t.value }))}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition ${
                                        formData.type === t.value 
                                            ? 'bg-brand-600/15 border-brand-500/40 text-brand-400' 
                                            : isDark ? 'bg-slate-800/20 border-slate-700/50 text-slate-500 hover:border-slate-600' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                                    }`}>
                                    <Icon className="w-6 h-6" />
                                    <span className="text-xs font-semibold uppercase tracking-wider">{t.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Common Fields */}
                        <div className="space-y-4">
                            <div>
                                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Make</label>
                                <input name="make" value={formData.make} onChange={handleChange} required placeholder="e.g. Toyota"
                                    className={`w-full rounded-xl px-4 py-2.5 text-sm outline-none transition ${isDark ? 'bg-slate-800/50 border border-slate-700 text-white focus:border-brand-500' : 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-brand-500 shadow-sm'}`} />
                            </div>
                            <div>
                                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Model</label>
                                <input name="model" value={formData.model} onChange={handleChange} required placeholder="e.g. Camry"
                                    className={`w-full rounded-xl px-4 py-2.5 text-sm outline-none transition ${isDark ? 'bg-slate-800/50 border border-slate-700 text-white focus:border-brand-500' : 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-brand-500 shadow-sm'}`} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Year</label>
                                    <input type="number" name="year" value={formData.year} onChange={handleChange} required
                                        className={`w-full rounded-xl px-4 py-2.5 text-sm outline-none transition ${isDark ? 'bg-slate-800/50 border border-slate-700 text-white' : 'bg-slate-50 border border-slate-200 text-slate-900 shadow-sm'}`} />
                                </div>
                                <div>
                                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Plate</label>
                                    <input name="licensePlate" value={formData.licensePlate} onChange={handleChange} required placeholder="DF-001"
                                        className={`w-full rounded-xl px-4 py-2.5 text-sm outline-none transition ${isDark ? 'bg-slate-800/50 border border-slate-700 text-white' : 'bg-slate-50 border border-slate-200 text-slate-900 shadow-sm'}`} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Daily Rate (₹)</label>
                                <input type="number" name="dailyRate" value={formData.dailyRate} onChange={handleChange} required min="0"
                                    className={`w-full rounded-xl px-4 py-2.5 text-sm outline-none transition ${isDark ? 'bg-slate-800/50 border border-slate-700 text-white focus:border-brand-500' : 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-brand-500 shadow-sm'}`} />
                            </div>
                            <div>
                                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Initial Mileage (km)</label>
                                <input type="number" name="mileageKm" value={formData.mileageKm} onChange={handleChange} required min="0"
                                    className={`w-full rounded-xl px-4 py-2.5 text-sm outline-none transition ${isDark ? 'bg-slate-800/50 border border-slate-700 text-white' : 'bg-slate-50 border border-slate-200 text-slate-900 shadow-sm'}`} />
                            </div>

                            {/* Type Specific Sections */}
                            {formData.type === 'CAR' && (
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Doors</label>
                                        <input type="number" name="numDoors" value={formData.numDoors} onChange={handleChange}
                                            className={`w-full rounded-xl px-3 py-2 text-xs outline-none ${isDark ? 'bg-slate-800/50 text-white border-slate-700' : 'bg-slate-50 text-slate-900 border-slate-200 shadow-sm'}`} />
                                    </div>
                                    <div>
                                        <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Seating</label>
                                        <input type="number" name="seatingCapacity" value={formData.seatingCapacity} onChange={handleChange}
                                            className={`w-full rounded-xl px-3 py-2 text-xs outline-none ${isDark ? 'bg-slate-800/50 text-white border-slate-700' : 'bg-slate-50 text-slate-900 border-slate-200 shadow-sm'}`} />
                                    </div>
                                </div>
                            )}

                            {formData.type === 'ELECTRIC_VEHICLE' && (
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Battery (kWh)</label>
                                        <input type="number" name="batteryCapacityKwh" value={formData.batteryCapacityKwh} onChange={handleChange}
                                            className={`w-full rounded-xl px-3 py-2 text-xs outline-none ${isDark ? 'bg-slate-800/50 text-white border-slate-700' : 'bg-slate-50 text-slate-900 border-slate-200 shadow-sm'}`} />
                                    </div>
                                    <div>
                                        <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Range (km)</label>
                                        <input type="number" name="rangeKm" value={formData.rangeKm} onChange={handleChange}
                                            className={`w-full rounded-xl px-3 py-2 text-xs outline-none ${isDark ? 'bg-slate-800/50 text-white border-slate-700' : 'bg-slate-50 text-slate-900 border-slate-200 shadow-sm'}`} />
                                    </div>
                                </div>
                            )}

                            {formData.type === 'TRUCK' && (
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Payload (T)</label>
                                        <input type="number" name="payloadCapacityTons" value={formData.payloadCapacityTons} onChange={handleChange}
                                            className={`w-full rounded-xl px-3 py-2 text-xs outline-none ${isDark ? 'bg-slate-800/50 text-white border-slate-700' : 'bg-slate-50 text-slate-900 border-slate-200 shadow-sm'}`} />
                                    </div>
                                    <div className="flex items-end pb-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" name="hasRefrigeration" checked={formData.hasRefrigeration} onChange={handleChange}
                                                className="w-4 h-4 accent-brand-500" />
                                            <span className={`text-xs font-semibold uppercase ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Refrigerated?</span>
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-4">
                        <button type="submit" disabled={loading}
                            className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Vehicle & Add to Fleet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
