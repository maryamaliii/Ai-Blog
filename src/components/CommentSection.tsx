"use client";
import React, { useState, useEffect } from "react";
import { FaTrash, FaRegEdit } from "react-icons/fa";

type Comment = {
  id: string;
  text: string;
  timestamp: string;
  userId: string;
  username: string;
};

const CommentSection: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");

  // Ensure the userId and username are initialized only in the browser
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      let userId = localStorage.getItem("userId");
      if (!userId) {
        userId = `user-${Date.now()}`;
        localStorage.setItem("userId", userId);
      }
      setCurrentUser(userId);
      setCurrentUsername(`User ${userId.slice(-4)}`);
    }
  }, []);

  // Load comments from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedComments = localStorage.getItem("sharedComments");
      if (storedComments) {
        setComments(JSON.parse(storedComments));
      }
    }
  }, []);

  // Save comments to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sharedComments", JSON.stringify(comments));
    }
  }, [comments]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const timestamp = new Date().toLocaleString();
    const newCommentObj: Comment = {
      id: Date.now().toString(),
      text: newComment,
      timestamp,
      userId: currentUser ?? "",
      username: currentUsername ?? "Anonymous",
    };
    setComments([newCommentObj, ...comments]);
    setNewComment("");
  };

  const handleDeleteComment = (id: string) => {
    setComments(comments.filter((comment) => comment.id !== id));
  };

  const handleEditComment = (id: string) => {
    const commentToEdit = comments.find((comment) => comment.id === id);
    if (commentToEdit) {
      setEditId(id);
      setEditText(commentToEdit.text);
    }
  };

  const handleSaveEdit = () => {
    if (editId) {
      setComments(
        comments.map((comment) =>
          comment.id === editId ? { ...comment, text: editText } : comment
        )
      );
      setEditId(null);
      setEditText("");
    }
  };

  return (
    <div className="max-w-md w-full mx-auto mt-6 p-4 border border-gray-300 rounded-lg shadow-sm">
      <h1 className="text-2xl font-semibold mb-6 text-center">Comment Section</h1>
      <div className="h-[400px] overflow-y-auto mb-4 flex flex-col-reverse">
        <ul className="space-y-3">
          {comments.map((comment) => (
            <li key={comment.id} className="border border-gray-300 p-3 rounded-md">
              {editId === comment.id ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={handleSaveEdit}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
                  className="border border-gray-300 w-full p-2 rounded-md"
                />
              ) : (
                <div className="flex justify-between">
                  <span>{comment.text}</span>
                  {comment.userId === currentUser && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditComment(comment.id)}
                        className="bg-black text-white px-2 py-1 rounded"
                      >
                        <FaRegEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>
              )}
              <div className="text-sm text-gray-500">{`${comment.username} - ${comment.timestamp}`}</div>
            </li>
          ))}
        </ul>
      </div>
      <input
        type="text"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="border border-gray-300 rounded-md p-2 w-full mb-2"
      />
      <button
        onClick={handleAddComment}
        className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
      >
        Post
      </button>
    </div>
  );
};

export default CommentSection;
