import { useState } from 'react';
import { generateQueryPrompt } from '../utils/generateQuery';
import ResultsTable from './ResultsTable';

export default function ChatView({
  queryText,
  setQueryText,
  onExecute,
  responseData,
  setResponseData,
  error,
  setError,
  loading
}) {
  const [promptText, setPromptText] = useState('');
  const [messageText, setMessageText] = useState('');
  const [hasGeneratedQuery, setHasGeneratedQuery] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const handlePromptSubmit = async () => {
    setError(null);
    setResponseData(null);
    setMessageText('');
    setHasGeneratedQuery(false);

    const trimmedPrompt = promptText.trim();
    if (!trimmedPrompt) {
      return;
    }

    try {
      const response = await generateQueryPrompt({ user_prompt: trimmedPrompt });
      setMessageText(response.message || '');
      setQueryText(JSON.stringify(response.query || {}, null, 4));
      setPromptText('');
      setHasGeneratedQuery(true);
    } catch (err) {
      setPopupMessage(err.message || 'An error occurred while generating the query.');
      setShowErrorPopup(true);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handlePromptSubmit();
    }
  };

  return (
    <div className="chat-root">
      <div className="editor-panel chat-query-panel">
        <div className="panel-header">
          <div>
            <h2>Chat</h2>
            <p>Send a prompt and generate an OpenSearch DSL query.</p>
          </div>
        </div>

        <div className="chat-input-panel">
          <textarea
            className="chat-input"
            value={promptText}
            onChange={(event) => setPromptText(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask the assistant to generate a query..."
            rows={3}
          />
          <button onClick={handlePromptSubmit} className="primary-button chat-send-button">
            Send
          </button>
        </div>

        {hasGeneratedQuery && (
          <>
            {messageText && <div className="chat-message-box">{messageText}</div>}

            <textarea
              className="query-editor chat-query-editor"
              value={queryText}
              onChange={(event) => setQueryText(event.target.value)}
              spellCheck={false}
              placeholder="Generated query will appear here..."
              rows={18}
            />

            {error && <div className="error-box">{error}</div>}

            <div className="chat-actions-row">
              <button onClick={onExecute} className="primary-button" disabled={loading}>
                {loading ? 'Executing...' : 'Execute'}
              </button>
            </div>
          </>
        )}
      </div>

      {hasGeneratedQuery && <ResultsTable responseData={responseData} />}

      {showErrorPopup && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <h3>Error</h3>
            <p>{popupMessage}</p>
            <button className="primary-button" onClick={() => setShowErrorPopup(false)}>
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
