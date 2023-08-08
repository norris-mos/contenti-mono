
# Contenti Platform

Welcome to the Contenti platform GitHub repository! This repository contains the implementation details and source code for the Contenti platform, an educational tool that leverages language models for content generation and interactive learning experiences. Below, you'll find information about the architecture, client-side implementation, and server-side services of the Contenti platform.

## Implementation

### Architecture

Contenti utilizes a Hybrid Microservice-based Client-Server architecture to provide a robust and scalable platform. The architecture combines elements of both microservices and traditional client-server models to achieve the following benefits:

- **Small and focused:** Each microservice handles a specific function, ensuring a clear separation of concerns.
- **Decentralized:** Microservices operate independently, allowing them to run in separate containers and avoid monolithic dependencies.
- **Independently deployable:** Microservices can be deployed individually, ensuring that the failure of one service does not disrupt the others.
- **Scalability:** Individual microservices can be scaled up as needed, optimizing resource allocation.

![Architecture Diagram](images/architecture.png)

### Containerization

To manage the complexity of the platform's services, we embraced containerization using Docker. This approach allowed us to isolate services like the CMS, PLM, and backend database within their respective containers. Docker's flexibility facilitated seamless execution across different operating systems.

### Client Side

#### Front-End Framework

The client-side utilizes React with TypeScript for component-based development and static typing. The interface adapts to user interactions, rendering three main components based on the platform's state.

#### CMS Libraries

The CMS leverages open-source contributions from H5P and Lumi Education. H5P's content player and editor, initially written in PHP, were transformed into React wrappers by Lumi Education. This process enhances user experience and performance while maintaining compliance with the GNU General Public License (GNU GPL).

##### H5P Player and Editor

The H5P player and editor components facilitate the creation and display of 50+ H5P content types. These React components interact with the Content Service through API calls, enabling seamless editing and playback of content.

##### Editor Wrapper

The Editor wrapper component extends the editor and player components, adding features such as natural language prompting and metadata collection. Users can input prompts, rate feedback, and compare model outputs.

##### User Login and Authentication

### Server Side

The server-side of the platform consists of three main services:

#### H5P Content Service

The CMS backend handles frontend requests related to H5P content, including creation, editing, deletion, and download. This service employs AJAX to interact with the Lumi Education server for content execution.

#### PLM Service

The PLM service utilizes LangChain to generate H5P content files. User prompts from the Editor wrapper are sent to the specified PLM model through a LangChain script. A structured output parser ensures that the generated text adheres to H5P format requirements.

#### Metadata Service

The metadata database service stores collected data for prompt analysis and reinforcement learning from human feedback (RLHF). PostgreSQL was chosen as the database management system for its scalability and robustness. Metadata includes content IDs, stars awarded, and user reviews, facilitating cross-modal comparisons.

## Get Started

To explore the implementation details and code, feel free to clone this repository and review the source files. If you have any questions or feedback, please don't hesitate to reach out to our team. We hope you find the Contenti platform's implementation insightful and informative.


## Running the Code

To run the Contenti platform, you can use Docker Compose to simplify the setup process. Follow these steps to get started:

1. **Prerequisites**: Make sure you have Docker and Docker Compose installed on your system.

2. **Clone the Repository**: Clone this GitHub repository to your local machine:

   ```bash
   git clone https://github.com/norris-mos/contenti-mono.git
   ```

3. **Navigate to the Repository**: Move into the cloned repository's directory:

   ```bash
   cd Contenti
   ```

4. **Build and Launch Containers**: Run the following command to build and launch the containers using Docker Compose:

   ```bash
   docker-compose up --build
   ```

   This command will initiate the building process for the necessary containers and start the platform. You might need administrative privileges to execute Docker commands.

5. **Access the Platform**: Once the containers are up and running, you can access the Contenti platform by opening your web browser and navigating to `http://localhost:3000`.

6. **Interact with the Platform**: Explore the features and functionalities of the platform. You can create, edit, and view H5P content, generate content using the PLM service, and engage in various interactive learning experiences.

7. **Stopping the Platform**: To stop the platform and shut down the containers, you can use the keyboard shortcut `Ctrl + C` in the terminal where you launched the Docker Compose command. This will gracefully stop the containers and services.

## Troubleshooting

If you encounter any issues during the setup process or while running the platform, make sure you have followed the steps correctly and that your system meets the prerequisites. Additionally, check the terminal output for any error messages or logs that might provide insights into the problem.

If you need further assistance or have questions, feel free to reach out to our support team or refer to the platform's documentation.

Happy exploring and learning with the Contenti platform!
