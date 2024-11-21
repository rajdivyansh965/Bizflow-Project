import React, { useState, useEffect } from "react";
import "../styles/inventory.css";

function InventoryPage() {
  const [skuItems, setSkuItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");

  // Fetch items from the backend on component mount
  useEffect(() => {
    fetch("http://localhost:5000/api/items")
      .then((response) => response.json())
      .then((data) => setSkuItems(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Add a new item via the backend
  const addSkuItem = (e) => {
    e.preventDefault();
    if (!itemName || !itemQuantity) {
      alert("Both fields are required!");
      return;
    }

    const newItem = { name: itemName, quantity: itemQuantity };

    fetch("http://localhost:5000/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    })
      .then((response) => response.json())
      .then((data) => {
        setSkuItems([...skuItems, data]); // Update state with the new item
        setItemName("");
        setItemQuantity("");
      })
      .catch((error) => console.error("Error adding item:", error));
  };

  return (
    <div className="inventory-container">
      <h1>Inventory Management</h1>
      <form className="inventory-form" onSubmit={addSkuItem}>
        <div className="form-group">
          <label htmlFor="itemName">Item Name:</label>
          <input
            type="text"
            id="itemName"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="Enter item name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="itemQuantity">Item Quantity:</label>
          <input
            type="number"
            id="itemQuantity"
            value={itemQuantity}
            onChange={(e) => setItemQuantity(e.target.value)}
            placeholder="Enter item quantity"
          />
        </div>
        <button type="submit" className="add-button">
          Add Item
        </button>
      </form>
      <h2>SKU List</h2>
      {skuItems.length > 0 ? (
        <table className="sku-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {skuItems.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No items in inventory.</p>
      )}
    </div>
  );
}

export default InventoryPage;
