import { Routes, Route, Navigate } from 'react-router-dom';
import DocumentRequestPage from '../pages/user/DocumentRequestPage';
import GeneralInquiryPage from '../pages/user/GeneralInquiryPage';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/request-document" />} />
            <Route path="/request-document" element={<DocumentRequestPage />} />
            <Route path="/general-inquiry" element={<GeneralInquiryPage />} />
            {/* Add more routes here as you create new pages */}
        </Routes>
    );
}