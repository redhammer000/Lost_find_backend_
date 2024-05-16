
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 4000;

// MongoDB connection URL
const url = 'mongodb://localhost:27017/';
const dbName = 'LOST_AND_FOUND';

// Create a new MongoClient
const client = new MongoClient(url);

// Middleware to parse JSON bodies
app.use(express.json());

// Function to insert an item into the database
async function insertItem(itemData) {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected successfully to MongoDB");

    // Get the database
    const db = client.db(dbName);
    const itemCollection = db.collection('item');

    // Insert the new item into the collection
    await itemCollection.insertOne(itemData);
    console.log("Item added successfully");
  } catch (error) {
    console.error("Error adding item:", error);
    throw error; // Rethrow the error to handle it in the route handler
  } finally {
    // Close the connection
    await client.close();
  }
}

// Route to add a new item
app.post('/api/items_insert', async (req, res) => {
  const newItem = req.body; // Item data from request body

  try {
    // Insert the item into the database
    await insertItem(newItem);
    // Respond with success message
    res.status(201).send('Item added successfully');
  } catch (error) {
    res.status(500).send('Error adding item');
  }
});

// Route to get item details by item ID
app.get('/api/items/:itemId', async (req, res) => {
  const itemId = req.params.itemId; // Item ID from request parameters

  try {
    // Connect to MongoDB
    await client.connect();

    // Get the database
    const db = client.db(dbName);
    const itemCollection = db.collection('item');

    // Find item by item_id
    const item = await itemCollection.findOne({ item_id: itemId });

    if (!item) {
      res.status(404).send('Item not found');
    } else {
      // Construct an object with item details
      const itemDetails = {
        _id: item._id,
        item_id: item.item_id,
        item_name: item.item_name,
        item_description: item.item_description,
        category: item.category,
        title: item.title,
        date: item.date,
        item_image: item.item_image,
        found : item.found
        
      };

      res.status(200).json(itemDetails);
    }
  } catch (error) {
    console.error("Error getting item:", error);
    res.status(500).send('Error getting item');
  } finally {
    // Close the connection
    await client.close();
  }
});


// Route to get all items
app.get('/api/items', async (req, res) => {
  try {
    // Connect to MongoDB
    await client.connect();

    // Get the database
    const db = client.db(dbName);
    const itemCollection = db.collection('item');

    // Find all items
    const items = await itemCollection.find({}).toArray();

    if (!items || items.length === 0) {
      res.status(404).send('No items found');
    } else {
      res.status(200).json(items);
    }
  } catch (error) {
    console.error("Error getting items:", error);
    res.status(500).send('Error getting items');
  } finally {
    // Close the connection
    await client.close();
  }
});


// Route to delete an item by item ID
app.delete('/api/items/:itemId', async (req, res) => {
  const itemId = req.params.itemId; // Item ID from request parameters

  try {
    // Connect to MongoDB
    await client.connect();

    // Get the database
    const db = client.db(dbName);
    const itemCollection = db.collection('item');

    // Delete the item by item_id
    const result = await itemCollection.deleteOne({ item_id: itemId });

    if (result.deletedCount === 0) {
      res.status(404).send('Item not found');
    } else {
      res.status(200).send('Item deleted successfully');
    }
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).send('Error deleting item');
  } finally {
    // Close the connection
    await client.close();
  }
});


// Route to update an item by item ID
app.put('/api/items/:itemId', async (req, res) => {
  const itemId = req.params.itemId; // Item ID from request parameters
  const updatedAttributes = req.body; // Updated attributes from request body

  try {
    // Connect to MongoDB
    await client.connect();

    // Get the database
    const db = client.db(dbName);
    const itemCollection = db.collection('item');

    // Find the item by item_id
    const item = await itemCollection.findOne({ item_id: itemId });

    if (!item) {
      res.status(404).send('Item not found');
      return;
    }

    // Update the item's attributes
    const updatedItem = { ...item, ...updatedAttributes };

    // Perform the update
    const result = await itemCollection.updateOne(
      { item_id: itemId },
      { $set: updatedItem }
    );

    if (result.modifiedCount === 0) {
      res.status(404).send('Item not found');
    } else {
      res.status(200).send('Item updated successfully');
    }
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).send('Error updating item');
  } finally {
    // Close the connection
    await client.close();
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
