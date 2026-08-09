export default function PlaygroundPanel({ queryText, onQueryChange, onExecute, loading, error }) {
  return (
    <section className="editor-panel">
      <div className="panel-header">
        <div>
          <h2>Playground</h2>
          <p>Paste an OpenSearch DSL query and execute it against the indexer proxy.</p>
        </div>
        <button onClick={onExecute} className="primary-button" disabled={loading}>
          {loading ? 'Executing...' : 'Execute'}
        </button>
      </div>
      <textarea
        className="query-editor"
        value={queryText}
        onChange={(event) => onQueryChange(event.target.value)}
        spellCheck={false}
      />
      {error && <div className="error-box">{error}</div>}
    </section>
  );
}
