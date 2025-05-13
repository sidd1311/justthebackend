
// const { MongoClient, ObjectId } = require("mongodb");
// const { Server } = require("socket.io");
// require("dotenv").config();
// const { connectToDatabase } = require("./db");

// let db;
// let chatRoomsCollection;
// let io;

// // Initialize database connection before using it
// const initializeDatabase = async () => {
//     try {
//         db = await connectToDatabase();
//         chatRoomsCollection = db.collection("chatRooms");
//         console.log("Database connected successfully");
//     } catch (error) {
//         console.error("Failed to connect to database:", error.message);
//         process.exit(1);
//     }
// };

// const initializeSocket = (server) => {
//     io = new Server(server, {
//         cors: { origin: ["http://localhost:3000", "http://localhost:3001"], methods: ["GET", "POST"] },
//     });

//     io.on("connection", (socket) => {
//         console.log("User connected to Socket.io");

//         socket.on("joinRoom", async ({ userId, doctorId }) => {
//             if (!userId || !doctorId) return;
//             const room = `${userId}-${doctorId}`;
//             socket.join(room);

//             try {
//                 const currentRoom = await chatRoomsCollection.findOne({ userId, doctorId });
//                 if (currentRoom) {
//                     socket.emit("chatHistory", currentRoom.messages);
//                 } else {
//                     socket.emit("roomNotFound");
//                 }
//             } catch (error) {
//                 console.error("Error fetching chat room:", error.message);
//             }
//         });

//         socket.on("sendMessage", async ({ userId, doctorId, message, sentBy }) => {
//             if (!userId || !doctorId || !message || !sentBy) return;
//             console.log("Received message:", { userId, doctorId, message, sentBy });

//             const room = `${userId}-${doctorId}`;
//             try {
//                 const newMessage = { message, timestamp: new Date(), sentBy };
//                 await chatRoomsCollection.updateOne(
//                     { userId, doctorId },
//                     { $push: { messages: newMessage } },
//                     { upsert: true }
//                 );
//                 io.to(room).emit("newMessage", newMessage);
//             } catch (error) {
//                 console.error("Error saving message:", error.message);
//             }
//         });

//         socket.on("disconnect", () => {
//             console.log("User disconnected from Socket.io");
//         });
//     });
//     return io;
// };

// const initiateChat = async (req, res) => {
//     const { userId, doctorId, user_name } = req.body;
    
//     try {
//         let chatRoom = await chatRoomsCollection.findOne({ userId, doctorId });
//         if (!chatRoom) {
//             const newChatRoom = {
//                 userId,
//                 user_name,
//                 doctorId,
//                 messages: [],
//                 createdAt: new Date()
//             };
//             const result = await chatRoomsCollection.insertOne(newChatRoom);
//             newChatRoom._id = result.insertedId;
//             return res.status(201).json({ message: "Chat room created", room: newChatRoom });
//         }
//         res.status(200).json({ message: "Chat room already exists", room: chatRoom });
//     } catch (error) {
//         res.status(500).json({ error: "Internal server error", details: error.message });
//     }
// };

// const getRooms = async (req, res) => {
//     const id = req.user.id;
//     try {
//         const rooms = await chatRoomsCollection.find({
//             $or: [{ doctorId: id }, { userId: id }],
//         }).toArray();

//         if (!rooms.length) {
//             return res.status(404).json({ message: "No rooms found" });
//         }
//         res.json(rooms);
//     } catch (error) {
//         res.status(500).json({ message: "Internal server error", details: error.message });
//     }
// };

// const joinRoom = async (req, res) => {
//     const userId = req.user.id;
//     const { doctorId } = req.body;
//     try {
//         let currentRoom = await chatRoomsCollection.findOne({ userId, doctorId });
//         if (!currentRoom) {
//             const newRoom = { userId, doctorId, messages: [], createdAt: new Date() };
//             const result = await chatRoomsCollection.insertOne(newRoom);
//             currentRoom = { ...newRoom, _id: result.insertedId };
//         }
//         res.json(currentRoom);
//     } catch (error) {
//         res.status(500).json({ error: "Internal server error", details: error.message });
//     }
// };

// const sendMessage = async (req, res) => {
//     const { message, roomId } = req.body;
//     const { id: userId, role } = req.user;
//     try {
//         const roomObjectId = new ObjectId(roomId);
//         const currentRoom = await chatRoomsCollection.findOne({ _id: roomObjectId });
//         if (!currentRoom) return res.status(404).json({ error: "Room not found" });

//         const newMessage = { message, timestamp: new Date(), sentBy: role };
//         await chatRoomsCollection.updateOne(
//             { _id: roomObjectId },
//             { $push: { messages: newMessage } }
//         );

//         io.to(`${currentRoom.userId}-${currentRoom.doctorId}`).emit("newMessage", newMessage);
//         res.json({ message: "Message sent successfully" });
//     } catch (error) {
//         res.status(500).json({ error: "Internal server error", details: error.message });
//     }
// };

// initializeDatabase();

// module.exports = {
//     initiateChat,
//     getRooms,
//     joinRoom,
//     sendMessage,
//     initializeSocket
// };
const { MongoClient, ObjectId } = require("mongodb");
const { Server } = require("socket.io");
const Joi = require("joi");
require("dotenv").config();
const { connectToDatabase } = require("./db");

