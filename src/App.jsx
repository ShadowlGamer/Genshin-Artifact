import { useState } from 'react';
import buildsData from './builds.json';

const SLOT_NAMES = { flower: 'Flower', feather: 'Feather', sands: 'Sands', goblet: 'Goblet', circlet: 'Circlet' };
const SLOT_ICONS = { flower: '🌸', feather: '🍃', sands: '⏳', goblet: '🍷', circlet: '👑' };

const AVERAGE_ROLL = {
  hp: 239, hp_: 4.96, atk: 14, atk_: 4.96, def: 18, def_: 6.2,
  eleMas: 19.8, enerRech_: 5.5, critRate_: 3.3, critDMG_: 6.6,
  healingBonus_: 5.0, physical_dmg_: 5.83
};

const formatName = (str) => {
  if (!str) return '';
  const mappings = {
    atk_: 'ATK%', atk: 'Flat ATK', hp_: 'HP%', hp: 'Flat HP', def_: 'DEF%', def: 'Flat DEF',
    eleMas: 'Elemental Mastery', enerRech_: 'Energy Recharge', critRate_: 'Crit Rate', critDMG_: 'Crit DMG',
    healingBonus_: 'Healing Bonus', physical_dmg_: 'Physical DMG', pyro_dmg_: 'Pyro DMG', hydro_dmg_: 'Hydro DMG',
    cryo_dmg_: 'Cryo DMG', electro_dmg_: 'Electro DMG', anemo_dmg_: 'Anemo DMG', geo_dmg_: 'Geo DMG', dendro_dmg_: 'Dendro DMG'
  };
  return mappings[str] || str.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const GOOD_NAME_TO_BUILD_NAME = {
  "YumemizukiMizuki": "Mizuki", "KamisatoAyaka": "Ayaka", "KamisatoAyato": "Ayato",
  "KaedeharaKazuha": "Kazuha", "SangonomiyaKokomi": "Kokomi", "AratakiItto": "Itto",
  "KujouSara": "Sara", "KukiShinobu": "Shinobu", "YaeMiko": "Yae", "YunJin": "Yunjin",
  "ShikanoinHeizou": "Heizou",
};

const cleanNameForImage = (name) => {
  const mappedName = GOOD_NAME_TO_BUILD_NAME[name] || name;
  return mappedName.replace(/[^a-zA-Z0-9]/g, '');
};

const getCharIcon = (charName) => `/chars/${cleanNameForImage(charName)}.png`;
const getArtifactIcon = (setName) => `/artifacts/${setName.replace(/[^a-zA-Z0-9]/g, '')}.png`;

export default function App() {
  const [inventory, setInventory] = useState(null);
  const [currentTab, setCurrentTab] = useState('home');
  
  const [selectedChar, setSelectedChar] = useState('Kazuha');
  const [activeSlot, setActiveSlot] = useState('flower');
  const [showOptimalOnly, setShowOptimalOnly] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [charSearch, setCharSearch] = useState('');

  // FIXED: Using Tauri v2 getCurrentWindow() API
  const handleMinimize = async () => {
    if (typeof window !== 'undefined' && window.__TAURI_INTERNALS__) {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      getCurrentWindow().minimize();
    }
  };
  const handleMaximize = async () => {
    if (typeof window !== 'undefined' && window.__TAURI_INTERNALS__) {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      getCurrentWindow().toggleMaximize();
    }
  };
  const handleClose = async () => {
    if (typeof window !== 'undefined' && window.__TAURI_INTERNALS__) {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      getCurrentWindow().close();
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        setInventory(json);
        setCurrentTab('home');
      } catch (err) {
        alert("Error reading file.");
      }
    };
    reader.readAsText(file);
  };

  if (!inventory) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center font-sans p-6 rounded-xl overflow-hidden relative">
        {/* FIXED: Moved drag region only to the background spacer */}
        <div className="absolute top-0 left-0 right-0 h-10 flex justify-end items-center px-4 bg-[#09090b] select-none">
           <div data-tauri-drag-region className="absolute inset-0 z-0"></div>
           <div className="flex gap-2 z-10">
              <button onClick={handleMinimize} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/10 text-gray-500 hover:text-white">−</button>
              <button onClick={handleMaximize} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/10 text-gray-500 hover:text-white">□</button>
              <button onClick={handleClose} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white text-gray-500">✕</button>
           </div>
        </div>

        <div className="max-w-xl w-full text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 drop-shadow-[0_0_30px_rgba(147,51,234,0.3)]">
              GenshinZMeows
            </h1>
            <p className="text-gray-400 text-lg">
              Upload your <span className="text-white font-bold">.GOOD</span> file to analyze your account, plan builds, and find the perfect artifacts.
            </p>
          </div>
          
          <label className="block w-full border-2 border-dashed border-white/20 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-300 rounded-3xl p-16 cursor-pointer group">
            <div className="flex flex-col items-center gap-4">
              <span className="text-6xl group-hover:scale-110 transition-transform">📂</span>
              <span className="text-xl font-bold text-gray-300 group-hover:text-white">Click to Upload .GOOD File</span>
            </div>
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>
    );
  }

  const currentBuild = buildsData[selectedChar] || {
    sands: ['atk_'], goblet: ['atk_'], circlet: ['critRate_', 'critDMG_'], subs: ['critRate_', 'critDMG_', 'atk_']
  };

  let rankedArtifacts = { flower: [], feather: [], sands: [], goblet: [], circlet: [] };
  
  if (inventory.artifacts) {
    inventory.artifacts.forEach((art) => {
      let slotKey = art.slotKey;
      if (slotKey === 'plume') slotKey = 'feather';

      let mainStatRank = 0;
      let usefulRolls = 0;
      let weightedRolls = 0;
      let critValue = 0;

      let idealMains = [];
      if (slotKey === 'sands') idealMains = currentBuild.sands;
      if (slotKey === 'goblet') idealMains = currentBuild.goblet;
      if (slotKey === 'circlet') idealMains = currentBuild.circlet;
      if (slotKey === 'flower') idealMains = ['hp'];
      if (slotKey === 'feather') idealMains = ['atk'];

      const foundIndex = idealMains.indexOf(art.mainStatKey);
      if (foundIndex !== -1) mainStatRank = foundIndex + 1;
      const mainStatIsGood = mainStatRank > 0;

      art.substats.forEach((sub) => {
        if (sub.key === 'critRate_') critValue += sub.value * 2;
        if (sub.key === 'critDMG_') critValue += sub.value;

        const priorityIndex = currentBuild.subs.indexOf(sub.key);
        if (priorityIndex !== -1) {
          let rolls = sub.value / (AVERAGE_ROLL[sub.key] || 1);
          if (['atk', 'hp', 'def'].includes(sub.key)) rolls *= 0.15; 
          usefulRolls += rolls;
          
          let weight = 0.25;
          if (priorityIndex === 0 || priorityIndex === 1) weight = 1.0;
          else if (priorityIndex === 2) weight = 0.75;
          else if (priorityIndex === 3) weight = 0.50;

          if (sub.key === 'enerRech_' && sub.value > 20) weight *= 0.2; 
          weightedRolls += rolls * weight;
        }
      });

      let score = 0;
      if (mainStatIsGood) {
        const baseScore = Math.min(70, (usefulRolls / 9) * 70);
        const priorityScore = Math.min(30, (weightedRolls / 9) * 30);
        let rawScore = baseScore + priorityScore;
        if (mainStatRank === 2) rawScore *= 0.85; 
        if (mainStatRank >= 3) rawScore *= 0.70;  
        score = Math.round(rawScore);
      }

      const matchesSearch = art.setKey.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (matchesSearch && (!showOptimalOnly || mainStatIsGood || slotKey === 'flower' || slotKey === 'feather')) {
        rankedArtifacts[slotKey].push({
          ...art, slotKey, score, critValue: critValue.toFixed(1), usefulRolls: usefulRolls.toFixed(1), mainStatIsGood, mainStatRank
        });
      }
    });

    Object.keys(rankedArtifacts).forEach(slot => {
      rankedArtifacts[slot].sort((a, b) => b.score - a.score);
    });
  }

  const groupedArtifacts = {};
  if (rankedArtifacts[activeSlot]) {
    rankedArtifacts[activeSlot].forEach(art => {
      const setName = formatName(art.setKey);
      if (!groupedArtifacts[setName]) groupedArtifacts[setName] = [];
      groupedArtifacts[setName].push(art);
    });
  }

  const filteredChars = Object.keys(buildsData).filter(c => c.toLowerCase().includes(charSearch.toLowerCase())).sort();

  const AvatarImage = ({ char, className }) => {
    const [error, setError] = useState(false);
    if (error) return <div className={`flex items-center justify-center bg-gray-800 text-white font-black text-2xl ${className}`}>{char.charAt(0)}</div>;
    return <img src={getCharIcon(char)} alt={char} className={`${className} object-cover bg-black/50`} onError={() => setError(true)} />;
  };

  const SetImage = ({ setName, className }) => {
    const [error, setError] = useState(false);
    if (error) return <div className={`flex items-center justify-center bg-yellow-500/20 text-yellow-500 font-bold text-xl rounded-full border border-yellow-500/50 ${className}`}>✦</div>;
    return <img src={getArtifactIcon(setName)} alt={setName} className={`${className} object-contain drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]`} onError={() => setError(true)} />;
  };

  return (
    <div className="flex h-screen bg-[#09090b] text-white font-sans overflow-hidden flex-col">
      
      {/* FIXED: Moved drag region to a background layer, buttons are on top */}
      <div className="h-10 bg-[#09090b] flex justify-between items-center px-4 border-b border-white/5 select-none shrink-0 relative">
        <div data-tauri-drag-region className="absolute inset-0 z-0"></div>
        <div className="text-sm font-bold text-gray-500 tracking-wider relative z-10 pointer-events-none">GENSHRINZMEOWS</div>
        <div className="flex gap-2 relative z-10">
           <button onClick={handleMinimize} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/10 text-gray-500 hover:text-white transition-colors">−</button>
           <button onClick={handleMaximize} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/10 text-gray-500 hover:text-white transition-colors">□</button>
           <button onClick={handleClose} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white text-gray-500 transition-colors">✕</button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-[#121214] border-r border-white/5 flex flex-col p-4 z-20 shrink-0">
          <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 px-4 mb-8 mt-2">
            Menu
          </h1>
          
          <nav className="space-y-2 flex-1">
            <button onClick={() => setCurrentTab('home')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentTab === 'home' ? 'bg-purple-600 text-white font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
              <span className="text-xl">🏠</span> Dashboard
            </button>
            <button onClick={() => setCurrentTab('planner')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentTab === 'planner' ? 'bg-purple-600 text-white font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
              <span className="text-xl">⚔️</span> Artifact Planner
            </button>
          </nav>

          <button onClick={() => setInventory(null)} className="w-full mt-auto py-3 rounded-xl border border-white/10 text-gray-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all font-bold text-sm">
            Unload File
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          
          {/* DASHBOARD TAB */}
          {currentTab === 'home' && (
            <div className="p-8 max-w-6xl mx-auto space-y-8">
              <header>
                <h2 className="text-3xl font-black mb-2">Welcome Back!</h2>
                <p className="text-gray-400">Here is a summary of your Genshin Impact account.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#121214] border border-white/10 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-6xl">👥</div>
                  <p className="text-gray-400 font-bold mb-1">Characters Owned</p>
                  <p className="text-5xl font-black text-white">{inventory.characters.length}</p>
                </div>
                <div className="bg-[#121214] border border-white/10 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-6xl">🛡️</div>
                  <p className="text-gray-400 font-bold mb-1">Artifacts Owned</p>
                  <p className="text-5xl font-black text-white">{inventory.artifacts.length}</p>
                </div>
                <div className="bg-[#121214] border border-white/10 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-6xl">🗡️</div>
                  <p className="text-gray-400 font-bold mb-1">Weapons Owned</p>
                  <p className="text-5xl font-black text-white">{inventory.weapons.length}</p>
                </div>
              </div>

              <div className="bg-[#121214] border border-white/10 p-6 rounded-2xl">
                <h3 className="text-xl font-bold mb-4">Your Highest Level Characters</h3>
                <div className="flex flex-wrap gap-4">
                  {[...inventory.characters]
                    .sort((a, b) => b.level - a.level)
                    .slice(0, 8)
                    .map(c => (
                      <div key={c.key} className="flex items-center gap-3 bg-white/5 pr-6 pl-2 py-2 rounded-xl border border-white/5">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
                          <AvatarImage char={c.key} className="w-full h-full" />
                        </div>
                        <div>
                          <p className="font-bold text-sm leading-tight">{c.key}</p>
                          <p className="text-xs text-gray-400">Lvl {c.level} • C{c.constellation}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* ARTIFACT PLANNER TAB */}
          {currentTab === 'planner' && (
            <div className="p-8 max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
                <div>
                  <h2 className="text-3xl font-black mb-1">Artifact Planner</h2>
                  <p className="text-gray-400">Find the best pieces in your inventory for your characters.</p>
                </div>
                
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-3 bg-black hover:bg-white/10 border border-white/20 p-2 pr-6 rounded-xl transition-all shadow-lg group"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-purple-500/50">
                    <AvatarImage char={selectedChar} className="w-full h-full" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Selected</p>
                    <p className="text-md font-black text-white">{selectedChar}</p>
                  </div>
                </button>
              </div>

              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                  {Object.keys(SLOT_NAMES).map(slot => (
                    <button key={slot} onClick={() => setActiveSlot(slot)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold transition-all text-sm ${
                        activeSlot === slot ? 'bg-purple-600 text-white shadow-lg scale-105' : 'bg-[#121214] text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}>
                      <span className="text-lg">{SLOT_ICONS[slot]}</span>
                      {SLOT_NAMES[slot]}
                    </button>
                  ))}
                </div>

                <div className="flex gap-4 w-full lg:w-auto">
                  <input type="text" placeholder="Search sets..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-[#121214] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 w-full lg:w-64 transition-colors text-sm" />
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300 font-medium whitespace-nowrap bg-[#121214] px-4 py-2.5 rounded-lg border border-white/10">
                    <input type="checkbox" checked={showOptimalOnly} onChange={(e) => setShowOptimalOnly(e.target.checked)} className="w-4 h-4 accent-purple-500" />
                    Optimal Only
                  </label>
                </div>
              </div>

              {Object.keys(groupedArtifacts).length === 0 && (
                <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-2xl bg-[#121214]">
                  <p className="text-gray-400 text-lg">No artifacts found for this slot.</p>
                </div>
              )}

              <div className="space-y-6">
                {Object.entries(groupedArtifacts).map(([setName, arts]) => (
                  <div key={setName} className="bg-[#121214] border border-white/10 rounded-xl overflow-hidden shadow-xl">
                    <div className="bg-black/40 px-5 py-3 border-b border-white/10 flex items-center gap-3">
                      <SetImage setName={setName} className="w-8 h-8" />
                      <h3 className="text-lg font-bold text-white capitalize">{setName}</h3>
                    </div>

                    <table className="w-full text-left">
                      <thead className="bg-black/20 border-b border-white/5 text-xs uppercase tracking-wider">
                        <tr>
                          <th className="p-3 font-bold text-gray-500 w-16 text-center">Rank</th>
                          <th className="p-3 font-bold text-gray-500 w-64">Main Stat</th>
                          <th className="p-3 font-bold text-gray-500">Substats</th>
                          <th className="p-3 font-bold text-gray-500 text-center w-20">Rolls</th>
                          <th className="p-3 font-bold text-gray-500 text-center w-24">Crit Value</th>
                          <th className="p-3 font-bold text-gray-500 text-right w-24">Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {arts.map((art, index) => {
                          const isEquippedOnSelected = art.location === selectedChar;

                          return (
                            <tr key={art.id} className={`border-b border-white/5 transition-colors group ${isEquippedOnSelected ? 'bg-green-900/10 hover:bg-green-900/20' : 'hover:bg-white/5'}`}>
                              <td className="p-3 text-gray-500 font-black text-center text-md group-hover:text-purple-400 transition-colors">#{index + 1}</td>
                              <td className="p-3">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <span className={`px-2 py-1 rounded-md text-xs font-black uppercase whitespace-nowrap shadow-sm ${
                                    art.mainStatRank === 1 ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 
                                    art.mainStatRank > 1 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' : 
                                    'bg-red-500/20 text-red-400 border border-red-500/50'
                                  }`}>
                                    {formatName(art.mainStatKey)}
                                  </span>
                                  {art.mainStatRank === 1 && <span className="text-[10px] font-black text-green-400">(Best)</span>}
                                  {art.mainStatRank > 1 && <span className="text-[10px] font-black text-yellow-500">(#{art.mainStatRank} Alt)</span>}
                                </div>
                                
                                <div className="flex items-center gap-2 mt-1">
                                  <p className="text-xs text-gray-500 font-medium">+{art.level} • {art.rarity}★</p>
                                  {art.location ? (
                                    isEquippedOnSelected ? (
                                      <span className="text-[10px] px-2 py-0.5 rounded bg-green-500 text-black font-black uppercase tracking-wider shadow-[0_0_10px_rgba(34,197,94,0.4)]">Equipped Here</span>
                                    ) : (
                                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider">On {art.location}</span>
                                    )
                                  ) : (
                                    <span className="text-[10px] px-2 py-0.5 rounded bg-gray-500/10 text-gray-500 border border-gray-500/20 uppercase tracking-wider">In Inventory</span>
                                  )}
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="flex flex-wrap gap-1.5">
                                  {art.substats.map((sub, i) => {
                                    const isWanted = currentBuild.subs.includes(sub.key);
                                    const isPercent = sub.key.endsWith('_') || sub.key === 'eleMas';
                                    return (
                                      <span key={i} className={`text-[11px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap transition-colors ${
                                        isWanted ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-black/50 text-gray-500 border border-transparent'
                                      }`}>
                                        {formatName(sub.key)}: {sub.value.toFixed(1)}{isPercent ? '%' : ''}
                                      </span>
                                    )
                                  })}
                                </div>
                              </td>
                              <td className="p-3 text-center"><span className="text-xs font-black text-gray-400">{art.usefulRolls}</span></td>
                              <td className="p-3 text-center"><span className="text-xs font-black text-blue-400">{art.critValue}</span></td>
                              <td className="p-3 text-right">
                                <span className={`text-xl font-black ${
                                  art.score >= 80 ? 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]' : 
                                  art.score >= 50 ? 'text-yellow-400' : 
                                  'text-red-400'
                                }`}>
                                  {art.score}%
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-opacity">
            <div className="bg-[#121214] border border-white/10 rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
              
              <div className="p-6 border-b border-white/10 flex items-center gap-4 bg-black/40">
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Select Character</h2>
                <input 
                  type="text" placeholder="Search characters..." value={charSearch} onChange={(e) => setCharSearch(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500 w-full max-w-md ml-auto"
                />
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white font-bold text-xl px-4">✕</button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 custom-scrollbar">
                {filteredChars.map(char => (
                  <button 
                    key={char} 
                    onClick={() => { setSelectedChar(char); setIsModalOpen(false); }}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-200 group ${selectedChar === char ? 'bg-purple-600/20 border border-purple-500/50' : 'hover:bg-white/10 border border-transparent'}`}
                  >
                    <div className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-transform group-hover:scale-110 ${selectedChar === char ? 'border-purple-400' : 'border-white/20'}`}>
                      <AvatarImage char={char} className="w-full h-full" />
                    </div>
                    <span className="text-xs font-bold text-center text-gray-300 group-hover:text-white line-clamp-1">{char}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}