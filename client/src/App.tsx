import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AuditResult from './pages/AuditResult'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/audit/:id" element={<AuditResult />} />
    </Routes>
  )
}
