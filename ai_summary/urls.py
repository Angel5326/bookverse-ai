from django.urls import path
from . import views

app_name = 'ai_summary'

urlpatterns = [
    path('generate/<int:book_id>/', views.get_summary, name='get_summary'),
]