// admin/src/pages/Add/Add.jsx
import React, { useContext, useEffect, useState } from "react";
import "./Add.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Add = ({ url }) => {
  const navigate        = useNavigate();
  const { token, admin } = useContext(StoreContext);
  const [image, setImage]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name:        "",
    description: "",
    price:       "",
    category:    "Salad",
  });

  // BUG FIX #33: Guard used `!admin && !token` (AND) — same issue as Orders.
  // A non-admin user with a token bypassed the redirect. Changed to OR.
  useEffect(() => {
    if (!admin || !token) {
      toast.error("Please login as admin first.");
      navigate("/");
    }
  }, [admin, token, navigate]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (loading) return;

    if (!image) {
      toast.error("Please select a product image.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name",        data.name);
      formData.append("description", data.description);
      formData.append("price",       Number(data.price));
      formData.append("category",    data.category);
      formData.append("image",       image);

      const response = await axios.post(
        `${url}/api/food/add`,
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        setData({ name: "", description: "", price: "", category: "Salad" });
        setImage(false);
        toast.success(response.data.message || "Food item added!");
      } else {
        toast.error(response.data.message || "Could not add item.");
      }
    } catch (err) {
      console.error("addFood error:", err);
      toast.error("Network error. Could not add food item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add">
      <form onSubmit={onSubmitHandler} className="flex-col">
        <div className="add-img-upload flex-col">
          <p>Upload image</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt=""
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            accept="image/*"
            hidden
            required
          />
        </div>

        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Type here"
            required
            disabled={loading}
          />
        </div>

        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Write content here"
            required
            disabled={loading}
          />
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product category</p>
            <select
              name="category"
              required
              onChange={onChangeHandler}
              value={data.category}
              disabled={loading}
            >
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product price (₹)</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="number"
              name="price"
              placeholder="e.g. 149"
              min="1"
              required
              disabled={loading}
            />
          </div>
        </div>

        <button type="submit" className="add-btn" disabled={loading}>
          {loading ? "Adding…" : "ADD"}
        </button>
      </form>
    </div>
  );
};

export default Add;
