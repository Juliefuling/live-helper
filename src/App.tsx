import AfterLogin from '@/components/layout/AfterLogin';
import { Navigate, Route, Routes } from 'react-router-dom';
import { pages } from '@/pages';
const {
  Login,
  Live,
  Error,
} = pages;

function App() {
  return (
    <Routes>
      <Route path="/" element={<AfterLogin />}>
        <Route index element={<Live />} />
        <Route path="/404" element={<Error status={404} />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Route>
      <Route path="/error" element={<Error status={500} />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App