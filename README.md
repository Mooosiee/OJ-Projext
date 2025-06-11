# OG-OJ

An Online Judge (OJ) is a web-based platform that allows users to solve programming problems by writing and submitting code, which is then automatically compiled, executed, and evaluated against predefined test cases. The primary goal of this OJ system is to assess the correctness and efficiency of code in an automated, fair, and scalable manner.

This platform aims to provide a space for competitive programming practice, interview preparation, and general skill development in programming.

## Table of Contents

1.  [Core Features](#core-features)
2.  [High-Level Design (HLD) & Architecture](#high-level-design-hld--architecture)
    *   [Frontend](#frontend)
    *   [Backend](#backend)
    *   [Database](#database)
    *   [Code Execution Engine](#code-execution-engine)
    *   [Message Queue (Optional but Recommended)](#message-queue-optional-but-recommended)
3.  [Database Design](#database-design)
4.  [API Endpoints](#api-endpoints)
5.  [Security Considerations](#security-considerations)
6.  [Challenges and Solutions](#challenges-and-solutions)
7.  [Technology Stack](#technology-stack)
8.  [Setup and Installation](#setup-and-installation)
9.  [Running the Project](#running-the-project)
10. [Contributing](#contributing)
11. [License](#license)

## Core Features

*   **User Registration & Authentication:** Secure sign-up and login functionality. Role-based access control (RBAC) distinguishing between regular users and administrators.
*   **Problem Repository:** A structured collection of coding problems, categorized by topic, tags (e.g., dynamic programming, graphs), and difficulty level (e.g., easy, medium, hard).
*   **Code Submission and Evaluation:**
    *   Users can write or upload code in multiple supported languages.
    *   Submissions are compiled (if necessary) and executed in isolated, sandboxed environments (using Docker containers).
    *   Code is tested against a predefined set of hidden and public test cases.
    *   Submissions are assigned a verdict, such as:
        *   Accepted (AC)
        *   Wrong Answer (WA)
        *   Time Limit Exceeded (TLE)
        *   Memory Limit Exceeded (MLE)
        *   Compilation Error (CE)
        *   Runtime Error (RTE)
*   **Multi-Language Support:** Users can choose from various programming languages (initially C++, with plans for Python, Java, JavaScript).
*   **Profile Page:** Users can view their past submissions and manage their profile.
*   **Admin Capabilities:** Administrators can manage problems (create, update, delete).
*   **(Future Feature) Leaderboard and Scoring:** Tracks users' performance, potentially in real-time or at the end of contests. Points awarded based on correctness and constraints.
*   **(Future Feature) Contests:** Functionality to create and participate in timed coding contests.

## High-Level Design (HLD) & Architecture

The system is designed with a decoupled architecture to ensure scalability and maintainability.

```mermaid
graph TD
    User[Browser User] -->|HTTPS| Frontend[Frontend: React.js + Tailwind CSS]
    Frontend -->|API Calls (REST or GraphQL)| MainBackend[Main Backend: Node.js + Express.js]
    MainBackend -->|CRUD, Auth| Database[MongoDB Atlas]
    MainBackend -->|Job Submission| MessageQueue[Message Queue: RabbitMQ or Redis]
    MessageQueue -->|Job Consumption| CompilerService[Compiler Service / Code Execution Engine]
    CompilerService -->|Spawns| DockerContainer[Docker Container (Ephemeral)]
    DockerContainer -->|Executes Code| UserCode[User Code]
    CompilerService -->|Verdict Update| MainBackend
    AdminUser[Admin User] -->|HTTPS| Frontend

