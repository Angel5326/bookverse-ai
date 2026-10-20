# 📚 BookVerse AI - An AI-Powered Online Book Store

BookVerse AI is a full-stack, AI-integrated e-commerce web application designed to revolutionize the online book shopping experience. Built with Django, it allows users to browse, search, and purchase books from various categories, while leveraging the power of Google Gemini AI to generate instant, spoiler-free book summaries.

## ✨ Key Features

*   **🔐 Custom Authentication:** Secure Email-based login, registration, and profile management using Django Allauth.
*   **📖 Dynamic Book Catalog:** Browse books by categories, view detailed descriptions, author info, and images.
*   **🤖 AI Book Summaries:** Integrated with Google Gemini API to generate 3-paragraph, spoiler-free summaries of books instantly. Results are cached in the database to optimize API usage.
*   **🛒 Shopping Cart & Checkout:** Fully functional cart system with quantity management and a simulated checkout process.
*   **📦 Order Management:** Users can view their order history via a personalized dashboard.
*   **📧 Newsletter Subscription:** Users can subscribe to receive updates, with data managed via the admin panel.
*   **🛡️ Custom Admin Panel:** A modern admin interface (powered by Jazzmin) to manage books, authors, categories, orders, and subscribers.
*   **🔌 REST API:** Ready-to-use API endpoints (using Django REST Framework) for future mobile app integration.

## 🛠️ Technology Stack

*   **Backend:** Python, Django, Django REST Framework (DRF)
*   **Frontend:** HTML5, CSS3, JavaScript, Bootstrap 5, Django Templates
*   **Database:** PostgreSQL (Production/Dev)
*   **AI Integration:** Google Gemini API (`google-genai` SDK)
*   **Asynchronous Tasks:** Celery, Redis
*   **Authentication:** Django Allauth, JWT
*   **DevOps:** Docker, Pytest

## 🚀 Local Setup & Installation

Follow these steps to run the project on your local machine:

### 1. Clone the Repository
```bash
git clone https://github.com/Angel5326/bookverse-ai.git
cd bookverse-ai
2. Create and Activate Virtual Environment
bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
3. Install Dependencies
bash
pip install -r requirements.txt
4. Environment Variables Setup
Create a .env file in the root directory (where manage.py is located) and add the following variables:

env
SECRET_KEY=your_django_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Configuration (PostgreSQL)
DB_NAME=bookverse_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432

# Redis (For Celery)
REDIS_URL=redis://localhost:6379/0

# Google Gemini AI
GEMINI_API_KEY=your_google_gemini_api_key
5. Database Setup
Ensure PostgreSQL is installed and running. Create the database:

sql
CREATE DATABASE bookverse_db;
Run migrations:

bash
python manage.py makemigrations
python manage.py migrate
6. Create Superuser (Admin)
bash
python manage.py createsuperuser
(Note: This project uses Email-based login for the admin panel as well).

7. Run the Development Server
bash
python manage.py runserver
Visit http://127.0.0.1:8000/ to view the website. Access the admin panel at http://127.0.0.1:8000/admin/.

👥 Team & Contributions
This project was developed as a major academic project by a team of 6:

Abi Angelin A (Team Lead & Backend): Project architecture, Custom User model, Auth, Integration, & Debugging.

Akash V (Frontend): UI/UX design, Responsive layouts, Bootstrap 5, and Template integration.

Abarna Mary  (Database): Django Models (Books, Authors, Categories), ORM optimization, and Admin configuration.

Akshaya (E-Commerce): Cart logic, Checkout flow, Order processing, and Newsletter system.

Akash A (AI & API): Google Gemini API integration, AI caching, and REST API development.

Adheeshwarar (QA & DevOps): Automated testing (Pytest), Security checks, Dockerization, & Documentation.
