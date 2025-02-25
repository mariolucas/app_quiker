import React, { useState, useEffect } from 'react';
import { likePost, unlikePost, getPostStats } from '../services/postService';

const PostActions = ({ postId, initialLikeStatus }) => {
  const [liked, setLiked] = useState(initialLikeStatus.liked); 
  const [unliked, setUnliked] = useState(initialLikeStatus.unliked);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalUnlikes, setTotalUnlikes] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  
  const fetchStats = async () => {
    const data = await getPostStats(postId);
    setTotalLikes(data.total_likes);
    setTotalUnlikes(data.total_unlikes);
    setTotalViews(data.total_views);
  };

  useEffect(() => {
    setLiked(initialLikeStatus.liked);
    setUnliked(initialLikeStatus.unliked);  
    fetchStats();
  }, [initialLikeStatus]);

  const handleLike = async () => {
    const response = await likePost(postId);
    if (response.success) {
      setLiked(true);
      setUnliked(false);
      fetchStats();
    }
  };

  const handleUnlike = async () => {
    const response = await unlikePost(postId); 
    if (response.success) {
      setLiked(false);
      setUnliked(true);
      fetchStats();
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }} className="mt-3">
      <div>
        <i className="fa-solid fa-thumbs-up"
           style={{
            cursor: 'pointer',
            color: liked ? '#0dcb0d' : '#bfbfbf',
            fontSize: '20px'
          }} onClick={handleLike} disabled={!liked} ></i> {totalLikes}
      </div>

      <div >
        <i className="fa-solid fa-thumbs-down"
           style={{
            cursor: 'pointer',
            color: unliked ? 'red' : '#bfbfbf',
            fontSize: '20px',
            marginLeft: '10px'
          }} onClick={handleUnlike} disabled={!liked}></i> {totalUnlikes}
      </div>

      <div>
        <i class="fa-solid fa-eye" style={{
              cursor: 'pointer',
              color: '#bfbfbf',
              fontSize: '20px',
              marginLeft: '10px'
            }}></i> {totalViews}
      </div>
    </div>
  );
};

export default PostActions;
