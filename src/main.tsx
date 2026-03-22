import { createRoot } from 'react-dom/client'
import App from './App';
import './index.css'

console.log('Starting React app...');

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  console.log('Creating React root...');
  const root = createRoot(rootElement);

  console.log('Rendering App...');
  root.render(<App />);

  console.log('React app rendered successfully');
} catch (error) {
  console.error('Failed to start React app:', error);
  // Fallback: show error message
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif; text-align: center;">
        <h1>Application Error</h1>
        <p>Sorry, there was an error loading the application.</p>
        <p>Please try refreshing the page or contact support.</p>
        <details style="margin-top: 20px;">
          <summary>Error Details</summary>
          <pre style="text-align: left; background: #f5f5f5; padding: 10px; margin-top: 10px;">${error instanceof Error ? error.message : String(error)}</pre>
        </details>
      </div>
    `;
  }
}
