"use client";
import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";

type Comment = {
  id: string;
  text: string;
  timestamp: string;
  userId: string;
  username: string; // Add username for better identification
};

const CommentSection: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");

  // Simulate a unique user ID for the current session
  const currentUser = React.useMemo(() => {
    let userId = localStorage.getItem("userId");
    if (!userId) {
      userId = `user-${Date.now()}`;
      localStorage.setItem("userId", userId);
    }
    return userId;
  }, []);

  const currentUsername = "User " + currentUser.slice(-4); // Mock username from user ID

  // Load comments from localStorage (replace with API call in production)
  useEffect(() => {
    const storedComments = localStorage.getItem("sharedComments");
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    }
  }, []);

  // Save comments globally to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("sharedComments", JSON.stringify(comments));
  }, [comments]);

  // Add a new comment
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const timestamp = new Date().toLocaleString();
    const newCommentObj: Comment = {
      id: Date.now().toString(),
      text: newComment,
      timestamp,
      userId: currentUser,
      username: currentUsername,
    };
    setComments([newCommentObj, ...comments]); // Prepend the new comment
    setNewComment(""); // Clear input
  };

  // Delete a comment (only allowed for the author)
  const handleDeleteComment = (id: string) => {
    const updatedComments = comments.filter((comment) => comment.id !== id);
    setComments(updatedComments);
  };

  // Enable edit mode (only allowed for the author)
  const handleEditComment = (id: string) => {
    const commentToEdit = comments.find((comment) => comment.id === id);
    if (commentToEdit) {
      setEditId(id);
      setEditText(commentToEdit.text);
    }
  };

  // Save the edited comment
  const handleSaveEdit = () => {
    if (editId) {
      setComments(
        comments.map((comment) =>
          comment.id === editId ? { ...comment, text: editText } : comment
        )
      );
      setEditId(null); // Exit edit mode
      setEditText(""); // Clear edit input
    }
  };

  return (
    <div className="max-w-md w-full mx-auto mt-6 p-4 border border-gray-300 rounded-lg shadow-sm">
      <h1 className="text-2xl font-semibold mb-6 text-center">Comment Section</h1>

      {/* Display comments */}
      <div className="h-[400px] overflow-y-auto mb-4 flex flex-col-reverse">
        <ul className="space-y-3">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="border border-gray-300 p-3 rounded-md flex flex-col"
            >
              {editId === comment.id ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={handleSaveEdit} // Save when input loses focus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit(); // Save on Enter key
                  }}
                  className="border border-gray-300 w-full p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                />
              ) : (
                <div className="flex justify-between items-center">
                  <span className="flex-1">{comment.text}</span>
                  {comment.userId === currentUser && (
                    <div className="ml-4 flex space-x-2">
                      <button
                        onClick={() => handleEditComment(comment.id)}
                        className="bg-black text-white px-3 py-1 rounded-md"
                      >
                        <FaRegEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="bg-blue-950 text-white px-3 py-1 rounded-md hover:bg-blue-900"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>
              )}
              <div className="text-sm text-gray-500 mt-1">
                {comment.username} - {comment.timestamp}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Input for new comments */}
      <div className="flex flex-col">
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-200 mb-2"
        />
        <button
          onClick={handleAddComment}
          className="bg-blue-950 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
