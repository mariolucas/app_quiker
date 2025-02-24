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
            className={`comment-item mb-3 border p-3 rounded ${
              comment.deleted === 1 ? "text-muted" : ""
            }`}
            style={{
              backgroundColor: comment.deleted === 1 ? "#b7b7b7" : "",
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
                <button
                  className="btn btn-success me-2"
                  onClick={() => handleEditComment(comment.id)}
                >
                  Salvar
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditingComment(null)}
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <div>
                <p>{comment.description}</p>
                {/* Exibir somente para o dono do post ou o dono do comentário */}
                {(comment.deleted !== 1) && (
                  <div className="d-flex">
                    {comment.user_id === currentUserId && (
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => {
                          setEditingComment(comment.id);
                          setEditText(comment.description);
                        }}
                      >
                        Editar
                      </button>
                    )}

                    {(comment.user_id === currentUserId || postOwnerId === currentUserId) && (
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      Excluir
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
  );
};

export default PostComments;
