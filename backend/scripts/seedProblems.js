import mongoose from "mongoose";
import dotenv from "dotenv";
import Problem from "../models/Problem.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

await Problem.deleteMany(); // Optional: clean the collection first

await Problem.insertMany([
  {
    name: "Two Sum",
    description: "Given an array of integers, return indices of the two numbers such that they add up to a specific target.",
    code: "two-sum",
    difficulty: "Easy",
    createdAt: new Date()
  },
  {
    name: "Reverse Linked List",
    statement: "Reverse a singly linked list.",
    code: "reverse-linked-list",
    difficulty: "Easy",
    createdAt: new Date()
  },
  {
    name: "Longest Substring Without Repeating Characters",
    statement: "Given a string, find the length of the longest substring without repeating characters.",
    code: "longest-substring",
    difficulty: "Medium",
    createdAt: new Date()
  }
]);

console.log("Dummy problems seeded.");
process.exit();
