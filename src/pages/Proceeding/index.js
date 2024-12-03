import './styles.css';
import React from 'react';

const Proceeding = () => {
    return (
        <div className="context">
            <div className="contextTitle">회의록</div>
            <hr className="titleSeparator"/>
            <ul className="proceeding-container">
            <li><a href="https://drive.google.com/drive/folders/1C2W5ZUTJgJaZPIJiIqTOUYQTIJKIXPU0"> > 중앙위원회 회의록 바로가기 </a></li>
            <li><a href="https://drive.google.com/drive/folders/1e8NACZyIYKgAbgNOgourBjTQwKngwZDo"> > 중앙공간운영위원회 회의록 바로가기 </a></li>
            </ul>
        </div>
    );
}

export default Proceeding;