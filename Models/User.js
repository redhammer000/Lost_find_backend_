const { MongoClient } = require('mongodb');

// MongoDB connection URL
const url = 'mongodb://localhost:27017/';
const dbName = 'LOST_AND_FOUND';    

// Create a new MongoClient
const client = new MongoClient(url);

// Function to create the 'User' collection with indexes and nested fields
async function createUserCollection() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected successfully to MongoDB");

    // Get the database
    const db = client.db(dbName);

    // Create the 'User' collection with nested address fields
    await db.createCollection('User', {
      validator: {
        $jsonSchema: {
          bsonType: Object,
          required: ["User_id", "User_name", "Phone_no", "address" , "password"],
          properties: {
            User_id: {
              bsonType: String,
              description: "Must be a string and is required"
            },
            User_name: {
              bsonType: String,
              description: "Must be a string and is required"
            },
            password: {
              bsonType: String,
              description: "Must be a string and is required"
            },
            Phone_no: {
              bsonType: String,
              description: "Must be a string and is required"
            },
            address: {
              bsonType: Object,
              required: ["city", "district", "street"],
              properties: {
                city: {
                  bsonType: String,
                  description: "Must be a string and is required"
                },
                district: {
                  bsonType: String,
                  description: "Must be a string and is required"
                },
                street: {
                  bsonType: String,
                  description: "Must be a string and is required"
                }
              }
            }
          }
        }
      }
    });

    console.log("User collection created successfully");
  } catch (error) {
    console.error("Error creating User collection:", error);
  } finally {
    // Close the connection
    await client.close();
  }
}

// Call the function to create the 'User' collection
createUserCollection().catch(console.error);
