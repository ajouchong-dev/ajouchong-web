import React, { useEffect } from 'react';
import './styles.css';

const Map = () => {
    const KAKAO_APP_KEY = '42fccd709a486ca4c67c989badd72a15';
    const AJOU_COORDINATES = {
        lat: 37.2832139,
        lng: 127.0459682
    };

    const mapInfo = [
        { label: '주소', content: '경기 수원시 원천동 아주대학교 신학생회관 208호' },
        { label: '연락처', content: '총학생회장 이재건 010-9607-2128' },
        { label: '재실 시간', content: '10:00 ~ 16:30' }
    ];

    const loadKakaoMap = () => {
        const container = document.getElementById('map');
        const options = {
            center: new window.kakao.maps.LatLng(AJOU_COORDINATES.lat, AJOU_COORDINATES.lng),
            level: 3,
        };
        
        const map = new window.kakao.maps.Map(container, options);
        const markerPosition = new window.kakao.maps.LatLng(AJOU_COORDINATES.lat, AJOU_COORDINATES.lng);
        const marker = new window.kakao.maps.Marker({ position: markerPosition });
        marker.setMap(map);
    };

    const loadKakaoMapsScript = () => {
        return new Promise((resolve, reject) => {
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
    };

    useEffect(() => {
        const initializeMap = async () => {
            try {
                if (!window.kakao || !window.kakao.maps) {
                    await loadKakaoMapsScript();
                }
                loadKakaoMap();
            } catch (error) {
                console.error('카카오맵 로드 실패:', error);
            }
        };

        initializeMap();
    }, []);

    const renderMapInfo = (info, index) => (
        <div key={index} className="map-subinfo">
            * {info.label}: {info.content}
        </div>
    );

    return (
        <div className="context">
            <div className="contextTitle">오시는 길</div>
            <hr className="titleSeparator" />
            <div className="map-container">
                <div className="map" id="map"></div>
                <div className="map-info">
                    {mapInfo.map(renderMapInfo)}
                </div>
            </div>
        </div>
    );
};

export default Map;
