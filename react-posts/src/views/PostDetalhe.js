import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostDetails, updatePost, deletePost, getLikeStatus } from "../services/postService";
import { AuthContext } from "../context/AuthContext";
import PostActions from '../components/PostActions';
import PostComment from '../components/PostComments';

const PostDetail = () => {
  const { post_id } = useParams();
  const navigate = useNavigate();
  const { isAuth } = useContext(AuthContext);
  const [post, setPost] = useState({ title: "", description: "", image: null });
  const [likeStatus, setLikeStatus] = useState({ liked: false, unliked: false });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModalDel, setShowModalDel] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPost = async () => {
      const data = await getPostDetails(post_id);
      if (data.success) {
        setPost(data.post);
        setTitle(data.post.title);
        setDescription(data.post.description);

        // Obter o status de like do post
        const likeData = await getLikeStatus(post_id);
        
        if (likeData.success) {
          setLikeStatus(likeData.data);
        }
      } else {
        setError("Erro ao carregar o post.");
      }
      setLoading(false);
    };

    fetchPost();
  }, [post_id]);

  const userId = parseInt(localStorage.getItem("userId"));
  const isPostOwner = post.user_id === (isAuth ? userId : null);

  const handleEdit = () => {
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleEditChange = (e) => {
    if (e.target.name === "title") setTitle(e.target.value);
    if (e.target.name === "description") setDescription(e.target.value);
  };

  const handleEditPost = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("post_id", post_id);
    formData.append("title", title);
    formData.append("description", description); 
    if (image) formData.append("image", image);

    try {
      const response = await updatePost(post_id, formData);
      if (response.success) {
        setPost(response.post);
        setError("");
        setShowModal(false);
        navigate(`/posts/`);
      } else {
        setError("Falha ao editar o post.");
      }
    } catch (error) {
      setError("Falha ao editar o post.");
    }
  };

  const handleDelete = async () => {
    const response = await deletePost(post.id);
    if (response.success) {
      navigate('/posts');
    } else {
      setError('Erro ao excluir o post');
    }
  };

  const toggleModal = () => {
    setShowModalDel(!showModalDel);
  };

  // if (loading) return <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Carregando...</span></div>;

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-center">
        <div className="row w-100">
          <div className="col-md-8 col-lg-6 mb-4">
            <div className="card shadow-lg">
              <div className="card-body">
                <h1 className="card-title text-primary titlePostDetalhe">{post.title}</h1>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <PostActions postId={post.id} initialLikeStatus={likeStatus} />
                  {isPostOwner && isAuth && (
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm d-flex align-items-center" onClick={handleEdit}>
                        <i className="fas fa-edit me-1"></i> Editar
                      </button>
                      <button className="btn btn-sm d-flex align-items-center" onClick={toggleModal}>
                        <i className="fas fa-trash-alt me-1"></i> Excluir
                      </button>
                    </div>
                  )}
                </div>
                {post.image_url && (
                  <img src={`${process.env.REACT_APP_UPLOADS}${post.image_url}`} className="card-img-top img-fluid" alt={post.title} />
                )}
                <p className="card-text mt-3">{post.description}</p>
              </div>
            </div>
          </div>

          <div className="col-md-4 col-lg-5">
            <PostComment postId={post.id} currentUserId={userId} postOwnerId={post.user_id} />
          </div>
        </div>
      </div>

      {isPostOwner && showModal && (
        <div className="modal show" tabIndex="-1" style={{ display: "block" }} aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Post</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleEditPost}>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">Título</label>
                    <input
                      type="text"
                      id="title"
                      className="form-control"
                      name="title"
                      value={title}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Descrição</label>
                    <textarea
                      id="description"
                      className="form-control"
                      name="description"
                      value={description}
                      onChange={handleEditChange}
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="image" className="form-label">Imagem</label>
                    <input
                      type="file"
                      id="image"
                      className="form-control"
                      onChange={handleFileChange}
                    />
                  </div>
                  <button type="submit" className="btn btn-success w-100">Salvar Alterações</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModalDel && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar exclusão</h5>
              </div>
              <div className="modal-body">
                Tem certeza de que deseja excluir este post?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" onClick={handleDelete}>Sim</button>
                <button type="button" className="btn btn-secondary" onClick={toggleModal}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail
