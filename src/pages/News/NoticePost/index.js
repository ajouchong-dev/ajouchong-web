import './styles.css';
import React,{useState, useEffect} from 'react';
import axios from 'axios';

const NoticePost = () => {

    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 9;

    useEffect(() => {
        // Fetch data from the API
        axios.get('/notice/{id}')
            .then(response => {
                const fetchedPosts = response.data.data.map(post => ({
                    id: post.npost_id,
                    imageUrl: post.imageUrls[0] || '/default-image.jpg',
                    title: post.npTitle,
                    date: new Date(post.npCreateTime).toLocaleDateString(), // Format the date
                }));
                setPosts(fetchedPosts);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
            });
    }, []);



    return (
        <div className="context">
            <div className="contextTitle">공지사항</div>
            <hr className="titleSeparator"/>

            <hr className="contentSeparator"/>
            <div className="postTitleWrapper">
                <div className="post-box" key={post.id}>
                    <div className="post-title">{post.title}</div>
                </div>
            </div>


            <hr className="contentSeparator"/>


            <div className="posts-container">

                {currentPosts.map(post => (
                    <div className="post-box" key={post.id}>
                        <img src={post.imageUrl} alt={post.title} className="post-image"/>
                        <div className="post-title">{post.title}</div>
                        <div className="post-date">{post.date}</div>
                    </div>
                ))}

            </div>


        </div>
    );
}

export default NoticePost;