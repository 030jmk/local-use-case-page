import React, { useState, useEffect } from 'react';
import { Search, X, Plus, Edit2, Trash2, Save, Filter } from 'lucide-react';

const INDUSTRIES = [
  'Automotive',
  'Energy Sector', 
  'Financial Services',
  'Health Industries',
  'Industrial Products',
  'International Markets',
  'Private Equity',
  'Real Estate',
  'Retail and Consumer',
  'Startups',
  'Supervisory Board',
  'Technology, Media and Telecommunications',
  'Transport and Logistics'
];

const SAMPLE_CASES = [
  {
    id: 1,
    title: 'Predictive Maintenance for Manufacturing',
    description: 'AI-powered system that predicts equipment failures before they occur, reducing downtime and maintenance costs.',
    hashtags: ['Industrial Products', 'IoT', 'Machine Learning', 'Predictive Analytics'],
    challenge: 'Manufacturing companies face unexpected equipment breakdowns that result in costly downtime, lost productivity, and emergency repair expenses.',
    solution: 'Deploy AI algorithms that analyze sensor data, vibration patterns, temperature readings, and historical maintenance records to predict when equipment is likely to fail.',
    technologies: ['Machine Learning', 'IoT Sensors', 'Data Analytics Platform', 'Cloud Computing'],
    screenshot: 'https://via.placeholder.com/600x400/FD5108/FFFFFF?text=Predictive+Maintenance',
    link: 'https://google.com',
    contact: 'Sarah M.',
    email: 'sarah@example.com'
  },
  {
    id: 2,
    title: 'AI-Powered Fraud Detection',
    description: 'Real-time fraud detection system that identifies suspicious transactions and prevents financial losses.',
    hashtags: ['Financial Services', 'Real-time Analytics', 'Risk Management'],
    challenge: 'Financial institutions struggle with increasing sophisticated fraud attempts that traditional rule-based systems cannot detect.',
    solution: 'Implement machine learning models that analyze transaction patterns, user behavior, and contextual data in real-time to identify fraudulent activities.',
    technologies: ['Machine Learning', 'Real-time Processing', 'Behavioral Analytics', 'API Integration'],
    screenshot: 'https://via.placeholder.com/600x400/FD5108/FFFFFF?text=Fraud+Detection',
    link: 'https://google.com',
    contact: 'Michael R.',
    email: 'michael@example.com'
  },
  {
    id: 3,
    title: 'Smart Supply Chain Optimization',
    description: 'AI-driven supply chain management that optimizes inventory, logistics, and demand forecasting.',
    hashtags: ['Retail and Consumer', 'Transport and Logistics', 'Supply Chain'],
    challenge: 'Retailers face challenges in managing complex supply chains with fluctuating demand, multiple suppliers, and varying lead times.',
    solution: 'Deploy AI algorithms that analyze historical sales data, market trends, weather patterns, and external factors to optimize inventory levels.',
    technologies: ['Machine Learning', 'Demand Forecasting', 'Optimization Algorithms', 'ERP Integration'],
    screenshot: 'https://via.placeholder.com/600x400/FD5108/FFFFFF?text=Supply+Chain',
    link: 'https://google.com',
    contact: 'Lisa T.',
    email: 'lisa@example.com'
  }
];

interface UseCase {
  id: number;
  title: string;
  description: string;
  hashtags: string[];
  challenge: string;
  solution: string;
  technologies: string[];
  screenshot: string;
  link: string;
  contact: string;
  email: string;
}

