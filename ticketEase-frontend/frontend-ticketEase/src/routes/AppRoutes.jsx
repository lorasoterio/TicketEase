import { Routes, Route, Navigate } from 'react-router-dom';
import DocumentRequestPage from '../pages/user/RequestTicket';


export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/request-document" />} />
            <Route path="/request-document" element={<DocumentRequestPage />} />

            {/* Add more routes here as you create new pages */}
        </Routes>
    );
}