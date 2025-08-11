import React, {useState} from 'react';
import {BrowserRouter as Router, Routes, Route, useLocation, Navigate} from 'react-router-dom';
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
import Campusmap from './pages/Campusmap';
import WritePage from './pages/WritePage';
import QnaDetail from './pages/Qna/QnaDetail';
import BylawsDetail from './pages/Bylaws/BylawsDetail';
import PromotionDetail from './pages/Promotion/promotionDetail';
import RequireWrite from './pages/require/requireWrite';
import RequireDetail from './pages/require/RequireDetail';
import Termsofservice from './pages/Policy/termsofservice';
import Policy from './pages/Policy/policy';
import Profile from "./pages/Profile";
import History from "./history";

import Intro from "./pages/Acentia/intro"
import Goods from "./pages/Acentia/goods";
import Record from "./pages/Acentia/Record";
import Acentia from "./acentia";
import CouncilDetail from "./history/CouncilDetail";

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
                <Route path="/policy/termsofservice" element={<Termsofservice/>}/>
                <Route path="/policy" element={<Policy/>}/>
                <Route path="/sitemap" element={<Sitemap/>}/>
                <Route path="/introduction/about" element={<About/>}/>
                <Route path="/introduction/organization" element={<Organization/>}/>
                <Route path="/introduction/promise" element={<PromiseComponent/>}/>
                <Route path="/introduction/history" element={<History/>}/>
                <Route path="/introduction/map" element={<Map/>}/>
                <Route path="/introduction/campusmap" element={<Campusmap/>}/>
                <Route path="/news/notice" element={<Announcement/>}/>
                <Route path="/notice/:id" element={<AnnouncementDetail/>}/>
                <Route path="/news/planning" element={<Planning/>}/>
                <Route path="/communication/qna" element={<Qna/>}/>
                <Route path="/communication/qna/write" element={<WritePage/>}/>
                <Route path="/communication/qna/:postId" element={<QnaDetail/>}/>
                <Route path="/communication/require" element={<Require/>}/>
                <Route path="/communication/require/write" element={<RequireWrite/>}/>
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
            </Routes>
        </>
    );
};

export default App;
