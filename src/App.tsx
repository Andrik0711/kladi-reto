import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import { ProductProvider } from './context/ProductContext';
import EditProducts from './pages/EditProducts';
export default function App() {
    return (
        <ProductProvider>
            <Router>
                <Container maxWidth="lg">
                    <Routes>
                        <Route path="/" element={<EditProducts />} />
                    </Routes>
                </Container>
            </Router>
        </ProductProvider>
    );
}
