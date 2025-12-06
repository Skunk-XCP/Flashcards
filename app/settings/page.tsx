'use client';

import { useEffect, useRef, useState } from 'react';
import { exportData, getCards, getDecks, getSettings, importData, saveSettings } from '../../lib/storage';
import { AppSettings, RevisionMode } from '../../lib/types';

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [exportText, setExportText] = useState('');
  const [importText, setImportText] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const loadedSettings = getSettings();
    setSettings(loadedSettings);
  };

  const handleSaveSettings = () => {
    if (!settings) return;
    
    saveSettings(settings);
    showMessage('success', '✅ Paramètres enregistrés !');
  };

  const handleExport = () => {
    const data = exportData();
    setExportText(data);
    showMessage('success', '✅ Données exportées ! Copiez le JSON ci-dessous.');
  };

  const handleCopyExport = () => {
    navigator.clipboard.writeText(exportText);
    showMessage('success', '📋 Copié dans le presse-papier !');
  };

  const handleDownloadExport = () => {
    const blob = new Blob([exportData()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flashcards-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showMessage('success', '💾 Fichier téléchargé !');
  };

  const handleImport = () => {
    if (!importText.trim()) {
      showMessage('error', '❌ Veuillez entrer des données JSON valides');
      return;
    }

    try {
      const success = importData(importText);
      if (success) {
        showMessage('success', '✅ Données importées avec succès !');
        setImportText('');
        loadSettings();
      } else {
        showMessage('error', '❌ Erreur lors de l\'import');
      }
    } catch (error) {
      showMessage('error', '❌ JSON invalide');
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setImportText(text);
      
      try {
        const success = importData(text);
        if (success) {
          showMessage('success', '✅ Fichier importé avec succès !');
          loadSettings();
        } else {
          showMessage('error', '❌ Erreur lors de l\'import du fichier');
        }
      } catch (error) {
        showMessage('error', '❌ Fichier JSON invalide');
      }
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearAllData = () => {
    if (confirm('⚠️ ATTENTION : Cela supprimera TOUTES vos données (cartes, decks, stats). Êtes-vous sûr ?')) {
      if (confirm('Dernière confirmation : Cette action est IRRÉVERSIBLE !')) {
        localStorage.clear();
        showMessage('success', '🗑️ Toutes les données ont été effacées');
        loadSettings();
      }
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  if (!settings) {
    return <div className="min-h-screen p-8">Chargement...</div>;
  }

  const stats = {
    decksCount: getDecks().length,
    cardsCount: getCards().length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-black">⚙️ Paramètres</h1>
          <p className="text-black">Configurez votre application</p>
        </div>

        {/* Message de feedback */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Paramètres de révision */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-black">🎯 Paramètres de révision</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-black">
                Délai autoplay (millisecondes)
              </label>
              <input
                type="number"
                value={settings.autoplayDelay}
                onChange={(e) => setSettings({ ...settings, autoplayDelay: parseInt(e.target.value) || 3000 })}
                min="1000"
                max="30000"
                step="500"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
              />
              <p className="text-sm text-black mt-1">
                Temps d'attente avant de passer à la carte suivante en mode autoplay ({(settings.autoplayDelay / 1000).toFixed(1)}s)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-black">
                Mode de révision par défaut
              </label>
              <select
                value={settings.defaultRevisionMode}
                onChange={(e) => setSettings({ ...settings, defaultRevisionMode: e.target.value as RevisionMode })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
              >
                <option value={RevisionMode.NORMAL}>Normal (Langue cible → Traduction)</option>
                <option value={RevisionMode.REVERSE}>Inversé (Traduction → Langue cible)</option>
                <option value={RevisionMode.WRONG_ONLY}>Cartes ratées uniquement</option>
                <option value={RevisionMode.FAVORITES}>Favoris uniquement</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="showTranslation"
                checked={settings.showTranslationByDefault}
                onChange={(e) => setSettings({ ...settings, showTranslationByDefault: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="showTranslation" className="text-sm font-medium text-black">
                Afficher la traduction par défaut
              </label>
            </div>

            <button
              onClick={handleSaveSettings}
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
            >
              💾 Enregistrer les paramètres
            </button>
          </div>
        </div>

        {/* Export */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-black">📤 Exporter vos données</h2>
          
          <div className="space-y-4">
            <p className="text-black">
              Sauvegardez toutes vos cartes, decks et statistiques en JSON.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={handleExport}
                className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold"
              >
                📋 Afficher l'export
              </button>
              
              <button
                onClick={handleDownloadExport}
                className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
              >
                💾 Télécharger
              </button>
            </div>

            {exportText && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-black">Données exportées</label>
                  <button
                    onClick={handleCopyExport}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    📋 Copier
                  </button>
                </div>
                <textarea
                  value={exportText}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-black font-mono text-xs"
                  rows={8}
                />
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-900">
                💡 <strong>Statistiques actuelles :</strong> {stats.decksCount} deck(s), {stats.cardsCount} carte(s)
              </p>
            </div>
          </div>
        </div>

        {/* Import */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-black">📥 Importer des données</h2>
          
          <div className="space-y-4">
            <p className="text-black">
              Importez des cartes depuis un fichier JSON ou collez directement le JSON.
            </p>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition font-semibold"
              >
                📁 Choisir un fichier JSON
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-black">ou</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-black">
                Coller le JSON ici
              </label>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder='{"decks": [...], "cards": [...], ...}'
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-xs text-black"
                rows={6}
              />
            </div>

            <button
              onClick={handleImport}
              className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold"
            >
              ⬆️ Importer
            </button>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-900">
                ⚠️ <strong>Attention :</strong> L'import remplacera les données existantes. Pensez à exporter d'abord !
              </p>
            </div>
          </div>
        </div>

        {/* Zone dangereuse */}
        <div className="bg-red-50 border-2 border-red-200 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-red-700">🚨 Zone dangereuse</h2>
          
          <div className="space-y-4">
            <p className="text-black">
              Cette action supprimera définitivement toutes vos données.
            </p>
            
            <button
              onClick={handleClearAllData}
              className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
            >
              🗑️ Supprimer toutes les données
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
