export default function HomeScreen({ onEnterHub }) {
  return (
    <div className="app-shell home-screen">
      <div className="home-card">
        <h1>Wazuh Assistant</h1>
        <p>Automated Query generation</p>
        <button onClick={onEnterHub} className="primary-button">
          Enter hub
        </button>
      </div>
    </div>
  );
}
