import React from "react";
import { useForm } from "react-hook-form";

const AddUserForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="user_First_Name">
        First Name:
        <input
          type="text"
          name="user_First_Name"
          id="user_First_Name"
          {...register("user_First_Name", { required: true })}
        />
        {errors.user_First_Name && <span>This field is required</span>}
      </label>
      <label htmlFor="user_Last_Name">
        Last Name:
        <input
          type="text"
          name="user_Last_Name"
          id="user_Last_Name"
          {...register("user_Last_Name", { required: true })}
        />
        {errors.user_Last_Name && <span>This field is required</span>}
      </label>
      <label htmlFor="user_Mail">
        Email:
        <input
          type="email"
          name="user_Mail"
          id="user_Mail"
          {...register("user_Mail", { required: true })}
        />
        {errors.user_Mail && <span>This field is required</span>}
      </label>
      <label htmlFor="user_Password">
        Password:
        <input
          type="password"
          name="user_Password"
          id="user_Password"
          {...register("user_Password", { required: true })}
        />
        {errors.user_Password && <span>This field is required</span>}
      </label>
      <label htmlFor="role">
        Role:
        <select name="role" id="role" {...register("role", { required: true })}>
          <option value="">Select a role</option>
          <option value="admin">Admin</option>
          <option value="notadmin">Not Admin</option>
        </select>
        {errors.role && <span>This field is required</span>}
      </label>
      <button type="submit">Add User</button>
    </form>
  );
};

export default AddUserForm;
