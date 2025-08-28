import React, { useEffect, useCallback } from 'react';
import './styles.css';

// 상수들을 컴포넌트 외부로 이동
const KAKAO_APP_KEY = '42fccd709a486ca4c67c989badd72a15';
const AJOU_COORDINATES = {
    lat: 37.2832139,
    lng: 127.0459682
};

const MAP_INFO = [
    { label: '주소', content: '경기 수원시 원천동 아주대학교 신학생회관 208호' },
    { label: '연락처', content: '총학생회장 이재건 010-9607-2128' },
    { label: '재실 시간', content: '10:00 ~ 16:30' }
];

const Map = () => {
    // 카카오맵 스크립트 로드 함수
    const loadKakaoMapsScript = useCallback(() => {
        return new Promise((resolve, reject) => {
            
            if (document.querySelector(`script[src*="dapi.kakao.com"]`)) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false`;
            script.async = true;
            script.defer = true;
            script.onload = () => {
                window.kakao.maps.load(resolve);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }, []);

    // 카카오맵 초기화 함수
    const initializeKakaoMap = useCallback(() => {
        const container = document.getElementById('map');
        if (!container) {
            console.error('맵 컨테이너를 찾을 수 없습니다.');
            return;
        }

        const options = {
            center: new window.kakao.maps.LatLng(AJOU_COORDINATES.lat, AJOU_COORDINATES.lng),
            level: 3,
        };
        
        const map = new window.kakao.maps.Map(container, options);
        const markerPosition = new window.kakao.maps.LatLng(AJOU_COORDINATES.lat, AJOU_COORDINATES.lng);
        const marker = new window.kakao.maps.Marker({ position: markerPosition });
        marker.setMap(map);
    }, []);

    // 맵 정보 렌더링 함수
    const renderMapInfo = useCallback((info, index) => (
        <div key={index} className="map-subinfo">
            * {info.label}: {info.content}
        </div>
    ), []);

    useEffect(() => {
        const initializeMap = async () => {
            try {
                if (!window.kakao || !window.kakao.maps) {
                    await loadKakaoMapsScript();
                }
                initializeKakaoMap();
            } catch (error) {
                console.error('카카오맵 로드 실패:', error);
            }
        };

        initializeMap();
    }, [loadKakaoMapsScript, initializeKakaoMap]);

    return (
        <div className="context">
            <div className="contextTitle">오시는 길</div>
            <hr className="titleSeparator" />
            <div className="map-container">
                <div className="map" id="map"></div>
                <div className="map-info">
                    {MAP_INFO.map(renderMapInfo)}
                </div>
            </div>
        </div>
    );
};

export default Map;
