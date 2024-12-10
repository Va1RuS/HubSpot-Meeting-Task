# API Sample Test

## Getting Started

This project requires a newer version of Node. Don't forget to install the NPM packages afterwards.

You should change the name of the ```.env.example``` file to ```.env```.

Run ```node app.js``` to get things started. Hopefully the project should start without any errors.

## Explanations

The actual task will be explained separately.

This is a very simple project that pulls data from HubSpot's CRM API. It pulls and processes company and contact data from HubSpot but does not insert it into the database.

In HubSpot, contacts can be part of companies. HubSpot calls this relationship an association. That is, a contact has an association with a company. We make a separate call when processing contacts to fetch this association data.

The Domain model is a record signifying a HockeyStack customer. You shouldn't worry about the actual implementation of it. The only important property is the ```hubspot```object in ```integrations```. This is how we know which HubSpot instance to connect to.

The implementation of the server and the ```server.js``` is not important for this project.

Every data source in this project was created for test purposes. If any request takes more than 5 seconds to execute, there is something wrong with the implementation.




# Debrief

### Code Quality and Readability
The codebase would benefit from consistent error handling patterns and better TypeScript integration for type safety. The worker.js file (particularly the data processing functions) should be broken down into smaller, more focused functions. Documentation could be improved with JSDoc comments for complex functions and their parameters. The current mixing of different logging patterns (console.log and winston) should be standardized.

### Project Architecture
The application would benefit from a clear separation of concerns using a layered architecture - separating the data access layer, service layer, and API layer. The HubSpot integration logic should be moved to a dedicated service class. Configuration management should be centralized using a config module instead of scattered environment variable access. A proper dependency injection pattern would make the code more testable and maintainable.

### Performance Optimization
The current implementation has several performance bottlenecks. The batch processing in worker.js (lines 491-508) could be optimized by implementing proper streaming instead of collecting everything in memory. Database operations should be batched more efficiently, and connection pooling should be implemented. The retry mechanism for API calls could be improved with exponential backoff and circuit breaker patterns. Caching frequently accessed data would reduce API calls to HubSpot. The current implementation of processing companies, contacts, and meetings sequentially could be parallelized for better performance.