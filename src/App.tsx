import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

interface User {
  id: number;
  name: string;
  email: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/users"
        );

        // JSONデータの検証
        if (!Array.isArray(response.data)) {
          throw new Error("Invalid data format");
        }

        // データの型チェックと変換
        const validUsers = response.data.map((user: any) => {
          if (
            typeof user.id !== "number" ||
            typeof user.name !== "string" ||
            typeof user.email !== "string"
          ) {
            throw new Error("Invalid user data format");
          }
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        });

        setUsers(validUsers);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError("ネットワークエラーが発生しました");
        } else if (err instanceof Error) {
          setError("データの取得に失敗しました");
        } else {
          setError("予期せぬエラーが発生しました");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="container">読み込み中...</div>;
  }

  if (error) {
    return <div className="container error">{error}</div>;
  }

  return (
    <div className="container">
      <h1>ユーザー一覧</h1>
      <div className="user-list">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
