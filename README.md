# Budget Buddy

A modern web-based personal expense tracker designed to help users log, categorize, and visualize their income and spending. Built with a focus on a clean user interface and a robust technical foundation, this project aims to provide clear insights into personal finances and is planned to include advanced features like predictive analytics.

## Features

* **Detailed Transaction Logging:** Easily add income and expenses with amounts, dates, descriptions, and categories.
* **Multi-Level Categorization:** Organize spending using a hierarchical category system (e.g., Essential/Variable -> Housing/Food -> Rent/Grogage/Groceries).
* **Dashboard Overview:** Visualize key financial data and summaries (Planned: charts, total spending/income).
* **Category-Specific Views:** Drill down into spending for individual categories.
* **Data Persistence:** Stores financial data locally (or via configured database) for historical tracking.
* **AI Integration:** Initial integration with Google AI (Gemini) via Genkit for potential future smart features (e.g., auto-categorization suggestions, anomaly detection - *mentioning this showcases your AI skills*).

## Technologies Used

* **Framework:** Next.js (React)
* **Language:** TypeScript
* **UI Components:** shadcn-ui, Radix UI
* **Styling:** Tailwind CSS
* **AI Integration:** Genkit, Google AI (Gemini)
* **Form Management:** React Hook Form
* **Package Manager:** npm
* **Code Quality:** ESLint

## Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites

* Node.js installed (includes npm)
* Git installed

### Installation and Setup

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/Zahbee/BudgetBuddy.git](https://github.com/Zahbee/BudgetBuddy.git)
    ```
2.  **Navigate to Project Directory:**
    ```bash
    cd BudgetBuddy
    ```
    *(Assuming you named the cloned folder `BudgetBuddy`)*
3.  **Install Dependencies:**
    ```bash
    npm install
    ```
4.  **Set Up Environment Variables:**
    * Create a local environment file:
        ```bash
        touch .env.local
        ```
    * Open `.env.local` and add your Google AI API key (required for Genkit/Gemini features):
        ```env
        GOOGLE_API_KEY=YOUR_ACTUAL_GOOGLE_API_KEY
        ```
        *(Replace `YOUR_ACTUAL_GOOGLE_API_KEY` with your key)*

### Running the Development Server

1.  Start the Next.js development server:
    ```bash
    npm run dev
    ```
    *(The console output will tell you which port the server is running on, likely 3000 or 9002 as per your PDF)*
2.  (Optional) If you are actively working on or testing Genkit flows, you might also run the Genkit development command in a separate terminal:
    ```bash
    npm run genkit:dev
    # or
    npm run genkit:watch
    ```
3.  Access the App:
    Open your web browser and go to the address provided in the `npm run dev` output (e.g., `http://localhost:3000` or `http://localhost:9002`).

## Planned Features & Future Work

* Predictive analytics for future spending using historical data.
* Enhanced data visualizations and reporting.
* Automated transaction categorization suggestions using AI.
* Integration with a persistent database (like SQLite for local use, or PostgreSQL for potential deployment).
* User authentication (if expanded beyond personal use).

---

You can copy and paste this directly into a file named `README.md` in the root of your GitHub repository.
