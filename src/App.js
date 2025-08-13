import React from 'react';
import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import './styles/variables.css';
import './styles/utilities.css';
import './App.css';
import Header from './components/Header/Header';
import Breadcrumb from './components/Header/Breadcrumb';
import Footer from './components/Footer';

import Main from './pages/Main';

import About from './pages/Introduction/About';
import Organization from './pages/Introduction/Organization';
import PromiseComponent from './pages/Introduction/Promise';
import Map from './pages/Introduction/Map';
import History from "./pages/Introduction/History";
import Campusmap from './pages/Introduction/Campusmap';

import Announcement from './pages/News/Announcement/index';
import AnnouncementDetail from './pages/News/Announcement/AnnouncementDetail';

import Qna from './pages/Communication/Qna';
import QnaDetail from './pages/Communication/Qna/QnaDetail';
import Require from './pages/Communication/Require';
import RequireDetail from './pages/Communication/Require/RequireDetail';
import WritePage from './pages/Communication/WritePage';

import Bylaws from './pages/Resources/Bylaws';
import BylawsDetail from './pages/Resources/Bylaws/BylawsDetail';
import Proceeding from './pages/Resources/Proceeding';
import Audit from './pages/Resources/Audit';

import Promotion from './pages/Welfare/Promotion';
import PromotionDetail from './pages/Welfare/Promotion/promotionDetail';
import Rental from './pages/Welfare/Rental';

import Profile from "./pages/Auth/Profile";

import Sitemap from './pages/Utility/Sitemap';
import Termsofservice from './pages/Utility/Policy/termsofservice';
import Policy from './pages/Utility/Policy/policy';

import Intro from "./pages/Acentia/intro"
import Goods from "./pages/Acentia/goods";
import Record from "./pages/Acentia/Record";

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Header />
                    <div className="content">
                    <Content /></div>
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
            {showBreadcrumb && <Breadcrumb/>}
            <Routes>
                <Route path="/" element={<Main/>}/>
                
                <Route path="/introduction/about" element={<About/>}/>
                <Route path="/introduction/organization" element={<Organization/>}/>
                <Route path="/introduction/promise" element={<PromiseComponent/>}/>
                <Route path="/introduction/history" element={<History/>}/>
                <Route path="/introduction/map" element={<Map/>}/>
                <Route path="/introduction/campusmap" element={<Campusmap/>}/>
                        
                <Route path="/news/notice" element={<Announcement/>}/>
                <Route path="/notice/:id" element={<AnnouncementDetail/>}/>
                
                <Route path="/communication/qna" element={<Qna/>}/>
                <Route path="/communication/qna/write" element={<WritePage/>}/>
                <Route path="/communication/qna/:postId" element={<QnaDetail/>}/>
                <Route path="/communication/require" element={<Require/>}/>
                <Route path="/communication/require/write" element={<WritePage/>}/>
                <Route path="/communication/require/:id" element={<RequireDetail/>}/>
                
                <Route path="/resources/bylaws" element={<Bylaws/>}/>
                <Route path="/resources/bylaws/:id" element={<BylawsDetail/>}/>
                <Route path="/resources/proceeding" element={<Proceeding/>}/>
                <Route path="/resources/audit" element={<Audit/>}/>
                            
                <Route path="/welfare/promotion" element={<Promotion/>}/>
                <Route path="/welfare/promotion/:postId" element={<PromotionDetail/>}/>
                <Route path="/welfare/rental" element={<Rental/>}/>
                
                <Route path="/acentia/intro" element={<Intro/>}/>
                <Route path="/acentia/goods" element={<Goods/>}/>
                <Route path="/acentia/record" element={<Record/>}/>
                
                <Route path="/profile" element={<Profile/>}/>
                
                <Route path="/sitemap" element={<Sitemap/>}/>
                <Route path="/policy/termsofservice" element={<Termsofservice/>}/>
                <Route path="/policy" element={<Policy/>}/>
            </Routes>
        </>
    );
};

export default App;
