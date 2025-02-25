import api from "./api";

const token = localStorage.getItem("token");

export const getPosts = async () => {
  try {
    const response = await api.get("/posts", {
        headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
        }
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar posts", error);
    return { success: false, posts: [] };
  }
};

export const createPost = async (newPost) => {
  try {
    const response = await api.post("/posts", newPost, {
        headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
        }
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar post", error);
    return { success: false, message: "Erro ao criar post" };
  }
};

export const getPostDetails = async (post_id) => {
  try {
    const response = await api.get(`/posts/${post_id}`, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar detalhes do post ${post_id}`, error);
    return { success: false, message: "Erro ao carregar o post" };
  }
};

export const updatePost = async (postId, updatedPost) => {
  try {
    const response = await api.put(`/posts/edit`, updatedPost, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao editar post ${postId}`, error);
    return { success: false, message: "Erro ao editar post" };
  }
};

export const deletePost = async (postId) => {
  try {
    const response = await api.delete(`/posts/delete`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: { post_id: postId },
    });

    return response.data;
  } catch (error) {
    console.error(`Erro ao excluir o post ${postId}`, error);
    return { success: false, message: 'Erro ao excluir post' };
  }
};

export const likePost = async (postId) => {
  try {
    const response = await api.post('/posts/like', { post_id: postId }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('token')}`, 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao curtir o post', error);
    return { success: false, message: 'Erro ao curtir o post' };
  }
};

export const unlikePost = async (postId) => {
  try {
    const response = await api.post('/posts/unlike', { post_id: postId }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('token')}`, 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao descurtir o post', error);
    return { success: false, message: 'Erro ao descurtir o post' };
  }
};

export const getLikeStatus = async (postId) => {
  try {
    const response = await api.get(`/posts/${postId}/like-status`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('token')}`, 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter status de like', error);
    return { success: false, message: 'Erro ao obter status de like' };
  }
};
