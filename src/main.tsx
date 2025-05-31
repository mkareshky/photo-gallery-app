import { StrictMode } from 'react'
import { RouterProvider } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import { router } from './router/index.tsx'
import { PhotoProvider } from './context/PhotoContext.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PhotoProvider>
      <RouterProvider router={router} />
    </PhotoProvider>
  </StrictMode>,
)
