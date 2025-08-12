import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const PersonalInfo = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        student_id: '',
        major: '',
        role: 'STUDENT', // 기본 역할 값 설정
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://ajouchong.com/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.code === 1) {
                alert(result.message); // 성공 메시지: 회원가입이 완료되었습니다.
                navigate('/signin');   // 회원가입 성공 시 /signin 페이지로 이동
            } else {
                alert(result.message); // 오류 메시지: 중복된 이메일입니다. 또는 회원가입에 실패했습니다.
            }
        } catch (error) {
            alert("서버에 연결할 수 없습니다. 다시 시도해주세요.");
            console.error("Error:", error);
        }
    };

    return (
        <div className="context">
            <h2>개인정보 입력</h2>
            <hr className="titleSeparator"/>

            <form onSubmit={handleSubmit}>
                <label>
                    이름
                    <input  className="personalinfo" type="text" name="name" value={formData.name} onChange={handleChange} required/>
                </label>
                <br/>
                <label>
                    이메일
                    <input  className="personalinfo" type="email" name="email" value={formData.email} onChange={handleChange} required/>
                </label>
                <br/>
                <label>
                    비밀번호
                    <input className="personalinfo" type="password" name="password" value={formData.password} onChange={handleChange} required/>
                </label>
                <br/>
                <label>
                    학번
                    <input className="personalinfo" type="text" name="student_id" value={formData.student_id} onChange={handleChange} required/>
                </label>
                <br/>
                <label>
                    학과
                    <select name="major" value={formData.major} onChange={handleChange} required>
                        <option value="">학과를 선택하세요</option>
                        <option value="ME">기계공학과</option>
                        <option value="ENV">환경안전공학과</option>
                        <option value="IE">산업공학과</option>
                        <option value="CE">건설시스템공학과</option>
                        <option value="CHE">화학공학과</option>
                        <option value="TSE">교통시스템공학과</option>
                        <option value="MSE">첨단신소재공학과</option>
                        <option value="ARCH">건축학과</option>
                        <option value="CHEMBIO">응용화학생명공학과</option>
                        <option value="ISE">융합시스템공학과</option>
                        <option value="ECE">전자공학과</option>
                        <option value="SW">소프트웨어학과</option>
                        <option value="MEDIA">디지털 미디어학과</option>
                        <option value="MDC">국방디지털융합학과</option>
                        <option value="SECURITY">사이버보안학과</option>
                        <option value="MATH">수학과</option>
                        <option value="PHYSICS">물리학과</option>
                        <option value="CHEM">화학과</option>
                        <option value="BIOLOGY">생명과학과</option>
                        <option value="ABIZ">경영학과</option>
                        <option value="EBIZ">e-비즈니스학과</option>
                        <option value="FE">금융공학과</option>
                        <option value="GB">글로벌경영학과</option>
                        <option value="KOR">국어국문학과</option>
                        <option value="ELL">영어영문학과</option>
                        <option value="FRANCE">불어불문학과</option>
                        <option value="HISTORY">사학과</option>
                        <option value="CULTURE">문화콘텐츠학과</option>
                        <option value="ECONOMY">경제학과</option>
                        <option value="PBA">행정학과</option>
                        <option value="PSY">심리학과</option>
                        <option value="SOCI">사회학과</option>
                        <option value="POL">정치외교학과</option>
                        <option value="SLEZ">스포츠레저학과</option>
                        <option value="MEDICINE">의학과</option>
                        <option value="NURS">간호학과</option>
                        <option value="PHARM">약학대학</option>
                    </select>
                </label>
                <br/>
                <button type="submit">회원가입</button>
            </form>
        </div>
    );
}

export default PersonalInfo;
