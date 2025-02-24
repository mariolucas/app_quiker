import React, { useState, useEffect } from "react";
import { getPosts, createPost } from "../services/postService";
import { Link } from "react-router-dom";
const url_uploads = process.env.REACT_APP_UPLOADS;

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", description: "", image: null });
  const [error, setError] = useState("");

  // Carregar os posts
  useEffect(() => {
    async function fetchData() {
      const data = await getPosts();
      if (data.success) {
        setPosts(data.posts);
      }
    }

    fetchData();
  }, []);

  // Manipula os campos de texto
  const handleChange = (e) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  // Manipula o campo de imagem
  const handleFileChange = (e) => {
    setNewPost({ ...newPost, image: e.target.files[0] });
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", newPost.title);
    formData.append("description", newPost.description);
    if (newPost.image) formData.append("image", newPost.image); 

    try {
      const response = await createPost(formData);
      
      if (response.success) {
        setPosts([...posts, response.post]);
        setNewPost({ title: "", description: "", image: null });
        setError("");
        document.getElementById("closeModal").click(); 
      } else {
        setError("Falha ao criar post. Tente novamente.");
      }
    } catch (error) {
      setError("Falha ao criar post. Tente novamente.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Lista de Posts</h2>

      {/* Botão para criar post */}
      <button
        className="btn btn-primary bottom-3 end-3"
        data-bs-toggle="modal"
        data-bs-target="#createPostModal"
      >
        + Criar Post
      </button>

      {/* Modal para criar um novo post */}
      <div className="modal fade" id="createPostModal" tabIndex="-1" aria-labelledby="createPostModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="createPostModalLabel">Criar Novo Post</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" id="closeModal"></button>
            </div>
            <div className="modal-body">
              {error && <p className="text-danger">{error}</p>}
              <form onSubmit={handleCreatePost}>
                <input
                  type="text"
                  className="form-control mb-2"
                  name="title"
                  placeholder="Título"
                  value={newPost.title}
                  maxLength="100"
                  onChange={handleChange}
                  required
                />
                <textarea
                  className="form-control mb-2"
                  name="description"
                  placeholder="Descrição"
                  value={newPost.description}
                  onChange={handleChange}
                  required
                ></textarea>
                <input
                  type="file"
                  className="form-control mb-2"
                  name="image"
                  placeholder="URL da Imagem (opcional)"
                  onChange={handleFileChange}
                />
                <button type="submit" className="btn btn-success w-100">
                  Criar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de posts */}
      <div className="row mt-5">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card shadow border-0 rounded-3">
                {post.image_url && (
                  <img
                    src={url_uploads + post.image_url}
                    className="card-img-top"
                    alt={post.title}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title title">{post.title}</h5>
                  <p className="card-text text-muted description">{post.description}</p>
                  <Link className="btn btn-primary w-100" to={`/post/${post.id}`} >Ver mais</Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <p className="lead">Nenhum post disponível.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;