function App() {
  const [page, setPage] = useState<string>('/');
  const [cases, setCases] = useState<UseCase[]>([]); // Changed to empty array
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false); // New state
  const [filters, setFilters] = useState<string[]>([]);
  const [search, setSearch] = useState<string>('');
  const [selected, setSelected] = useState<UseCase | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [editing, setEditing] = useState<UseCase | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [dark, setDark] = useState<boolean>(true);

  // Keyboard shortcut effect
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && e.key === 'M') {
        e.preventDefault();
        setPage(page === '/mgmt' ? '/' : '/mgmt');
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [page]);

  // Load from localStorage on startup (runs first)
  useEffect(() => {
    console.log('Loading from localStorage...');
    const savedCases = localStorage.getItem('ai-use-cases');
    
    if (savedCases) {
      try {
        const parsed = JSON.parse(savedCases);
        console.log('Found saved cases:', parsed.length, 'items');
        setCases(parsed);
      } catch (error) {
        console.error('Error parsing saved cases:', error);
        setCases(SAMPLE_CASES);
      }
    } else {
      console.log('No saved data found, using sample cases');
      setCases(SAMPLE_CASES);
    }
    
    setHasLoadedFromStorage(true);
  }, []);

  // Save to localStorage whenever cases change (but only after initial load)
  useEffect(() => {
    if (hasLoadedFromStorage && cases.length > 0) {
      console.log('Saving', cases.length, 'cases to localStorage');
      localStorage.setItem('ai-use-cases', JSON.stringify(cases));
      
      // Optional: verify the save worked
      const verification = localStorage.getItem('ai-use-cases');
      console.log('Save verification:', verification ? 'Success' : 'Failed');
    }
  }, [cases, hasLoadedFromStorage]);

  const filtered = cases.filter(c => {
    const matchIndustry = filters.length === 0 || filters.some(f => c.hashtags.includes(f));
    const matchSearch = search === '' || 
      c.hashtags.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    return matchIndustry && matchSearch;
  });

  function toggleFilter(industry: string) {
    setFilters(prev => 
      prev.includes(industry) 
        ? prev.filter(f => f !== industry)
        : [...prev, industry]
    );
  }

  function openDetail(useCase: UseCase) {
    setSelected(useCase);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setSelected(null);
  }

  function openEdit(useCase: UseCase | null = null) {
    setEditing(useCase || {
      id: Date.now(),
      title: '',
      description: '',
      hashtags: [],
      challenge: '',
      solution: '',
      technologies: [],
      screenshot: '',
      link: 'https://google.com',
      contact: '',
      email: ''
    });
    setShowEdit(true);
  }

  function closeEdit() {
    setShowEdit(false);
    setEditing(null);
  }

  function saveCase() {
    if (!editing) return;
    if (cases.find(c => c.id === editing.id)) {
      setCases(prev => prev.map(c => c.id === editing.id ? editing : c));
    } else {
      setCases(prev => [...prev, editing]);
    }
    closeEdit();
  }

  function deleteCase(id: number) {
    setCases(prev => prev.filter(c => c.id !== id));
  }

  function updateField(field: keyof UseCase, value: string | string[]) {
    if (!editing) return;
    setEditing({ ...editing, [field]: value });
  }

  function addTag(tag: string) {
    if (!editing || !tag) return;
    if (!editing.hashtags.includes(tag)) {
      setEditing({ ...editing, hashtags: [...editing.hashtags, tag] });
    }
  }

  function removeTag(tag: string) {
    if (!editing) return;
    setEditing({ ...editing, hashtags: editing.hashtags.filter(t => t !== tag) });
  }

  function addTech(tech: string) {
    if (!editing || !tech) return;
    if (!editing.technologies.includes(tech)) {
      setEditing({ ...editing, technologies: [...editing.technologies, tech] });
    }
  }

  function removeTech(tech: string) {
    if (!editing) return;
    setEditing({ ...editing, technologies: editing.technologies.filter(t => t !== tech) });
  }

  function handleOutsideClick(e: React.MouseEvent<HTMLDivElement>, closeFunc: () => void) {
    if (e.target === e.currentTarget) {
      closeFunc();
    }
  }

  const exportUseCases = () => {
    const dataStr = JSON.stringify(cases, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-use-cases-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importUseCases = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedCases = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedCases)) {
          setCases(importedCases);
        }
      } catch (err) {
        console.error('Error importing file:', err);
        alert('Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  const clearAllUseCases = () => {
    if (window.confirm('Are you sure you want to reset all use cases to defaults? This cannot be undone.')) {
      setCases(SAMPLE_CASES);
    }
  };

  const bgClass = dark ? 'bg-black text-white' : 'bg-white text-black';
  const cardClass = dark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white';
  const inputClass = dark ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-black';
  const buttonClass = dark ? 'border-gray-600 text-white hover:bg-gray-800' : 'border-gray-300 text-black hover:bg-gray-50';

  if (page === '/mgmt') {
    return (
      <div className={`min-h-screen ${bgClass}`}>
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Use Case Management</h1>
            <div className="flex gap-4">
              <button onClick={() => setDark(!dark)} className={`px-4 py-2 rounded-lg border ${buttonClass}`}>
                {dark ? '☀️' : '🌙'}
              </button>
              
              {/* Export Button */}
              <button 
                onClick={exportUseCases} 
                className={`px-4 py-2 rounded-lg border ${buttonClass} flex items-center gap-2`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export
              </button>
              
              {/* Import Button */}
              <label className={`px-4 py-2 rounded-lg border ${buttonClass} flex items-center gap-2 cursor-pointer hover:bg-opacity-80`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={importUseCases}
                  className="hidden"
                />
              </label>
              
              {/* Clear All Button */}
              <button 
                onClick={clearAllUseCases} 
                className={`px-4 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex items-center gap-2`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Reset
              </button>
              
              <button onClick={() => openEdit()} className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600" style={{backgroundColor: '#FD5108'}}>
                <Plus size={20} />
                Add Use Case
              </button>
              
              <button onClick={() => setPage('/')} className={`px-4 py-2 rounded-lg border ${buttonClass}`}>
                View Site
              </button>
            </div>
          </div>

          <div className="grid gap-6">
            {cases.map(c => (
              <div key={c.id} className={`border rounded-lg p-6 ${cardClass}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{c.title}</h3>
                    <p className={`mb-3 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>{c.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {c.hashtags.map(tag => (
                        <span key={tag} className={`px-2 py-1 rounded text-sm ${dark ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-black'}`}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(c)} className={`p-2 ${dark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}>
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => deleteCase(c.id)} className={`p-2 hover:text-red-500 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={(e) => handleOutsideClick(e, closeEdit)}>
            <div className={`rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto ${dark ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    {cases.find(c => c.id === editing?.id) ? 'Edit Use Case' : 'Add Use Case'}
                  </h2>
                  <button onClick={closeEdit} className={`${dark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}>
                    <X size={24} />
                  </button>
                </div>

                <div className="grid gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input type="text" value={editing?.title ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('title', e.target.value)} className={`w-full border rounded-lg px-3 py-2 ${inputClass}`} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea value={editing?.description ?? ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('description', e.target.value)} rows={3} className={`w-full border rounded-lg px-3 py-2 ${inputClass}`} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Challenge</label>
                    <textarea value={editing?.challenge ?? ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('challenge', e.target.value)} rows={4} className={`w-full border rounded-lg px-3 py-2 ${inputClass}`} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Solution</label>
                    <textarea value={editing?.solution ?? ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('solution', e.target.value)} rows={4} className={`w-full border rounded-lg px-3 py-2 ${inputClass}`} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Hashtags</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {editing?.hashtags.map(tag => (
                        <span key={tag} className={`px-2 py-1 rounded text-sm flex items-center gap-1 ${dark ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-black'}`}>
                          #{tag}
                          <button onClick={() => removeTag(tag)} className="text-red-500 hover:text-red-700">
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input type="text" placeholder="Add hashtag..." onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === 'Enter') {
                        addTag(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }} className={`w-full border rounded-lg px-3 py-2 ${inputClass}`} />
                    <div className={`mt-2 text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Quick add industries:
                      <div className="flex flex-wrap gap-1 mt-1">
                        {INDUSTRIES.filter(ind => !editing?.hashtags.includes(ind)).map(industry => (
                          <button key={industry} onClick={() => addTag(industry)} className={`text-xs px-2 py-1 rounded ${dark ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-gray-50 text-black hover:bg-gray-100'}`}>
                            {industry}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Technologies</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {editing?.technologies.map(tech => (
                        <span key={tech} className={`px-2 py-1 rounded text-sm flex items-center gap-1 ${dark ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-black'}`}>
                          {tech}
                          <button onClick={() => removeTech(tech)} className="text-red-500 hover:text-red-700">
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input type="text" placeholder="Add technology..." onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === 'Enter') {
                        addTech(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }} className={`w-full border rounded-lg px-3 py-2 ${inputClass}`} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Contact Person</label>
                      <input type="text" value={editing?.contact ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('contact', e.target.value)} className={`w-full border rounded-lg px-3 py-2 ${inputClass}`} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input type="email" value={editing?.email ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('email', e.target.value)} className={`w-full border rounded-lg px-3 py-2 ${inputClass}`} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Screenshot URL</label>
                    <input type="url" value={editing?.screenshot ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('screenshot', e.target.value)} className={`w-full border rounded-lg px-3 py-2 ${inputClass}`} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Link</label>
                    <input type="url" value={editing?.link ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('link', e.target.value)} className={`w-full border rounded-lg px-3 py-2 ${inputClass}`} />
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                  <button onClick={closeEdit} className={`px-6 py-2 rounded-lg border ${buttonClass}`}>Cancel</button>
                  <button onClick={saveCase} className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2" style={{backgroundColor: '#FD5108'}}>
                    <Save size={18} />
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgClass}`}>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">AI Business Use Cases</h1>
          <button onClick={() => setDark(!dark)} className={`px-4 py-2 rounded-lg border ${buttonClass}`}>
            {dark ? '☀️' : '🌙'}
          </button>
        </div>

        <div className="mb-8">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${dark ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
              <input type="text" placeholder="Search hashtags, titles, or descriptions..." value={search} onChange={(e) => setSearch(e.target.value)} className={`w-full pl-10 pr-4 py-2 border rounded-lg ${inputClass} placeholder-gray-400`} />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className={`border px-4 py-2 rounded-lg flex items-center gap-2 ${buttonClass}`}>
              <Filter size={18} />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className={`border rounded-lg p-4 mb-4 ${cardClass}`}>
              <h3 className="font-medium mb-3">Filter by Industries:</h3>
              <div className="flex flex-wrap gap-2">
                {INDUSTRIES.map(industry => (
                  <button key={industry} onClick={() => toggleFilter(industry)} className={`px-3 py-1 rounded-lg text-sm border transition-colors ${filters.includes(industry) ? 'bg-orange-500 text-white border-orange-500' : buttonClass}`} style={filters.includes(industry) ? {backgroundColor: '#FD5108', borderColor: '#FD5108'} : {}}>
                    {industry}
                  </button>
                ))}
              </div>
              {filters.length > 0 && (
                <button onClick={() => setFilters([])} className={`mt-3 text-sm ${dark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}>
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(c => (
            <div key={c.id} onClick={() => openDetail(c)} className={`border rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow ${cardClass} ${dark ? 'hover:bg-gray-800' : ''}`}>
              <h3 className="text-xl font-semibold mb-3">{c.title}</h3>
              <p className={`mb-4 line-clamp-3 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>{c.description}</p>
              <div className="flex flex-wrap gap-2">
                {c.hashtags.map(tag => (
                  <span key={tag} className={`px-2 py-1 rounded text-sm ${dark ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-black'}`}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className={`text-lg ${dark ? 'text-gray-400' : 'text-gray-500'}`}>No use cases match your current filters.</p>
          </div>
        )}

        {showModal && selected && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={(e) => handleOutsideClick(e, closeModal)}>
            <div className={`rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto ${dark ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">{selected.title}</h2>
                  <button onClick={closeModal} className={`${dark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}>
                    <X size={24} />
                  </button>
                </div>

                <div className="mb-6">
                  <img src={selected.screenshot} alt={selected.title} className="w-full h-64 object-cover rounded-lg" />
                </div>

                <div className="grid gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Challenge</h3>
                    <p className={dark ? 'text-gray-300' : 'text-gray-700'}>{selected.challenge}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Solution</h3>
                    <p className={dark ? 'text-gray-300' : 'text-gray-700'}>{selected.solution}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {selected.technologies.map(tech => (
                        <span key={tech} className={`px-3 py-1 rounded-lg ${dark ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-black'}`}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selected.hashtags.map(tag => (
                        <span key={tag} className={`px-2 py-1 rounded text-sm ${dark ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-black'}`}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={`border-t pt-6 ${dark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">Contact</h3>
                        <p className={dark ? 'text-gray-300' : 'text-gray-700'}>{selected.contact}</p>
                        <p className={dark ? 'text-gray-400' : 'text-gray-600'}>{selected.email}</p>
                      </div>
                      <a href={selected.link} target="_blank" rel="noopener noreferrer" className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600" style={{backgroundColor: '#FD5108'}}>
                        Learn More
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className={`fixed bottom-4 right-4 text-xs opacity-30 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
        Ctrl+Shift+M for management
      </div>
    </div>
  );
}

export default App;