let db;
let chatRoomsCollection;
let io;

// Initialize database connection
const initializeDatabase = async () => {
    try {
        db = await connectToDatabase();
        chatRoomsCollection = db.collection("chatRooms");
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Failed to connect to database:", error.message);
        process.exit(1);
    }
};

// Joi validation schemas
const initiateChatSchema = Joi.object({
    userId: Joi.string().length(24).hex().required(),
    doctorId: Joi.string().length(24).hex().required(),
    user_name: Joi.string().min(1).max(100).required(),
});

const joinRoomSchema = Joi.object({
    doctorId: Joi.string().length(24).hex().required(),
});

const sendMessageSchema = Joi.object({
    roomId: Joi.string().length(24).hex().required(),
    message: Joi.string().min(1).required(),
});

const socketJoinSchema = Joi.object({
    userId: Joi.string().length(24).hex().required(),
    doctorId: Joi.string().length(24).hex().required(),
});

const socketMessageSchema = Joi.object({
    userId: Joi.string().length(24).hex().required(),
    doctorId: Joi.string().length(24).hex().required(),
    message: Joi.string().min(1).required(),
    sentBy: Joi.string().valid("user", "doctor").required(),
});

// REST: Create chat room
const initiateChat = async (req, res) => {
    const { error, value } = initiateChatSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { userId, doctorId, user_name } = value;

    try {
        let chatRoom = await chatRoomsCollection.findOne({ userId, doctorId });
        if (!chatRoom) {
            const newChatRoom = {
                userId,
                doctorId,
                user_name,
                messages: [],
                createdAt: new Date()
            };
            const result = await chatRoomsCollection.insertOne(newChatRoom);
            newChatRoom._id = result.insertedId;
            return res.status(201).json({ message: "Chat room created", room: newChatRoom });
        }
        res.status(200).json({ message: "Chat room already exists", room: chatRoom });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};

// REST: Get rooms by user ID (user or doctor)
const getRooms = async (req, res) => {
    const id = req.user.id;
    try {
        const rooms = await chatRoomsCollection.find({
            $or: [{ doctorId: id }, { userId: id }],
        }).toArray();

        if (!rooms.length) {
            return res.status(404).json({ message: "No rooms found" });
        }
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", details: error.message });
    }
};

// REST: Join room
const joinRoom = async (req, res) => {
    const userId = req.user.id;
    const { error, value } = joinRoomSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { doctorId } = value;

    try {
        let currentRoom = await chatRoomsCollection.findOne({ userId, doctorId });
        if (!currentRoom) {
            const newRoom = { userId, doctorId, messages: [], createdAt: new Date() };
            const result = await chatRoomsCollection.insertOne(newRoom);
            currentRoom = { ...newRoom, _id: result.insertedId };
        }
        res.json(currentRoom);
    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};

// REST: Send message
const sendMessage = async (req, res) => {
    const { error, value } = sendMessageSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { roomId, message } = value;
    const { id: userId, role } = req.user;

    try {
        const roomObjectId = new ObjectId(roomId);
        const currentRoom = await chatRoomsCollection.findOne({ _id: roomObjectId });
        if (!currentRoom) return res.status(404).json({ error: "Room not found" });

        const newMessage = { message, timestamp: new Date(), sentBy: role };

        await chatRoomsCollection.updateOne(
            { _id: roomObjectId },
            { $push: { messages: newMessage } }
        );

        io.to(`${currentRoom.userId}-${currentRoom.doctorId}`).emit("newMessage", newMessage);
        res.json({ message: "Message sent successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};

// SOCKET.IO
const initializeSocket = (server) => {
    io = new Server(server, {
        cors: { origin: ["http://localhost:3000", "http://localhost:3001"], methods: ["GET", "POST"] },
    });

    io.on("connection", (socket) => {
        console.log("User connected to Socket.io");

        socket.on("joinRoom", async (data) => {
            const { error, value } = socketJoinSchema.validate(data);
            if (error) return;

            const { userId, doctorId } = value;
            const room = `${userId}-${doctorId}`;
            socket.join(room);

            try {
                const currentRoom = await chatRoomsCollection.findOne({ userId, doctorId });
                if (currentRoom) {
                    socket.emit("chatHistory", currentRoom.messages);
                } else {
                    socket.emit("roomNotFound");
                }
            } catch (error) {
                console.error("Error fetching chat room:", error.message);
            }
        });

        socket.on("sendMessage", async (data) => {
            const { error, value } = socketMessageSchema.validate(data);
            if (error) return;

            const { userId, doctorId, message, sentBy } = value;
            const room = `${userId}-${doctorId}`;

            try {
                const newMessage = { message, timestamp: new Date(), sentBy };
                await chatRoomsCollection.updateOne(
                    { userId, doctorId },
                    { $push: { messages: newMessage } },
                    { upsert: true }
                );
                io.to(room).emit("newMessage", newMessage);
            } catch (error) {
                console.error("Error saving message:", error.message);
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected from Socket.io");
        });
    });

    return io;
};

// Initialize DB on load
initializeDatabase();

// Export controllers and socket initializer
module.exports = {
    initiateChat,
    getRooms,
    joinRoom,
    sendMessage,
    initializeSocket,
};
