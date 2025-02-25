import React, { useState, useEffect } from "react";
import {
  getComments,
  createComment,
  editComment,
  deleteComment,
} from "../services/commentService";

const PostComments = ({ postId, currentUserId, postOwnerId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    const response = await getComments(postId);
    if (response.success) {
      setComments(response.comments);
    }
  };

  const handleCreateComment = async () => {
    if (!newComment.trim()) return;
    const response = await createComment(postId, newComment);
    if (response.success) {
      setNewComment("");
      fetchComments();
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return;
    const response = await editComment(commentId, editText);
    if (response.success) {
      setEditingComment(null);
      fetchComments();
    }
  };

  const handleDeleteComment = async (commentId) => {
    const response = await deleteComment(commentId);
    if (response.success) {
      fetchComments();
    }
  };

  return (
    <div className="col">
      <div className="comments-section mt-3">
        <h3 className="mb-4">Comentários</h3>

        {/* Formulário de entrada */}
        <div className="comment-input mb-3">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escreva um comentário..."
            />
            <button className="btn btn-primary" onClick={handleCreateComment}>
              Enviar
            </button>
          </div>
        </div>

        {/* Lista de comentários */}
        <ul className="list-unstyled">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className={`comment-item mb-3 p-3 rounded shadow-sm ${
                comment.deleted === 1 ? "text-muted bg-light" : "border"
              }`}
              style={{
                display:
                  comment.deleted === 1 &&
                  ![currentUserId, postOwnerId].includes(comment.user_id)
                    ? "none"
                    : "block",
              }}
            >
              {editingComment === comment.id ? (
                <div className="d-flex">
                  <input
                    type="text"
                    className="form-control me-2"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button className="btn btn-sm">
                    <i className="fas fa-save text-success" onClick={() => handleEditComment(comment.id)}></i>
                  </button>
                  <button className="btn btn-sm pe-0">
                    <i className="fas fa-times text-secondary" onClick={() => setEditingComment(null)}></i>
                  </button>
                </div>
              ) : (
                <div>
                  {/* Nome do autor e data, somente se o comentário não foi excluído */}
                  {comment.deleted !== 1 && (
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <strong>{comment.user_name}</strong>
                      <span className="text-muted small">
                        {new Date(comment.created_at).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  )}

                  {/* Texto do comentário */}
                  <p className="mb-2">{comment.description}</p>

                  {/* Botões de edição/exclusão */}
                  {comment.deleted !== 1 && (
                    <div className="d-flex justify-content-end gap-2">
                      {comment.user_id === currentUserId && (
                        <button
                          className="btn btn-sm d-flex align-items-center"
                          onClick={() => {
                            setEditingComment(comment.id);
                            setEditText(comment.description);
                          }}
                        >
                          <i className="fas fa-edit me-1"></i> Editar
                        </button>
                      )}

                      {(comment.user_id === currentUserId || postOwnerId === currentUserId) && (
                        <button
                          className="btn btn-sm  d-flex align-items-center"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          <i className="fas fa-trash-alt me-1"></i> Excluir
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PostComments;
