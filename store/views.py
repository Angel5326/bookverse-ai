from django.shortcuts import render
from .models import Book, Category


def home(request):
    books = Book.objects.all()[:8]
    categories = Category.objects.all()
    context = {
        'books': books,
        'categories': categories,
    }
    return render(request, 'store/home.html', context)