import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import SwrProvider from '@/lib/swr/SwrProvider'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <SwrProvider>
            <App />
        </SwrProvider>
    </React.StrictMode>,
)
