const { MongoClient } = require('mongodb');
const { blob } = require('stream/consumers');

// MongoDB connection URL
const url = 'mongodb://localhost:27017/';
const dbName = 'LOST_AND_FOUND';

// Create a new MongoClient
const client = new MongoClient(url);

// Function to create the 'item' collection with indexes
async function createItemCollection() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected successfully to MongoDB");

    // Get the database
    const db = client.db(dbName);

    // Create the 'item' collection with indexes
    await db.createCollection('item', {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["item_id"],
          properties: {
            item_id: {
              bsonType: String,
              description: "Must be a string and is required"
            },
            item_name: {
              bsonType: String,
              description: "Must be a string and is required"
            },
            item_description: {
              bsonType: String,
              description: "Must be a string and is required"
            },
            category: {
              bsonType: String,
              description: "Must be a string and is required"
            },
            title: {
              bsonType: String,
              description: "Must be a string and is required"
            },
            date: {
              bsonType: String,
              description: "Must be a date and is required"
            },
            item_image: {
              bsonType: Blob,
              description: "Must be a string and is required"
            },
            found: {
              bsonType: Boolean,
              description: "Must be a boolean"
            }
          }
        }
      }
    });

    console.log("Item collection created successfully");
  } catch (error) {
    console.error("Error creating item collection:", error);
  } finally {
    // Close the connection
    await client.close();
  }
}

// Call the function to create the 'item' collection
createItemCollection().catch(console.error);
