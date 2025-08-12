import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PostDetail = () => {
    const { id } = useParams();  // Extract the post ID from the URL
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const response = await fetch(`https://www.ajouchong.com/notice/${id}`);
                const result = await response.json();

                if (response.ok) {
                    setPost(result.data);  // Assuming the data contains the post details
                } else {
                    console.error('Failed to fetch post details:', result.message);
                }
            } catch (error) {
                console.error('Error fetching post details:', error);
            }
        };

        fetchPostDetails();
    }, [id]);

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{post.title}</h1>
            <img src={post.imageUrl} alt={post.title} />
            <p>{post.content}</p>  {/* Assuming the post object has a content field */}
            <div>{post.date}</div>
        </div>
    );
};

export default PostDetail;
