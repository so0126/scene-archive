import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App' // 메이크가 준 App.tsx 경로
import './styles/tailwind.css' // 테일윈드 스타일 적용

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)