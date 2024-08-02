import {BrowserRouter,Routes,Route, Router} from 'react-router-dom';
import Form from './pages/Form';


function App() {
  

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Form/>}/>
        </Routes>
      </BrowserRouter>
      
    </>
  )
}

export default App
