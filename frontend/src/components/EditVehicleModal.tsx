import React, { useState, useEffect } from 'react';
import api from '../api';
import { X, Car, Zap, Truck, Edit3, AlertCircle, Loader2 } from 'lucide-react';
import { VehicleData } from './VehicleCard';

interface EditVehicleModalProps {
    vehicle: VehicleData;
    onClose: () => void;
    onSuccess: () => void;
    theme?: 'dark' | 'light';
}

const TYPE_ICONS: Record<string, any> = {
    CAR: Car,
    ELECTRIC_VEHICLE: Zap,
    TRUCK: Truck,
};

export default function EditVehicleModal({ vehicle, onClose, onSuccess, theme = 'dark' }: EditVehicleModalProps) {
    const isDark = theme === 'dark';
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [formData, setFormData] = useState({
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        licensePlate: vehicle.licensePlate,
        dailyRate: vehicle.dailyRate,
        mileageKm: vehicle.mileageKm,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
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
            setError('Mileage cannot be negative');
            setLoading(false);
            return;
        }

        try {
            await api.patch(`/vehicles/${vehicle.id}`, formData);
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to update vehicle');
        } finally {
            setLoading(false);
        }
    };

    const Icon = TYPE_ICONS[vehicle.type] || Car;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className={`rounded-2xl w-full max-w-xl transition-all transform border ${
                isDark ? 'glass border-slate-700/50 shadow-2xl' : 'bg-white border-slate-200 shadow-2xl'
            }`} onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? 'border-slate-800/80' : 'border-slate-100'}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
                            <Edit3 className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Edit Vehicle</h2>
                            <p className="text-xs text-slate-500">ID: {vehicle.id.slice(0, 8)}...</p>
                        </div>
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

                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/20 border border-slate-700/30 mb-2">
                        <div className="w-12 h-12 bg-brand-600/15 rounded-xl flex items-center justify-center text-brand-400 border border-brand-500/20">
                            <Icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{vehicle.type.replace('_', ' ')}</p>
                            <p className="text-xs text-slate-500">Fixed Property</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <div>
                                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Make</label>
                                <input name="make" value={formData.make} onChange={handleChange} required
                                    className={`w-full rounded-xl px-4 py-2.5 text-sm outline-none transition ${isDark ? 'bg-slate-800/50 border border-slate-700 text-white focus:border-indigo-500' : 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-indigo-500'}`} />
                            </div>
                            <div>
                                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Model</label>
                                <input name="model" value={formData.model} onChange={handleChange} required
                                    className={`w-full rounded-xl px-4 py-2.5 text-sm outline-none transition ${isDark ? 'bg-slate-800/50 border border-slate-700 text-white focus:border-indigo-500' : 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-indigo-500'}`} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Daily Rate (₹)</label>
                                <input type="number" name="dailyRate" value={formData.dailyRate} onChange={handleChange} required min="0"
                                    className={`w-full rounded-xl px-4 py-2.5 text-sm outline-none transition ${isDark ? 'bg-slate-800/50 border border-slate-700 text-white focus:border-indigo-500' : 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-indigo-500'}`} />
                            </div>
                            <div>
                                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Mileage (km)</label>
                                <input type="number" name="mileageKm" value={formData.mileageKm} onChange={handleChange} required min="0"
                                    className={`w-full rounded-xl px-4 py-2.5 text-sm outline-none transition ${isDark ? 'bg-slate-800/50 border border-slate-700 text-white focus:border-indigo-500' : 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-indigo-500'}`} />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={onClose}
                            className={`flex-1 font-bold py-3 px-4 rounded-xl transition ${isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                            Cancel
                        </button>
                        <button type="submit" disabled={loading}
                            className="flex-[2] bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
