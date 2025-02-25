import React, { useState, useEffect } from 'react';
import { likePost, unlikePost } from '../services/postService';

const PostActions = ({ postId, initialLikeStatus }) => {
  const [liked, setLiked] = useState(initialLikeStatus.liked); 
  const [unliked, setUnliked] = useState(initialLikeStatus.unliked);
  
  useEffect(() => {
    setLiked(initialLikeStatus.liked);
    setUnliked(initialLikeStatus.unliked);
  }, [initialLikeStatus]);

  const handleLike = async () => {
    const response = await likePost(postId);
    if (response.success) {
      setLiked(true);
      setUnliked(false);
    }
  };

  const handleUnlike = async () => {
    const response = await unlikePost(postId); 
    if (response.success) {
      setLiked(false);
      setUnliked(true);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }} className="mt-3">
      <div onClick={handleLike} disabled={!liked}>
        <i className="fa-solid fa-thumbs-up"
           style={{
            cursor: 'pointer',
            color: liked ? '#0dcb0d' : '#bfbfbf',
            fontSize: '20px'
          }}></i>
      </div>

      <div onClick={handleUnlike} disabled={!liked}>
        <i className="fa-solid fa-thumbs-down"
           style={{
            cursor: 'pointer',
            color: unliked ? 'red' : '#bfbfbf',
            fontSize: '20px',
            marginLeft: '10px'
          }}></i>
      </div>
    </div>
  );
};

export default PostActions;
