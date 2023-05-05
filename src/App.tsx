import "./App.css";
import axiosInstance from "./utils/apiAgent";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";

const fetchPosts = async () => {
  const { data } = await axiosInstance.get("/posts");
  return data;
};

const createPost = async (post: {
  title: string;
  body: string;
  userId: number;
}) => {
  const { data } = await axiosInstance.post("/posts", post);
  return data;
};

function App() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    cacheTime: 60000, // 1 minute
  });

  const { isLoading: formLoading, mutate } = useMutation({
    mutationFn: createPost,
  });

  const handleCreatePost = (post: {
    title: string;
    body: string;
    userId: number;
  }) => {
    mutate(post);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading data</div>;
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
          </tr>
        </thead>
        <tbody>
          {data.map((post: { id: number; title: string }) => (
            <tr key={post.id}>
              <td>{post.id}</td>
              <td>{post.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          width: "50%",
          margin: "50px auto",
        }}
        onSubmit={(e) => {
          e.preventDefault();
          handleCreatePost({ title, body, userId: 1 });
          setTitle("");
          setBody("");
        }}
      >
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label>
          Body:
          <textarea
            name="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={formLoading}>
          {formLoading ? "Creating..." : "Create Post"}
        </button>
      </form>
    </>
  );
}

export default App;
