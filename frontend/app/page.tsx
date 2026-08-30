'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface Company {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  created_at: string;
}

export default function Home() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api/v1';

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${API_URL}/companies`);
      setCompanies(response.data);
    } catch (err) {
      setError('Erro ao carregar empresas');
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(`${API_URL}/companies`, {
        name,
        slug,
      });
      setName('');
      setSlug('');
      fetchCompanies();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao criar empresa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>FeedbackHub — Gerenciar Empresas</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '20px' }}>
        <h2>Criar Nova Empresa</h2>
        <div style={{ marginBottom: '10px' }}>
          <label>Nome:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Slug (lowercase-com-hifen):</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            pattern="^[a-z0-9\-]+$"
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          {loading ? 'Criando...' : 'Criar Empresa'}
        </button>
      </form>

      <h2>Empresas Cadastradas</h2>
      {companies.length === 0 ? (
        <p>Nenhuma empresa cadastrada</p>
      ) : (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '10px' }}>Nome</th>
              <th style={{ textAlign: 'left', padding: '10px' }}>Slug</th>
              <th style={{ textAlign: 'left', padding: '10px' }}>Ativo</th>
              <th style={{ textAlign: 'left', padding: '10px' }}>Criado</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>{company.name}</td>
                <td style={{ padding: '10px' }}>{company.slug}</td>
                <td style={{ padding: '10px' }}>{company.is_active ? 'Sim' : 'Não'}</td>
                <td style={{ padding: '10px' }}>{new Date(company.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
