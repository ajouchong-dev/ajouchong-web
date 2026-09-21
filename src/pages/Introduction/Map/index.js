import React, { useEffect, useCallback, useState } from 'react';
import { ArrowUpRight, Clock, MapPin, Phone } from 'lucide-react';
import './styles.css';

// 상수들을 컴포넌트 외부로 이동
const KAKAO_APP_KEY = '42fccd709a486ca4c67c989badd72a15';
const AJOU_COORDINATES = {
    lat: 37.2832139,
    lng: 127.0459682
};

// 지도를 못 불러왔을 때와 길찾기 버튼에서 여는 카카오맵 주소
const KAKAO_MAP_LINK = `https://map.kakao.com/link/map/아주대학교 신학생회관,${AJOU_COORDINATES.lat},${AJOU_COORDINATES.lng}`;

const MAP_INFO = [
    { label: '주소', content: '경기 수원시 원천동 아주대학교 신학생회관 208호' },
    { label: '연락처', content: '총학생회실 031-219-2870' },
    { label: '재실 시간', content: '10:00 ~ 16:30' }
];

// 항목별 아이콘 (표시용)
const MAP_INFO_ICONS = {
    '주소': MapPin,
    '연락처': Phone,
    '재실 시간': Clock
};

const Map = () => {
    const [mapFailed, setMapFailed] = useState(false);

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
    const renderMapInfo = useCallback((info, index) => {
        const Icon = MAP_INFO_ICONS[info.label] || MapPin;
        return (
            <div key={index} className="map-info__row">
                <dt className="map-info__label">
                    <Icon size={18} aria-hidden="true" />
                    {info.label}
                </dt>
                <dd className="map-info__content">{info.content}</dd>
            </div>
        );
    }, []);

    useEffect(() => {
        const initializeMap = async () => {
            try {
                if (!window.kakao || !window.kakao.maps) {
                    await loadKakaoMapsScript();
                }
                initializeKakaoMap();
            } catch (error) {
                console.error('카카오맵 로드 실패:', error);
                setMapFailed(true);
            }
        };

        initializeMap();
    }, [loadKakaoMapsScript, initializeKakaoMap]);

    return (
        <div className="context">
            <div className="contextTitle">오시는 길</div>
            <hr className="titleSeparator" />
            <div className="map-layout">
                <div className="map-frame">
                    <div className="map-canvas" id="map"></div>
                    {mapFailed && (
                        <div className="map-fallback">
                            <MapPin size={28} aria-hidden="true" />
                            <p>지도를 불러오지 못했습니다.</p>
                            <a
                                className="ui-btn"
                                href={KAKAO_MAP_LINK}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                카카오맵에서 보기
                                <ArrowUpRight size={14} aria-hidden="true" />
                            </a>
                        </div>
                    )}
                </div>
                <div className="map-side">
                    <dl className="map-info">
                        {MAP_INFO.map(renderMapInfo)}
                    </dl>
                    <a
                        className="ui-btn map-directions"
                        href={KAKAO_MAP_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        카카오맵에서 길찾기
                        <ArrowUpRight size={16} aria-hidden="true" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Map;
