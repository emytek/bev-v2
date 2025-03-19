import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchDataWithCache, createData, updateData, deleteData } from "../services/axiosService";
import { queryClient } from "../utils/reactQueryClient"; 
import { useState } from "react";
import QRCode from "qrcode";

interface User {
  id: string;
  name: string;
}

const ApiTest = () => {
    const [username, setUsername] = useState<string>('')
    const [src, setSrc] = useState<string>('')

    const generate = () => {
        QRCode.toDataURL(`https://github.com/${username}`).then(setSrc);
    }

  // ✅ Fetch Users (Auto-refetch every 5s)
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => fetchDataWithCache("users"),
    staleTime: 5000,
    refetchOnWindowFocus: true,
  });

  const [inputValue, setInputValue] = useState("");

  const handleClick = () => {
    alert(`You entered: ${inputValue}`);
  };

  // ✅ Create User
  const createUserMutation = useMutation({
    mutationFn: (newUser: Partial<User>) => createData("users", newUser),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  // ✅ Update User
  const updateUserMutation = useMutation({
    mutationFn: ({ id, updatedUser }: { id: string; updatedUser: Partial<User> }) =>
      updateData("users", id, updatedUser),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  // ✅ Delete User
  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => deleteData("users", id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  if (isLoading) return <p>Loading...</p>;


  return (
    <>
    <div className="flex items-center justify-center space-x-2">
      <h2>Users</h2>
      <ul>
        {users.map((user: User) => (
          <li key={user.id}>
            {user.name}
            <button
              onClick={() => updateUserMutation.mutate({ id: user.id, updatedUser: { name: "Updated Name" } })}
            >
              Update
            </button>
            <button onClick={() => deleteUserMutation.mutate(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={() => createUserMutation.mutate({ name: "New User" })}>Add User</button>
    </div>
    <div className="flex items-center justify-center space-x-2">
    <img src={src} alt="" />
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter text..."
        className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={generate}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Submit
      </button>

      <video id="player" autoPlay></video>
      <canvas id="canvas" width="320px" height="240px"></canvas>
      <button>Capture</button>

      <div id="pick-image">
        <h6>Pick an image instead</h6>
        <input type="text" accept="image/*" id="image-picker" />
      </div>

      <div>
        <input type="text" id="location" />
        <label htmlFor="location">Location</label> 
        </div>
    </div>
    </>
  );
};

export default ApiTest;
