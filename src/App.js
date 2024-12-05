import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';
import Header from './components/Header/Header';
import Breadcrumb from './components/Header/Breadcrumb';
import Footer from './components/Footer';
import Main from './pages/Main';
import About from './pages/About';
import Organization from './pages/Organization';
import PromiseComponent from './pages/Promise';
import Map from './pages/Map';
import Announcement from './pages/Announcement/index';
import AnnouncementDetail from './pages/Announcement/AnnouncementDetail';
import Planning from './pages/Planning';
import Sitemap from './pages/Sitemap';
import Qna from './pages/Qna';
import Require from './pages/require';
import Bylaws from './pages/Bylaws';
import Proceeding from './pages/Proceeding';
import Audit from './pages/Audit';
import Promotion from './pages/Promotion';
import Rental from './pages/Rental';
import Signin from './pages/Signin';
import Join from './pages/Join';
import Password from './pages/Password';
import Passwordchange from './pages/Pwchange';
import Campusmap from './pages/Campusmap';
import Commu from './pages/commu';
import WritePage from './pages/WritePage';
import QnaDetail from './pages/Qna/QnaDetail';
import BylawsDetail from './pages/Bylaws/BylawsDetail';
import PromotionDetail from './pages/Promotion/promotionDetail';
import PersonalInfo from './pages/Join/PersonalInfo';
import RequireWrite from './pages/require/requireWrite';
import RequireDetail from './pages/require/RequireDetail';
import GoogleOAuthHandler from './components/GoogleOAuthHandler';
import Termsofservice from './pages/Policy/termsofservice';
import Policy from './pages/Policy/policy';
import ProtectedRoute from './components/ProtectedRoute';
import GoogleOAuthCallback from "./components/GoogleOAuthHandler";

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Header />
                    <Content />
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

const Content = () => {
    const location = useLocation();
    const showBreadcrumb = location.pathname !== '/';

    return (
        <>
            {showBreadcrumb && <Breadcrumb />}
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/auth/callback" element={<GoogleOAuthHandler />} />
                <Route path="/policy/termsofservice" element={<Termsofservice />} />
                <Route path="/policy" element={<Policy />} />
                <Route path="/sitemap" element={<Sitemap />} />
                <Route path="/introduction/about" element={<About />} />
                <Route path="/introduction/organization" element={<Organization />} />
                <Route path="/introduction/promise" element={<PromiseComponent />} />
                <Route path="/introduction/map" element={<Map />} />
                <Route path="/introduction/campusmap" element={<Campusmap />} />
                <Route path="/news/notice" element={<Announcement />} />
                <Route path="/notice/:id" element={<AnnouncementDetail />} />
                <Route path="/news/planning" element={<Planning />} />
                <Route path="/communication/qna" element={<ProtectedRoute><Qna /></ProtectedRoute>} />
                <Route path="/communication/qna/write" element={<ProtectedRoute><WritePage /></ProtectedRoute>} />
                <Route path="/communication/qna/:postId" element={<QnaDetail />} />
                <Route path="/communication/require" element={<ProtectedRoute><Require /></ProtectedRoute>} />
                <Route path="/communication/require/write" element={<ProtectedRoute><RequireWrite /></ProtectedRoute>} />
                <Route path="/communication/require/:id" element={<ProtectedRoute><RequireDetail /></ProtectedRoute>} />
                <Route path="/communication/commu" element={<Commu />} />
                <Route path="/resources/bylaws" element={<Bylaws />} />
                <Route path="/resources/bylaws/:id" element={<ProtectedRoute><BylawsDetail /></ProtectedRoute>} />
                <Route path="/resources/proceeding" element={<ProtectedRoute><Proceeding /></ProtectedRoute>} />
                <Route path="/resources/audit" element={<ProtectedRoute><Audit /></ProtectedRoute>} />
                <Route path="/welfare/promotion" element={<ProtectedRoute><Promotion /></ProtectedRoute>} />
                <Route path="/welfare/promotion/:postId" element={<ProtectedRoute><PromotionDetail /></ProtectedRoute>} />
                <Route path="/welfare/rental" element={<Rental />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/join" element={<Join />} />
                <Route path="/password" element={<Password />} />
                <Route path="/pwchange" element={<Passwordchange />} />
                <Route path="/personal-info" element={<PersonalInfo />} />
                <Route path="/auth/callback" element={<GoogleOAuthCallback />} />
            </Routes>
        </>
    );
};

export default App;

