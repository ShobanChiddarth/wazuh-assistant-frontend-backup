export default function ResultsTable({ responseData }) {
  if (!responseData || !responseData.hits || !Array.isArray(responseData.hits.hits)) {
    return null;
  }

  return (
    <div className="results-panel">
      <div className="results-header">
        <h2>Search results</h2>
        <span>{responseData.hits.hits.length} records</span>
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
            {responseData.hits.hits.map((hit, index) => {
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
}
