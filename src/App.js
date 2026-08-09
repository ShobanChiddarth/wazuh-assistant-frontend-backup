import { useState } from 'react';
import './App.css';

const initialQuery = {
  size: 2,
  _source: [
    '@timestamp',
    'agent.name',
    'agent.ip',
    'agent.id',
    'rule.id',
    'rule.level',
    'rule.description',
    'decoder.name',
    'full_log'
  ],
  query: {
    bool: {
      filter: [
        {
          term: {
            'rule.id': '550'
          }
        }
      ]
    }
  },
  sort: [
    {
      '@timestamp': {
        order: 'desc'
      }
    }
  ]
};

function App() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
  const [page, setPage] = useState('home');
  const [queryText, setQueryText] = useState(JSON.stringify(initialQuery, null, 2));
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const executeQuery = async () => {
    setError(null);
    setResponseData(null);
    let body;

    try {
      body = JSON.parse(queryText);
    } catch (err) {
      setError('Invalid JSON in query editor. Please fix the syntax and try again.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${backendUrl.replace(/\/$/, '')}/indexer-proxy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Request failed: ${res.status} ${res.statusText} ${text}`);
      }

      const data = await res.json();
      setResponseData(data);
    } catch (err) {
      setError(err.message || 'Unable to fetch data from backend.');
    } finally {
      setLoading(false);
    }
  };

  const renderTable = () => {
    if (!responseData || !responseData.hits || !Array.isArray(responseData.hits.hits)) {
      return null;
    }

    const rows = responseData.hits.hits;

    return (
      <div className="results-panel">
        <div className="results-header">
          <h2>Search results</h2>
          <span>{rows.length} records</span>
        </div>
        <div className="results-table-wrap">
          <table className="results-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Agent</th>
                <th>Rule</th>
                <th>Decoder</th>
                <th>Full log</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((hit, index) => {
                const source = hit._source || {};
                return (
                  <tr key={hit._id || index}>
                    <td>{source['@timestamp'] || '-'}</td>
                    <td>{source.agent ? `${source.agent.name || '-'} (${source.agent.ip || '-'})` : '-'}</td>
                    <td>{source.rule ? `${source.rule.id || '-'} / ${source.rule.description || '-'}` : '-'}</td>
                    <td>{source.decoder?.name || '-'}</td>
                    <td className="log-cell">
                      <pre>{source.full_log || '-'}</pre>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (page === 'home') {
    return (
      <div className="app-shell home-screen">
        <div className="home-card">
          <h1>Wazuh Assistant</h1>
          <p>Automated Query generation</p>
          <button onClick={() => setPage('hub')} className="primary-button">
            Enter hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell hub-screen">
      <aside className="sidebar">
        <div className="sidebar-brand">Wazuh Assistant</div>
        <nav>
          <button className="sidebar-item active">Playground</button>
        </nav>
      </aside>
      <main className="main-content">
        <section className="editor-panel">
          <div className="panel-header">
            <div>
              <h2>Playground</h2>
              <p>Paste an OpenSearch DSL query and execute it against the indexer proxy.</p>
            </div>
            <button onClick={executeQuery} className="primary-button" disabled={loading}>
              {loading ? 'Executing...' : 'Execute'}
            </button>
          </div>
          <textarea
            className="query-editor"
            value={queryText}
            onChange={(event) => setQueryText(event.target.value)}
            spellCheck={false}
          />
          {error && <div className="error-box">{error}</div>}
        </section>
        {renderTable()}
      </main>
    </div>
  );
}

export default App;
