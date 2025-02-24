import api from './api';

const token = localStorage.getItem("token");

// Criar um comentário
export const createComment = async (postId, description) => {
  try {

    const response = await api.post('/comments', { post_id: postId, description },{
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
        }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar comentário:', error);
    return { success: false, message: 'Erro ao criar comentário' };
  }
};

// Editar um comentário
export const editComment = async (commentId, description) => {
  try {
    const response = await api.put('/comments', { comment_id: commentId, description },{
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
        }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao editar comentário:', error);
    return { success: false, message: 'Erro ao editar comentário' };
  }
};

// Excluir um comentário
export const deleteComment = async (commentId) => {
  try {
    const response = await api.delete(`/comments/${commentId}`, {
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
        }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao excluir comentário:', error);
    return { success: false, message: 'Erro ao excluir comentário' };
  }
};

// Listar comentários de um post
export const getComments = async (postId) => {
  try {
    const response = await api.get(`/posts/${postId}/comments`, {
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
        }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar comentários:', error);
    return { success: false, message: 'Erro ao buscar comentários' };
  }
};
