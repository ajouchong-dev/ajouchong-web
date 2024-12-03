import React, { useEffect } from 'react';
import './styles.css';

const Map = () => {
    useEffect(() => {
        const loadKakaoMap = () => {
            console.log("Kakao Maps API 로드 성공");  // 로드 확인용
            const container = document.getElementById('map');
            const options = {
                center: new window.kakao.maps.LatLng(37.2832139, 127.0459682),
                level: 3,
            };
            const map = new window.kakao.maps.Map(container, options);
            const markerPosition = new window.kakao.maps.LatLng(37.2832139, 127.0459682);
            const marker = new window.kakao.maps.Marker({ position: markerPosition });
            marker.setMap(map);
            console.log("지도 생성 성공");  // 지도 생성 확인용
        };

        if (!window.kakao || !window.kakao.maps) {
            console.log("Kakao Maps 스크립트 로드 시작");  // 로드 시작 확인용
            const script = document.createElement('script');
            script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=42fccd709a486ca4c67c989badd72a15&autoload=false`;
            script.async = true;
            script.defer = true;
            script.onload = () => {
                console.log("Kakao Maps 스크립트 로드 완료");  // 스크립트 로드 완료 확인용
                window.kakao.maps.load(loadKakaoMap);
            };
            document.head.appendChild(script);
        } else {
            loadKakaoMap();
        }
    }, []);


    return (
        <div className="context">
            <div className="contextTitle">오시는 길</div>
            <hr className="titleSeparator" />
            <div className="map-container">
                <div className="map" id="map" style={{ width: '400px', height: '400px' }}></div>
                <div className="map-info">
                    <div className="map-subinfo">* 주소: 경기 수원시 원천동 아주대학교 신학생회관 208호</div>
                    <div className="map-subinfo">* 연락처: 총학생회장 이홍서 010-5613-0359</div>
                    <div className="map-subinfo">* 재실 시간: 10:00 ~ 16:30</div>
                </div>
            </div>
        </div>
    );
};

export default Map;
