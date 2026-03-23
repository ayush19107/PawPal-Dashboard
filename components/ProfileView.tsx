
import React, { useState } from 'react';
import { PetProfile } from '../types';

interface ProfileViewProps {
  profiles: PetProfile[];
  activeProfileId: string;
  onAddPet: (pet: PetProfile) => void;
  onUpdatePet: (pet: PetProfile) => void;
  onDeletePet: (id: string) => void;
  onSwitchPet: (id: string) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profiles, activeProfileId, onAddPet, onUpdatePet, onDeletePet, onSwitchPet }) => {
  const [editingPetId, setEditingPetId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [formData, setFormData] = useState<Partial<PetProfile>>({});

  const startEditing = (p: PetProfile) => {
    setEditingPetId(p.id);
    setFormData(p);
  };

  const startAdding = () => {
    setIsAdding(true);
    setFormData({
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      species: 'Dog',
      breed: '',
      age: 1,
      weight: 10,
      avatar: `https://picsum.photos/seed/${Math.random()}/200`,
      healthNotes: ''
    });
  };

  const save = () => {
    if (isAdding) {
      onAddPet(formData as PetProfile);
      setIsAdding(false);
    } else if (editingPetId) {
      onUpdatePet(formData as PetProfile);
      setEditingPetId(null);
    }
  };

  const cancel = () => {
    setEditingPetId(null);
    setIsAdding(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-800">Pet Profiles</h2>
        <button 
          onClick={startAdding}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-100 transition-all active:scale-95"
        >
          <i className="fa-solid fa-plus"></i>
          Add New Pet
        </button>
      </div>

      {(isAdding || editingPetId) && (
        <div className="bg-white rounded-3xl shadow-xl border border-indigo-100 overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-800">
              {isAdding ? 'Add New Family Member' : `Edit ${formData.name}'s Profile`}
            </h3>
            <button onClick={cancel} className="text-slate-400 hover:text-slate-600">
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g. Max"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Species</label>
                  <select 
                    value={formData.species}
                    onChange={e => setFormData({...formData, species: e.target.value as any})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:border-indigo-500 outline-none"
                  >
                    <option>Dog</option>
                    <option>Cat</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Breed</label>
                  <input 
                    type="text" 
                    value={formData.breed}
                    onChange={e => setFormData({...formData, breed: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:border-indigo-500 outline-none"
                    placeholder="e.g. Beagle"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Age (Years)</label>
                  <input 
                    type="number" 
                    value={formData.age}
                    onChange={e => setFormData({...formData, age: Number(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Weight (kg)</label>
                  <input 
                    type="number" 
                    value={formData.weight}
                    onChange={e => setFormData({...formData, weight: Number(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Health Notes</label>
                <textarea 
                  value={formData.healthNotes}
                  onChange={e => setFormData({...formData, healthNotes: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:border-indigo-500 outline-none min-h-[150px] resize-none"
                  placeholder="Enter medical history, allergies, or special care instructions..."
                ></textarea>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={save}
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                  {isAdding ? 'Register Pet' : 'Save Changes'}
                </button>
                <button 
                  onClick={cancel}
                  className="px-8 py-4 bg-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map(pet => (
          <div 
            key={pet.id} 
            className={`bg-white rounded-[2rem] p-6 shadow-sm border-2 transition-all group relative ${
              activeProfileId === pet.id ? 'border-indigo-500 ring-4 ring-indigo-500/5' : 'border-slate-100 hover:border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <img src={pet.avatar} alt={pet.name} className="w-20 h-20 rounded-[1.5rem] object-cover shadow-lg group-hover:scale-105 transition-transform" />
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => startEditing(pet)} className="w-8 h-8 bg-slate-100 text-slate-500 rounded-lg hover:bg-indigo-100 hover:text-indigo-600 transition-colors">
                  <i className="fa-solid fa-pencil text-xs"></i>
                </button>
                <button onClick={() => onDeletePet(pet.id)} className="w-8 h-8 bg-slate-100 text-slate-500 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors">
                  <i className="fa-solid fa-trash-can text-xs"></i>
                </button>
              </div>
            </div>
            
            <h3 className="text-xl font-extrabold text-slate-800">{pet.name}</h3>
            <p className="text-sm font-semibold text-indigo-500 mb-4">{pet.species} • {pet.breed}</p>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-50 p-3 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Age</p>
                <p className="text-sm font-bold text-slate-700">{pet.age} Years</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Weight</p>
                <p className="text-sm font-bold text-slate-700">{pet.weight} kg</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Health Notes</p>
              <p className="text-xs text-slate-600 line-clamp-2 italic leading-relaxed">
                {pet.healthNotes || 'No health notes recorded.'}
              </p>
            </div>

            <button 
              onClick={() => onSwitchPet(pet.id)}
              className={`w-full py-3 rounded-xl font-bold transition-all ${
                activeProfileId === pet.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 cursor-default' 
                  : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              {activeProfileId === pet.id ? 'Active Profile' : 'Select Profile'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileView;
